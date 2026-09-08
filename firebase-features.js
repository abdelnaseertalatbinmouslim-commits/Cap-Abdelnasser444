import {db} from './firebase-database.js';
export const features={support:(payload)=>db.support('create',payload),closeTicket:(id)=>db.support('status',{id,status:'closed'}),markRead:(id)=>db.support('read',{id})};
