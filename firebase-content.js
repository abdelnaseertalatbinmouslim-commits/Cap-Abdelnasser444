import {db} from './firebase-database.js';
export async function getContent(){return db.studentData()}
export function normalizeUrl(x={}){return x.url||x.fileUrl||x.pdfUrl||x.downloadURL||x.downloadUrl||x.link||x.videoUrl||x.sourceUrl||x.embedUrl||x.video||''}
export function asArray(value){if(!value)return[];if(Array.isArray(value))return value.map((v,i)=>({...v,_key:String(i)}));return Object.entries(value).map(([k,v])=>({...(v||{}),_key:k}))}
