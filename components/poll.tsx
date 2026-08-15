"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Option={id:string;option_text:string;vote_count:number};
export default function Poll({pollId,question,options,currentUserId,currentVoteOptionId=null}:{
 pollId:string; question:string; options:Option[]; currentUserId:string; currentVoteOptionId?:string|null;
}) {
 const supabase=createClient();
 const [selected,setSelected]=useState(currentVoteOptionId);
 const [voted,setVoted]=useState(Boolean(currentVoteOptionId));
 const [counts,setCounts]=useState(Object.fromEntries(options.map(o=>[o.id,o.vote_count])));
 const [saving,setSaving]=useState(false);
 const [error,setError]=useState<string|null>(null);
 const total=Object.values(counts).reduce((a,b)=>a+b,0);
 async function vote(optionId:string){
  if(saving||voted)return;
  setSaving(true);setError(null);
  const {error:e}=await supabase.from("poll_votes").insert({poll_id:pollId,option_id:optionId,user_id:currentUserId});
  if(e){setError(e.code==="23505"?"You've already voted in this poll.":e.message);setSaving(false);return;}
  setSelected(optionId);setVoted(true);setCounts(c=>({...c,[optionId]:(c[optionId]??0)+1}));setSaving(false);
 }
 return <div className="mt-5 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white">
  <div className="border-b border-blue-100 bg-[#0B1F3A] px-5 py-4 text-white">
   <div className="flex items-center gap-2"><span>📊</span><span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200">DNN Community Poll</span></div>
   <h3 className="mt-2 text-lg font-black">{question}</h3>
  </div>
  <div className="space-y-3 p-5">{options.map(o=>{const pct=total?Math.round((counts[o.id]/total)*100):0;return <button key={o.id} disabled={saving||voted} onClick={()=>vote(o.id)} className="group relative w-full overflow-hidden rounded-xl border border-slate-200 bg-white text-left transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-sm disabled:cursor-default">
   {(voted||selected===o.id)&&<div className="absolute inset-y-0 left-0 bg-blue-100/70 transition-all duration-500" style={{width:`${pct}%`}}/>}
   <div className="relative flex items-center gap-3 px-4 py-3"><span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${selected===o.id?"border-blue-600 bg-blue-600":"border-slate-300 group-hover:border-blue-400"}`}>{selected===o.id&&<span className="h-2 w-2 rounded-full bg-white"/>}</span><span className="min-w-0 flex-1 text-sm font-bold text-slate-700">{o.option_text}</span>{voted&&<span className="text-xs font-black text-blue-700">{pct}%</span>}</div>
  </button>})}<div className="flex justify-between pt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400"><span>{total} vote{total===1?"":"s"}</span><span>{voted?"Vote recorded ✓":"Choose one"}</span></div>{error&&<p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">{error}</p>}</div>
 </div>;
}