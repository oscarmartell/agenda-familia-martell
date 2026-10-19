/** Todas las operaciones quedan limitadas a un único calendario, configurado por el dueño. */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL).setTitle('Agenda Familia Martell').addMetaTag('viewport','width=device-width,initial-scale=1');
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
// La contraseña se valida en el servidor y nunca se incluye en GitHub ni en el HTML.
function login(password){
 const lock=LockService.getScriptLock();lock.waitLock(10000);
 try{
  const cache=CacheService.getScriptCache(),failures=Number(cache.get('password_failures')||0);
  if(failures>=10)throw new Error('Demasiados intentos. Esperá 15 minutos.');
  const expected=props_().getProperty('FAMILY_PASSWORD');
  if(!expected||!/^\d{4}$/.test(expected))throw new Error('Configurá FAMILY_PASSWORD con un PIN de exactamente 4 números en las propiedades de Apps Script.');
  if(typeof password!=='string'||!/^\d{4}$/.test(password)||!equal_(digest_(password),digest_(expected))){cache.put('password_failures',String(failures+1),900);throw new Error('PIN incorrecto.');}
  cache.remove('password_failures');const token=Utilities.getUuid()+Utilities.getUuid();cache.put('session:'+digest_(token),digest_(expected),21600);return token;
 }finally{lock.releaseLock();}
}
function auth_(token){const expected=props_().getProperty('FAMILY_PASSWORD');if(!expected||!/^\d{4}$/.test(expected)||typeof token!=='string'||token.length>100||CacheService.getScriptCache().get('session:'+digest_(token))!==digest_(expected))throw new Error('La sesión venció. Recargá e ingresá de nuevo.');}
function logout(token){auth_(token);CacheService.getScriptCache().remove('session:'+digest_(token));}
function validDay_(s){return typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&Utilities.formatDate(new Date(s+'T12:00:00-03:00'),'America/Argentina/Buenos_Aires','yyyy-MM-dd')===s;}
function listActivities(token,from,to){
 auth_(token);if(!validDay_(from)||!validDay_(to))throw new Error('Fechas inválidas.');
 const a=new Date(from+'T00:00:00-03:00'),b=new Date(to+'T00:00:00-03:00');if(b<=a||b-a>94*86400000)throw new Error('Consultá hasta 93 días por vez.');
 const states=props_().getProperties();
 return calendar_().getEvents(a,b).map(function(e){const allDay=e.isAllDayEvent(),recurring=e.isRecurringEvent(),start=e.getStartTime().toISOString();return {id:e.getId(),title:e.getTitle(),start:start,end:e.getEndTime().toISOString(),allDay:allDay,recurring:recurring,startDay:allDay?Utilities.formatDate(e.getAllDayStartDate(),Session.getScriptTimeZone(),'yyyy-MM-dd'):null,endDay:allDay?Utilities.formatDate(e.getAllDayEndDate(),Session.getScriptTimeZone(),'yyyy-MM-dd'):null,location:e.getLocation(),done:states[doneKey_(e.getId(),start,recurring)]==='true'};});
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
// El estado pertenece a la app: nunca se escribe una etiqueta ni otro campo de Calendar.
function doneKey_(id,start,recurring){return 'done:'+digest_(id+(recurring?'|'+start:''));}
function completeActivity(token,id,start,done){
 auth_(token);
 if(typeof id!=='string'||!id||id.length>250||typeof start!=='string'||start.length>40||!isFinite(new Date(start).getTime())||typeof done!=='boolean')throw new Error('Actividad inválida.');
 const event=calendar_().getEventById(id);if(!event)throw new Error('La actividad ya no existe. Actualizá la agenda.');
 const key=doneKey_(id,start,event.isRecurringEvent());
 if(done)props_().setProperty(key,'true');else props_().deleteProperty(key);
 return true;
}
function rescheduleActivity(token,p){
 auth_(token);
 if(!p||typeof p.id!=='string'||!p.id||p.id.length>250||!validDay_(p.date)||typeof p.originalStart!=='string'||p.originalStart.length>40||typeof p.originalEnd!=='string'||p.originalEnd.length>40||!isFinite(new Date(p.originalStart).getTime())||!isFinite(new Date(p.originalEnd).getTime()))throw new Error('Revisá los datos para reagendar.');
 const lock=LockService.getScriptLock();lock.waitLock(20000);
 try{
  const event=calendar_().getEventById(p.id);if(!event)throw new Error('La actividad ya no existe. Actualizá la agenda.');
  if(event.isRecurringEvent())throw new Error('Para cambiar una repetición, abrí Google Calendar. Las actividades individuales sí se pueden reagendar aquí.');
  const allDay=event.isAllDayEvent();let a,b;
  if(allDay){const duration=Math.round((new Date(p.originalEnd)-new Date(p.originalStart))/86400000);if(duration<1||duration>366)throw new Error('Duración inválida.');a=new Date(p.date+'T00:00:00-03:00');b=new Date(a.getTime()+duration*86400000);}
  else {if(typeof p.time!=='string'||typeof p.end!=='string'||!/^([01]\d|2[0-3]):[0-5]\d$/.test(p.time)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(p.end)||p.end<=p.time)throw new Error('Revisá el horario de inicio y fin.');a=new Date(p.date+'T'+p.time+':00-03:00');b=new Date(p.date+'T'+p.end+':00-03:00');}
  // Reintentos a la misma fecha son seguros; no se crea un segundo evento.
  if(event.getStartTime().getTime()===a.getTime()&&event.getEndTime().getTime()===b.getTime())return {id:event.getId(),unchanged:true};
  if(event.getStartTime().getTime()!==new Date(p.originalStart).getTime()||event.getEndTime().getTime()!==new Date(p.originalEnd).getTime())throw new Error('El evento cambió desde que abriste la agenda. Actualizá y volvé a intentarlo.');
  if(allDay)event.setAllDayDates(a,b);else event.setTime(a,b);
  return {id:event.getId(),unchanged:false};
 }finally{lock.releaseLock();}
}

