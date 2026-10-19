/** Todas las operaciones quedan limitadas a un único calendario, configurado por el dueño. */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index').setTitle('Familia · Nuestra agenda').addMetaTag('viewport','width=device-width,initial-scale=1');
}
function props_(){ return PropertiesService.getScriptProperties(); }
function calendar_(){
  const id=props_().getProperty('FAMILY_CALENDAR_ID');
  if(!id || id==='primary') throw new Error('El dueño debe configurar el ID del calendario Familia.');
  const calendar=CalendarApp.getCalendarById(id);
  if(!calendar || calendar.getName()!=='Familia') throw new Error('El calendario configurado debe llamarse Familia.');
  return calendar;
}
function digest_(s){return Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,s,Utilities.Charset.UTF_8));}
function equal_(a,b){let n=a.length^b.length;for(let i=0;i<Math.max(a.length,b.length);i++)n|=(a.charCodeAt(i)||0)^(b.charCodeAt(i)||0);return n===0;}
function login(password){
 const lock=LockService.getScriptLock();lock.waitLock(10000);
 try{
  const cache=CacheService.getScriptCache(), failures=Number(cache.get('login_failures')||0);
  if(failures>=10)throw new Error('Demasiados intentos. Esperá 15 minutos y volvé a intentar.');
  const expected=props_().getProperty('FAMILY_PASSWORD');
  if(!expected||expected.length<16)throw new Error('El dueño debe configurar una contraseña de al menos 16 caracteres.');
  if(typeof password!=='string'||password.length>256||!equal_(digest_(password),digest_(expected))){cache.put('login_failures',String(failures+1),900);throw new Error('Contraseña incorrecta.');}
  cache.remove('login_failures');const token=Utilities.getUuid()+Utilities.getUuid();cache.put('session:'+digest_(token),'ok',21600);return token;
 }finally{lock.releaseLock();}
}
function auth_(token){if(typeof token!=='string'||token.length>100||CacheService.getScriptCache().get('session:'+digest_(token))!=='ok')throw new Error('La sesión venció. Salí y volvé a ingresar.');}
function logout(token){auth_(token);CacheService.getScriptCache().remove('session:'+digest_(token));}
function validDay_(s){return typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&Utilities.formatDate(new Date(s+'T12:00:00-03:00'),'America/Argentina/Buenos_Aires','yyyy-MM-dd')===s;}
function listActivities(token,from,to){
 auth_(token);if(!validDay_(from)||!validDay_(to))throw new Error('Fechas inválidas.');
 const a=new Date(from+'T00:00:00-03:00'),b=new Date(to+'T00:00:00-03:00');if(b<=a||b-a>94*86400000)throw new Error('Consultá hasta 93 días por vez.');
 return calendar_().getEvents(a,b).map(function(e){const allDay=e.isAllDayEvent();return {id:e.getId(),title:e.getTitle(),start:e.getStartTime().toISOString(),end:e.getEndTime().toISOString(),allDay:allDay,startDay:allDay?Utilities.formatDate(e.getAllDayStartDate(),Session.getScriptTimeZone(),'yyyy-MM-dd'):null,endDay:allDay?Utilities.formatDate(e.getAllDayEndDate(),Session.getScriptTimeZone(),'yyyy-MM-dd'):null,location:e.getLocation(),done:e.getTag('familia_done')==='true'};});
}
function createActivity(token,p){
 auth_(token);
 if(!p||typeof p.title!=='string'||!p.title.trim()||p.title.length>180||!validDay_(p.date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(p.time)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(p.end)||p.end<=p.time||typeof p.location!=='string'||p.location.length>250||typeof p.requestId!=='string'||! /^[a-zA-Z0-9-]{20,80}$/.test(p.requestId))throw new Error('Revisá los datos de la actividad.');
 const a=new Date(p.date+'T'+p.time+':00-03:00'),b=new Date(p.date+'T'+p.end+':00-03:00');
 const lock=LockService.getScriptLock();lock.waitLock(20000);
 try{
  const cal=calendar_(),matches=cal.getEvents(new Date(p.date+'T00:00:00-03:00'),new Date(p.date+'T23:59:59-03:00'));
  const prior=matches.find(function(e){return e.getTag('familia_request')===p.requestId||(e.getTitle()===p.title.trim()&&e.getStartTime().getTime()===a.getTime()&&e.getEndTime().getTime()===b.getTime());});
  if(prior)return {id:prior.getId(),duplicate:true};
  const event=cal.createEvent(p.title.trim(),a,b,{location:p.location});event.setTag('familia_request',p.requestId);return {id:event.getId(),duplicate:false};
 }finally{lock.releaseLock();}
}
function completeActivity(token,id,done){auth_(token);if(typeof id!=='string'||id.length>250||typeof done!=='boolean')throw new Error('Actividad inválida.');const e=calendar_().getEventById(id);if(!e)throw new Error('La actividad ya no existe. Actualizá la agenda.');if(e.isRecurringEvent())throw new Error('Por ahora no se puede completar una repetición individual.');e.setTag('familia_done',String(done));return true;}
