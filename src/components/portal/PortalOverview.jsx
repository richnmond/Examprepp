import React from 'react';
import { Bell, CheckCircle, CreditCard, GraduationCap, LineChart, Radio, TrendingUp, Users } from 'lucide-react';
import { feedItems } from './portalData';

function Sparkline({ color = '#10b981', values = '0,30 20,22 40,26 60,12 80,18 100,5' }) {
  return <svg viewBox="0 0 100 36" className="h-10 w-full" role="img" aria-label="Trend chart"><polyline points={values} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function PortalOverview({ onNavigate, cardClass, mutedClass }) {
  const stats = [
    ['Active students', '1,248', '+8.2%', Users],
    ['Attendance today', '94.6%', '+2.1%', CheckCircle],
    ['Fees collected', '₦18.4m', '+12.4%', CreditCard],
    ['Average score', '78.4%', '+4.8%', TrendingUp]
  ];

  return <div className="space-y-5">
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map(([label, value, change, Icon]) => <div key={label} className={cardClass}><div className="flex items-start justify-between"><div><p className={mutedClass}>{label}</p><p className="mt-2 text-2xl font-black">{value}</p><p className="mt-1 text-xs font-bold text-emerald-600">{change} this month</p></div><Icon className="h-5 w-5 text-emerald-600" /></div><div className="mt-3"><Sparkline /></div></div>)}
    </div>
    <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
      <div className={cardClass}><div className="flex items-center justify-between"><div><h3 className="text-xl font-bold">Academic pulse</h3><p className={mutedClass}>School-wide engagement this week</p></div><button onClick={() => onNavigate('Analytics')} className="text-sm font-semibold text-emerald-700">View analytics</button></div><div className="mt-5 grid grid-cols-7 items-end gap-3">{[42, 58, 48, 72, 66, 84, 76].map((height, index) => <div key={index} className="text-center"><div className="flex h-32 items-end rounded-t-xl bg-slate-100"><div className="w-full rounded-t-xl bg-emerald-500" style={{ height: `${height}%` }} /></div><span className="mt-2 block text-xs text-slate-500">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</span></div>)}</div></div>
      <div className={cardClass}><div className="flex items-center justify-between"><h3 className="text-xl font-bold">Live feed</h3><button onClick={() => onNavigate('Live Feed')} className="text-sm font-semibold text-emerald-700">Open</button></div><div className="mt-4 space-y-3">{feedItems.slice(0, 3).map((item) => <div key={item} className="flex gap-3 text-sm"><span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" /><span>{item}</span></div>)}</div></div>
    </div>
    <div className={cardClass}><div className="flex items-center justify-between"><div><h3 className="text-xl font-bold">Quick actions</h3><p className={mutedClass}>Jump into the work that matters</p></div><button onClick={() => onNavigate('Notifications')} className="rounded-xl border px-3 py-2 text-sm"><Bell className="mr-1 inline h-4 w-4" /> Announcement</button></div><div className="mt-4 flex flex-wrap gap-3">{[['Student Portal', GraduationCap], ['Gradebook', LineChart], ['Attendance', CheckCircle], ['CBT Exams', Radio]].map(([label, Icon]) => <button key={label} onClick={() => onNavigate(label)} className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold hover:bg-emerald-50"><Icon className="h-4 w-4 text-emerald-600" />{label}</button>)}</div></div>
  </div>;
}
