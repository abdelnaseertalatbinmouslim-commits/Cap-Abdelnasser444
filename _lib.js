import crypto from 'node:crypto';
import admin from 'firebase-admin';
import users from '../admin-users.json' with {type:'json'};
const secret=process.env.SESSION_SECRET||'CHANGE_ME_IN_PRODUCTION';
let app;
export function firebase(){
 if(!app){
  const raw=process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if(!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not configured');
  const service=typeof raw==='string'?JSON.parse(raw):raw;
  app=admin.apps.length?admin.app():admin.initializeApp({credential:admin.credential.cert(service),databaseURL:'https://abodaa-default-rtdb.firebaseio.com'});
 }
 return admin.database();
}
export function json(res,status,data){res.status(status).setHeader('content-type','application/json; charset=utf-8');res.end(JSON.stringify(data));}
export async function body(req){if(req.body)return req.body;let s='';for await(const c of req)s+=c;try{return JSON.parse(s||'{}')}catch{return{}}}
export function hashPin(pin){return crypto.createHash('sha256').update(String(pin)).digest('hex')}
export function sign(payload){const p=Buffer.from(JSON.stringify({...payload,exp:Date.now()+1000*60*60*12})).toString('base64url');const sig=crypto.createHmac('sha256',secret).update(p).digest('base64url');return `${p}.${sig}`}
export function verify(token){try{const [p,s]=String(token||'').split('.');const good=crypto.createHmac('sha256',secret).update(p).digest('base64url');if(!crypto.timingSafeEqual(Buffer.from(s),Buffer.from(good)))return null;const d=JSON.parse(Buffer.from(p,'base64url'));return d.exp>Date.now()?d:null}catch{return null}}
export function student(req){const t=(req.headers.authorization||'').replace(/^Bearer\s+/i,'');return verify(t)}
export function normPhone(v){let p=String(v||'').replace(/[^0-9+]/g,'');if(p.startsWith('+20'))p='0'+p.slice(3);if(p.startsWith('20')&&p.length===12)p='0'+p.slice(2);return p.replace(/^0+/,'0')}
export function findStudents(data,phone){const all=Object.entries(data||{}).map(([key,v])=>({key,...v})).filter(x=>normPhone(x.phone)===normPhone(phone));return all.sort((a,b)=>Number(b.status==='approved')-Number(a.status==='approved'))}
export async function telegram(text){const token=process.env.TELEGRAM_BOT_TOKEN,chat=process.env.TELEGRAM_CHAT_ID||'5926610601';if(!token)return false;const ac=new AbortController();const timer=setTimeout(()=>ac.abort(),4500);try{const r=await fetch(`https://api.telegram.org/bot${token}/sendMessage`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({chat_id:chat,text,parse_mode:'HTML'}),signal:ac.signal});return r.ok}catch{return false}finally{clearTimeout(timer)}}
export function safeStudent(s){return {key:s.key,name:s.name||'',phone:s.phone||'',grade:s.grade||'',status:s.status||'',createdAt:s.createdAt||null,lastActive:s.lastActive||null}}
export function verifyAdmin(req){const t=(req.headers.authorization||'').replace(/^Bearer\s+/i,'');const d=verify(t);return d?.type==='admin'?d:null}
export function adminUser(email,password){const u=users.find(x=>x.email.toLowerCase()===String(email||'').toLowerCase());if(!u)return null;const salt=Buffer.from(u.salt,'base64');const h=crypto.scryptSync(String(password),salt,64).toString('base64');return crypto.timingSafeEqual(Buffer.from(h),Buffer.from(u.hash))?u:null}
