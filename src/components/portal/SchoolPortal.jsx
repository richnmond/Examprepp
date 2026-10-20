import React, { useEffect, useState } from 'react';
import { Bell, LogOut, Moon, Sun } from 'lucide-react';
import PortalOverview from './PortalOverview';
import PortalModules from './PortalModules';
import PortalSidebar from './PortalSidebar';
import { portalNavigation } from './portalData';
import BrandMark from '../BrandMark';

export default function SchoolPortal({ user, questionBank, onLogout }) {
  const [role, setRole] = useState('Student');
  const [section, setSection] = useState('Overview');
  const [darkMode, setDarkMode] = useState(false);
  const [feedTick, setFeedTick] = useState(0);
  const [tabSwitches, setTabSwitches] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setFeedTick((tick) => tick + 1), 3500);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (section !== 'CBT Exams') return undefined;
    const handleVisibilityChange = () => {
      if (document.hidden) setTabSwitches((count) => count + 1);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [section]);

  const cardClass = `rounded-2xl border p-5 shadow-sm ${darkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'}`;
  const mutedClass = darkMode ? 'text-slate-400' : 'text-slate-500';
  const mobileNavigation = portalNavigation.slice(0, 8);

  return <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
    <div className="flex min-h-screen">
      <PortalSidebar role={role} onRoleChange={setRole} section={section} onSectionChange={setSection} darkMode={darkMode} />
      <main className="min-w-0 flex-1">
        <header className={`sticky top-0 z-10 border-b px-5 py-4 backdrop-blur ${darkMode ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white/90'}`}>
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="flex items-center gap-3"><BrandMark className="h-9 w-9 shrink-0 lg:hidden" /><div><p className="text-sm font-semibold text-emerald-600">{role} workspace</p><h1 className="text-2xl font-black">{section}</h1></div></div>
            <div className="flex items-center gap-2"><span className="hidden text-sm text-slate-500 sm:block">Hi, {user?.name || 'learner'}</span><button onClick={() => setDarkMode(!darkMode)} className="rounded-xl border p-2" title="Toggle dark mode">{darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button><button onClick={() => setSection('Notifications')} className="relative rounded-xl border p-2"><Bell className="h-4 w-4" /><span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" /></button><button onClick={onLogout} className="rounded-xl border p-2" title="Log out"><LogOut className="h-4 w-4" /></button></div>
          </div>
        </header>
        <div className="mx-auto max-w-7xl p-5 lg:p-8">
          <div className="mb-6 flex gap-2 overflow-x-auto lg:hidden">{mobileNavigation.map(({ label }) => <button key={label} onClick={() => setSection(label)} className={`whitespace-nowrap rounded-full border px-3 py-2 text-xs font-semibold ${section === label ? 'bg-emerald-600 text-white' : ''}`}>{label}</button>)}</div>
          <div key={section} className="portal-view-enter">{section === 'Overview' ? <PortalOverview onNavigate={setSection} cardClass={cardClass} mutedClass={mutedClass} /> : <PortalModules section={section} questionBank={questionBank} tabSwitches={tabSwitches} feedTick={feedTick} />}</div>
        </div>
      </main>
    </div>
  </div>;
}
