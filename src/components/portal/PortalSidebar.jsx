import React from 'react';
import {
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle,
  ClipboardCheck,
  CreditCard,
  GraduationCap,
  Hammer,
  HelpCircle,
  Lightbulb,
  LayoutDashboard,
  LineChart,
  MessageSquare,
  Radio,
  Scale,
  Settings,
  TimerReset,
  Users,
  WalletCards
} from 'lucide-react';
import { portalNavigation } from './portalData';

const icons = {
  dashboard: LayoutDashboard,
  student: GraduationCap,
  results: ClipboardCheck,
  attendance: CheckCircle,
  learning: Lightbulb,
  exam: TimerReset,
  fees: CreditCard,
  gradebook: BarChart3,
  messages: MessageSquare,
  calendar: CalendarDays,
  discipline: Scale,
  payroll: WalletCards,
  analytics: LineChart,
  builder: Hammer,
  feed: Radio,
  notifications: Bell,
  admin: Users,
  settings: Settings,
  help: HelpCircle
};

export default function PortalSidebar({ role, onRoleChange, section, onSectionChange, darkMode }) {
  return (
    <aside className={`hidden w-64 shrink-0 border-r p-5 lg:block ${darkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'}`}>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white"><BookOpen className="h-5 w-5" /></div>
        <div><p className="font-black">ExamPrep NG</p><p className="text-xs text-slate-500">School operations</p></div>
      </div>
      <div className="mt-7 rounded-xl bg-slate-100 p-2">
        <p className="px-2 text-xs font-bold uppercase text-slate-500">Workspace</p>
        <select value={role} onChange={(event) => onRoleChange(event.target.value)} className="mt-2 w-full rounded-lg border-0 bg-white p-2 text-sm font-semibold">
          <option>Student</option><option>Teacher</option><option>Administrator</option><option>Accountant</option>
        </select>
      </div>
      <nav className="mt-6 space-y-1">
        {portalNavigation.map(({ label, icon }) => {
          const Icon = icons[icon];
          return <button key={label} onClick={() => onSectionChange(label)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium ${section === label ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}><Icon className="h-4 w-4" />{label}</button>;
        })}
      </nav>
    </aside>
  );
}
