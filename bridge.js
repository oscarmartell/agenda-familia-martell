// La interfaz vive en GitHub; Google solo transporta las operaciones del calendario.
window.familyBridge=(()=>{
  const channel=crypto.randomUUID(),pending=new Map();
  const methods=new Set(['login','logout','listActivities','createActivity','completeActivity','rescheduleActivity']);
  let peer=null,origin='',connected=false,deadline;
  const api={onReady:()=>{},onError:()=>{}};
  function fromOurFrame(source){
    const frame=document.getElementById('calendarBridge');
    try{for(let i=0;source&&i<8;i++){if(source===frame.contentWindow)return true;const parent=source.parent;if(parent===source)break;source=parent}}catch{}
    return false;
  }
  function googleOrigin(value){try{const u=new URL(value);return u.protocol==='https:'&&(u.hostname==='script.google.com'||u.hostname==='script.googleusercontent.com'||u.hostname.endsWith('-script.googleusercontent.com'))}catch{return false}}
  window.addEventListener('message',e=>{
    const d=e.data;if(!d||!googleOrigin(e.origin))return;
    if(d.type==='familia:bridge-hello'&&!peer&&fromOurFrame(e.source)){
      peer=e.source;origin=e.origin;peer.postMessage({type:'familia:bridge-bind',channel},origin);return;
    }
    if(e.source!==peer||e.origin!==origin||d.channel!==channel)return;
    if(d.type==='familia:bridge-ready'){connected=true;clearTimeout(deadline);api.onReady();return}
    if(d.type==='familia:bridge-error'){api.onError(d.error||'No se pudo conectar con Familia.');return}
    if(d.type==='familia:bridge-result'){
      const item=pending.get(d.id);if(!item)return;pending.delete(d.id);clearTimeout(item.timer);
      if(d.error)item.reject(Error(d.error));else item.resolve(d.result);
    }
  });
  api.start=()=>{
    const url=window.FAMILY_APP_URL;
    if(typeof url!=='string'||!/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(url)){api.onError('Falta configurar la conexión con Familia.');return}
    document.getElementById('calendarBridge').src=url+'?bridge=1';
    deadline=setTimeout(()=>api.onError('No se pudo conectar. Si acabás de actualizar la web, publicá la nueva versión de los dos archivos en Apps Script y recargá.'),25000);
  };
  api.call=(name,args)=>new Promise((resolve,reject)=>{
    if(!connected)return reject(Error('Esperá a que se conecte la agenda.'));
    if(!methods.has(name))return reject(Error('Operación no permitida.'));
    const id=crypto.randomUUID();const timer=setTimeout(()=>{pending.delete(id);reject(Error('La conexión tardó demasiado. Actualizá antes de volver a confirmar.'))},30000);
    pending.set(id,{resolve,reject,timer});peer.postMessage({type:'familia:bridge-call',channel,id,name,args},origin);
  });
  return api;
})();
