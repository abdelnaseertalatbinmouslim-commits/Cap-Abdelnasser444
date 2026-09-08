const API = '/api';
const KEY = 'cap_student_session';
export async function loginStudent(phone, pin){ const r=await fetch(`${API}/student-login`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({phone,pin})}); const d=await r.json(); if(!r.ok) throw new Error(d.message||'بيانات الدخول غير صحيحة'); localStorage.setItem(KEY,d.token); localStorage.setItem('cap_student',JSON.stringify(d.student)); return d.student; }
export async function registerStudent(payload){ const r=await fetch(`${API}/student-register`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)}); const d=await r.json(); if(!r.ok) throw new Error(d.message||'تعذر إنشاء الحساب'); return d; }
export function getToken(){return localStorage.getItem(KEY)}
export function getStudent(){try{return JSON.parse(localStorage.getItem('cap_student')||'null')}catch{return null}}
export function logoutStudent(){localStorage.removeItem(KEY);localStorage.removeItem('cap_student');location.href='index.html'}
export function requireStudent(){const s=getStudent();if(!s||!getToken()){location.href='login.html';return null}return s}
