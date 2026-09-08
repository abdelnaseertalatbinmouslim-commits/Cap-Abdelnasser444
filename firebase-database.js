import {getToken} from './firebase-auth.js';
async function api(path, options={}){const h={'content-type':'application/json',...(options.headers||{})};const t=getToken();if(t)h.authorization=`Bearer ${t}`;const r=await fetch(`/api/${path}`,{...options,headers:h});const d=await r.json();if(!r.ok)throw new Error(d.message||'تعذر الاتصال بالخادم');return d}
export const db={
  async studentData(){return api('student-data')},
  async support(action,payload){return api('support',{method:'POST',body:JSON.stringify({action,...payload})})},
  async notifications(){return api('student-data').then(x=>({notifications:x.notifications||[],reads:x.notificationReads||{}}))}
};
