import {body,json,verifyAdmin,telegram} from './_lib.js';
export default async function handler(req,res){if(req.method!=='POST')return json(res,405,{message:'الطلب غير مسموح'});if(!verifyAdmin(req))return json(res,401,{message:'غير مصرح'});const b=await body(req);const ok=await telegram(String(b.message||''));return json(res,ok?200:502,{ok,message:ok?'تم الإرسال':'تعذر إرسال الرسالة'});}
