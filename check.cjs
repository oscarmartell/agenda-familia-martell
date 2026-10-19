const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]);
scripts.forEach(s=>new vm.Script(s));new vm.Script(fs.readFileSync(__dirname+'/apps-script/Code.gs','utf8'));
const context=vm.createContext({Intl,Date,Error});vm.runInContext(scripts.find(s=>s.includes('function parseActivity')),context);
const now=new Date('2026-10-19T13:00:00Z'),p=t=>context.parseActivity(t,now);
assert.equal(p('22/10 odontóloga Heidi 14 horas').date,'2026-10-22');assert.equal(p('22/10 odontóloga Heidi 14 horas').time,'14:00');assert.equal(p('mañana pediatra a las 16:30').date,'2026-10-20');assert.equal(p('mañana pediatra a las 16:30').title,'Pediatra');assert.equal(p('pasado mañana reunión a las 18').date,'2026-10-21');assert.equal(p('pediatra 16:30').date,'');assert.equal(p('22/10 pediatra').time,'');assert.throws(()=>p('31/02 odontóloga 14 horas'));
console.log('Sintaxis de frontend y servidor válida; 8 verificaciones de interpretación correctas.');
