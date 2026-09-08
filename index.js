import {loginStudent, getStudent} from './firebase-auth.js';
const $=(s)=>document.querySelector(s);
const student=getStudent();
if(student){document.querySelectorAll('[data-auth-link]').forEach(a=>{a.textContent='لوحة الطالب';a.href='dashboard.html'});}
const loginForm=$('#quickLogin'); if(loginForm) loginForm.addEventListener('submit',async e=>{e.preventDefault();const b=loginForm.querySelector('button');b.disabled=true;b.textContent='جارٍ الدخول...';try{await loginStudent($('#qPhone').value,$('#qPin').value);location.href='dashboard.html'}catch(err){alert(err.message)}finally{b.disabled=false;b.textContent='دخول آمن'}});
document.querySelectorAll('[data-scroll]').forEach(x=>x.addEventListener('click',e=>{e.preventDefault();document.querySelector(x.dataset.scroll)?.scrollIntoView({behavior:'smooth'})}));
