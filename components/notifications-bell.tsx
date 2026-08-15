"use client";

import {useEffect,useState} from "react";
import {createClient} from "@/lib/supabase/client";

type N={id:string;type:"follow"|"like"|"comment"|"poll_vote";read:boolean;created_at:string;actor_id:string|null;post_id:string|null;poll_id:string|null};
const text=(t:N["type"])=>({follow:"started following you",like:"liked your report",comment:"commented on your report",poll_vote:"voted in your poll"}[t]);

export default function NotificationsBell({userId,initialNotifications=[]}:{userId:string;initialNotifications?:N[]}) {
 const [open,setOpen]=useState(false); const [items,setItems]=useState(initialNotifications);
 const unread=items.filter(n=>!n.read).length;
 useEffect(()=>{const s=createClient();const c=s.channel(`notifications-${userId}`).on("postgres_changes",{event:"INSERT",schema:"public",table:"notifications",filter:`recipient_id=eq.${userId}`},p=>setItems(x=>[p.new as N,...x])).subscribe();return()=>{s.removeChannel(c)}},[userId]);
 async function readAll(){if(!unread)return;const s=createClient();await s.from("notifications").update({read:true}).eq("recipient_id",userId).eq("read",false);setItems(x=>x.map(n=>({...n,read:true})))}
 return <div className="relative"><button type="button" onClick={()=>setOpen(v=>!v)} className="relative flex h-10 w-10 items-center justify-center rounded-xl hover:bg-slate-100" aria-label="Notifications">
  <span className="text-lg">🔔</span>{unread>0&&<span className="absolute -right-0.5 -top-0.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-black text-white ring-2 ring-white">{unread>9?"9+":unread}</span>}
 </button>{open&&<div className="absolute right-0 z-50 mt-3 w-[min(92vw,360px)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
  <div className="flex items-center justify-between border-b px-4 py-3"><div><p className="text-sm font-black text-[#0B1F3A]">Notifications</p><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Dogla activity</p></div><button onClick={readAll} className="text-[10px] font-black uppercase tracking-widest text-blue-600">Mark read</button></div>
  <div className="max-h-[360px] overflow-y-auto">{items.length===0?<div className="px-6 py-10 text-center"><div className="mb-2 text-2xl">🔔</div><p className="text-sm font-bold text-slate-600">Nothing yet</p></div>:items.map(n=><div key={n.id} className={`flex gap-3 border-b border-slate-50 px-4 py-3 ${n.read?"bg-white":"bg-blue-50/60"}`}><div className="text-lg">{n.type==="follow"?"👤":n.type==="like"?"❤️":n.type==="comment"?"💬":"📊"}</div><div><p className="text-sm text-slate-700">Someone <b>{text(n.type)}</b></p><p className="mt-1 text-[10px] font-semibold text-slate-400">{new Date(n.created_at).toLocaleString()}</p></div></div>)}</div>
 </div>}</div>
}