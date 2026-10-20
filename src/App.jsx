import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Menu,
  X,
  Home,
  LogOut,
  BarChart3,
  Clock,
  CheckCircle,
  Lightbulb,
  Sparkles,
  ArrowRight,
  FileText,
  Target,
  TrendingUp,
  ShieldCheck,
  CalendarRange,
  Trophy,
  BrainCircuit,
  LayoutDashboard,
  Users,
  GraduationCap,
  ClipboardCheck,
  CreditCard,
  MessageSquare,
  CalendarDays,
  Scale,
  WalletCards,
  LineChart,
  Hammer,
  Radio,
  Bell,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Plus,
  Search,
  Download,
  Send,
  AlertTriangle,
  Sun,
  Moon,
  LockKeyhole,
  TimerReset
} from 'lucide-react';
import './App.css';
import jambQuestions from './data/jambQuestions.json';
import SchoolPortal from './components/portal/SchoolPortal';
import BrandMark from './components/BrandMark';

export default function ExamPrepApp() {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [user, setUser] = useState(null);
  const [currentSubject, setCurrentSubject] = useState('Mathematics');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isPremium, setIsPremium] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extractedQuestions, setExtractedQuestions] = useState([]);
  const [uploadedAnswers, setUploadedAnswers] = useState({});
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedExamSubject, setSelectedExamSubject] = useState('Mathematics');
  const [savedExams, setSavedExams] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const voiceSupported = typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  const [portalRole, setPortalRole] = useState('Student');
  const [portalSection, setPortalSection] = useState('Overview');
  const [portalDarkMode, setPortalDarkMode] = useState(false);
  const [feedTick, setFeedTick] = useState(0);
  const [attendance, setAttendance] = useState({ Ada: 'Present', Musa: 'Late', Chidi: 'Absent' });
  const [gradeRows, setGradeRows] = useState([
    { name: 'Ada Okafor', ca: 24, exam: 58 },
    { name: 'Musa Bello', ca: 19, exam: 51 },
    { name: 'Chidi Eze', ca: 27, exam: 63 }
  ]);
  const [expandedPayroll, setExpandedPayroll] = useState(null);
  const [showDisciplineModal, setShowDisciplineModal] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [tabSwitches, setTabSwitches] = useState(0);

  useEffect(() => {
    if (currentScreen !== 'portal') return undefined;
    const timer = window.setInterval(() => setFeedTick((tick) => tick + 1), 3500);
    return () => window.clearInterval(timer);
  }, [currentScreen]);

  useEffect(() => {
    if (currentScreen !== 'portal' || portalSection !== 'CBT Exams') return undefined;
    const handleVisibilityChange = () => {
      if (document.hidden) setTabSwitches((count) => count + 1);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [currentScreen, portalSection]);

  const QUESTIONS_DB = jambQuestions;

  const speakText = (text) => {
    if (!text || !('speechSynthesis' in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const startVoiceCapture = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSummary('🎙️ Voice capture is not supported in this browser. Please use Chrome or Edge for microphone dictation.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(' ');

      setSummary(`🎙️ Captured speech: ${transcript}`);
      const parsed = parseUploadedQuestions(transcript);

      if (parsed.length > 0) {
        setExtractedQuestions(parsed);
        setUploadedAnswers({});
        setUploadedFile({ name: 'voice-dictation.txt' });
        const spokenSummary = parsed.slice(0, 6).map((item, index) => `${index + 1}. ${item.text}`).join(' ');
        speakText(spokenSummary);
      } else {
        setSummary('🎙️ I heard you, but the text did not match a multiple-choice format. Try speaking a question and options like: “1. What is 2+2? A. 3 B. 4 C. 5 D. 6 Answer: B.”');
      }
    };
    recognition.onerror = () => setSummary('🎙️ Voice capture failed. Please speak clearly and try again.');
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const readUploadedText = () => {
    if (!extractedQuestions.length) {
      setSummary('📘 Upload a text file and extract questions before trying to read it aloud.');
      return;
    }

    const spokenText = extractedQuestions.slice(0, 8).map((question, index) => {
      const optionsText = question.options.map((option) => option.text || option).join(', ');
      return `${index + 1}. ${question.text}. Options: ${optionsText}`;
    }).join(' ');

    speakText(spokenText);
  };

  const subjects = Object.keys(QUESTIONS_DB);

  const parseUploadedQuestions = (content) => {
    const blocks = content
      .replace(/\r\n/g, '\n')
      .split(/\n{2,}|-{3,}/g)
      .map((block) => block.trim())
      .filter(Boolean);

    const questions = [];

    blocks.forEach((block) => {
      const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
      if (lines.length === 0) return;

      const optionLines = lines.filter((line) => /^[A-D]\./i.test(line));
      if (optionLines.length === 0) return;

      const answerLine = lines.find((line) => /^Answer:/i.test(line)) || '';
      const options = optionLines
        .map((line) => {
          const match = line.match(/^([A-D])\.\s*(.+)$/i);
          return match ? { letter: match[1].toUpperCase(), text: match[2].trim() } : null;
        })
        .filter(Boolean);

      if (options.length === 0) return;

      const firstOptionIndex = lines.findIndex((line) => /^[A-D]\./i.test(line));
      const headerLines = lines.slice(0, firstOptionIndex === -1 ? lines.length : firstOptionIndex);
      const cleanedHeaderLines = headerLines
        .map((line) => line.replace(/^#{1,6}\s*/, '').trim())
        .filter((line) => line && !/^(Antonyms|Synonyms|Comprehension|Idioms|Sentence Interpretation|Concord|Oral English|Vocabulary|Grammar|Choose the option|Choose the option opposite in meaning|Choose the option nearest in meaning|Read the sentence|Select the correct|Choose the correct|Choose the word|Why did|Choose the option that|Choose the option that best).*/i.test(line));

      let questionText = '';
      if (cleanedHeaderLines.length > 0) {
        questionText = cleanedHeaderLines[cleanedHeaderLines.length - 1];
      } else if (headerLines.length > 0) {
        questionText = headerLines[headerLines.length - 1].replace(/^#{1,6}\s*/, '').trim();
      }

      questionText = questionText.replace(/^\d+\.\s*/, '').trim();

      const answerMatch = answerLine.match(/Answer:\s*([A-D])/i);
      const correctAnswer = answerMatch ? answerMatch[1].toUpperCase() : '';

      const blockNumberMatch = lines[0].match(/^#{0,6}\s*(\d+)\./);
      const number = blockNumberMatch ? blockNumberMatch[1] : `${questions.length + 1}`;

      questions.push({ number, text: questionText, options, answer: correctAnswer });
    });

    return questions;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    setIsLoading(true);
    setSummary('');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target.result;
        const questions = parseUploadedQuestions(content);

        if (questions.length === 0) {
          setExtractedQuestions([]);
          setUploadedAnswers({});
          setSummary('❌ No questions found. Use a multiple-choice format with A. B. C. D. options and optional Answer: lines.');
          setIsLoading(false);
          return;
        }

        setExtractedQuestions(questions);
        setUploadedAnswers(
          questions.reduce((acc, question) => {
            if (question.answer) {
              acc[question.number] = question.answer;
            }
            return acc;
          }, {})
        );
        setSummary(`✅ Parsed ${questions.length} question${questions.length === 1 ? '' : 's'} from ${file.name}. Correct answers are pre-selected.`);
      } catch (err) {
        setSummary('Error processing file.');
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const LandingScreen = () => {
    const [name, setName] = useState('');

    const handleStart = () => {
      if (name.trim()) {
        setUser({ name });
        setCurrentScreen('portal');
      }
    };

    const featureHighlights = [
      { icon: Target, title: 'Smart question bank', text: 'Practice with expert-curated multiple choice tests across core subjects.' },
      { icon: BarChart3, title: 'Performance insights', text: 'Monitor strengths, weaknesses, and weekly progress with clarity.' },
      { icon: FileText, title: 'Upload & extract', text: 'Turn notes, PDFs, and draft questions into structured revision material.' },
      { icon: CalendarRange, title: 'Study planner', text: 'Stay accountable with subject plans, daily targets, and revision streaks.' }
    ];

    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_20%),linear-gradient(135deg,_#f0fdf4_0%,_#eef2ff_48%,_#f8fafc_100%)] text-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <header className="flex items-center justify-between rounded-full border border-slate-200/80 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
            <div className="flex items-center gap-3">
              <BrandMark className="h-10 w-10 shrink-0" />
              <div>
                <p className="text-lg font-bold text-slate-900">Examprepp</p>
                <p className="text-xs text-slate-500">Professional exam success</p>
              </div>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 md:flex">
              <Sparkles className="h-4 w-4" />
              Full access learning platform
            </div>
          </header>

          <main className="flex flex-1 items-center py-10 lg:py-16">
            <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <section className="space-y-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                  <Target className="h-4 w-4" />
                  A smarter way to prepare for exams
                </div>

                <div className="space-y-4">
                  <h1 className="max-w-xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                    Build confidence with a clearer, smarter study routine.
                  </h1>
                  <p className="max-w-2xl text-lg leading-8 text-slate-600">
                    Study with professional question banks, exam simulations, performance analytics, and targeted revision tools designed to help students stay focused and improve faster.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 sm:max-w-xs"
                  />
                  <button
                    onClick={handleStart}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:scale-[1.01] hover:shadow-xl"
                  >
                    Get full access
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                    <p className="text-2xl font-black text-slate-900">5+</p>
                    <p className="text-sm text-slate-600">core subjects</p>
                  </div>
                  <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                    <p className="text-2xl font-black text-slate-900">24/7</p>
                    <p className="text-sm text-slate-600">study access</p>
                  </div>
                  <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                    <p className="text-2xl font-black text-slate-900">100%</p>
                    <p className="text-sm text-slate-600">focused revision</p>
                  </div>
                </div>
              </section>

              <aside className="rounded-[2rem] border border-slate-200 bg-slate-900 p-6 text-white shadow-2xl shadow-slate-900/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-white/10 p-2">
                      <TrendingUp className="h-5 w-5 text-emerald-300" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold">Student growth dashboard</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-300">Live</span>
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-300">This week</p>
                      <p className="mt-2 text-3xl font-black">86%</p>
                    </div>
                    <div className="rounded-full bg-emerald-500/20 p-3 text-emerald-300">
                      <Trophy className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-slate-700">
                    <div className="h-full w-[86%] rounded-full bg-gradient-to-r from-emerald-400 to-green-500" />
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {[
                    { icon: ShieldCheck, title: 'Smart practice', text: 'Instant explanation and improved learning retention.' },
                    { icon: Lightbulb, title: 'Targeted revision', text: 'Focus on weaker topics and high-impact subjects.' },
                    { icon: BookOpen, title: 'Full study toolkit', text: 'Question bank, notes upload, planner, and analytics in one place.' }
                  ].map((item) => (
                    <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-emerald-500/15 p-2 text-emerald-300">
                          <item.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold">{item.title}</p>
                          <p className="mt-1 text-sm text-slate-300">{item.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </main>

          <section className="pb-8">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {featureHighlights.map((feature) => (
                <div key={feature.title} className="rounded-3xl border border-slate-200 bg-white/85 p-5 shadow-sm">
                  <div className="mb-3 inline-flex rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{feature.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  };

  const Sparkline = ({ color = '#10b981', values = '0,30 20,22 40,26 60,12 80,18 100,5' }) => (
    <svg viewBox="0 0 100 36" className="h-10 w-full" role="img" aria-label="Trend chart">
      <polyline points={values} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const PortalScreen = () => {
    const nav = [
      { label: 'Overview', icon: LayoutDashboard },
      { label: 'Student Portal', icon: GraduationCap },
      { label: 'Results', icon: ClipboardCheck },
      { label: 'Attendance', icon: CheckCircle },
      { label: 'CBT Exams', icon: TimerReset },
      { label: 'Fees', icon: CreditCard },
      { label: 'Gradebook', icon: BarChart3 },
      { label: 'Messages', icon: MessageSquare },
      { label: 'Calendar', icon: CalendarDays },
      { label: 'Discipline', icon: Scale },
      { label: 'Payroll', icon: WalletCards },
      { label: 'Analytics', icon: LineChart },
      { label: 'Exam Builder', icon: Hammer },
      { label: 'Live Feed', icon: Radio },
      { label: 'Notifications', icon: Bell },
      { label: 'Admin Panel', icon: Users },
      { label: 'Settings', icon: Settings },
      { label: 'Help Center', icon: HelpCircle }
    ];
    const feed = [
      'Ada submitted Mathematics CA',
      'Mr. Adeyemi published a new assignment',
      'Fee receipt generated for Musa Bello',
      'Attendance register updated for SS2A'
    ];
    const card = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm';
    const muted = portalDarkMode ? 'text-slate-400' : 'text-slate-500';

    const renderSection = () => {
      if (portalSection === 'Student Portal') return (
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className={card}><h3 className="text-xl font-bold">Student profile</h3><div className="mt-5 flex items-center gap-4"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-xl font-black text-emerald-700">AO</div><div><p className="text-lg font-bold">Ada Okafor</p><p className={muted}>SS2A · ID EX-2048 · Science track</p></div></div><div className="mt-6 grid grid-cols-2 gap-3 text-sm"><div className="rounded-xl bg-slate-50 p-3"><p className={muted}>Courses</p><b>8 active</b></div><div className="rounded-xl bg-slate-50 p-3"><p className={muted}>Attendance</p><b>94%</b></div></div></div>
          <div className={card}><h3 className="text-xl font-bold">Today’s timetable</h3><div className="mt-4 space-y-3">{['08:00 Mathematics · Room 2', '10:15 Physics · Lab 1', '13:00 English Language · Room 4', '15:30 Study hall · Library'].map((item) => <div key={item} className="rounded-xl bg-slate-50 p-3 text-sm font-medium">{item}</div>)}</div></div>
          <div className={`${card} lg:col-span-2`}><h3 className="text-xl font-bold">Assignments & library</h3><div className="mt-4 grid gap-3 md:grid-cols-3">{['Physics lab report · Due tomorrow', 'English comprehension · Due Friday', 'JAMB revision pack · 32 questions'].map((item) => <div key={item} className="rounded-xl border border-slate-200 p-4 text-sm"><p className="font-semibold">{item}</p><button className="mt-3 text-emerald-700">Open resource <ChevronRight className="inline h-4 w-4" /></button></div>)}</div></div>
        </div>
      );
      if (portalSection === 'Attendance') return <div className={card}><div className="flex items-center justify-between"><div><h3 className="text-xl font-bold">Class attendance</h3><p className={muted}>SS2A · Wednesday, 16 September 2026</p></div><button className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Save register</button></div><div className="mt-5 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b text-xs uppercase text-slate-500"><th className="py-3">Student</th><th>Status</th><th>Change</th></tr></thead><tbody>{Object.entries(attendance).map(([name, status]) => <tr key={name} className="border-b last:border-0"><td className="py-4 font-semibold">{name} {name === 'Ada' ? 'Okafor' : name === 'Musa' ? 'Bello' : 'Eze'}</td><td><span className={`rounded-full px-2 py-1 text-xs font-bold ${status === 'Present' ? 'bg-emerald-100 text-emerald-700' : status === 'Late' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{status}</span></td><td><select value={status} onChange={(e) => setAttendance({ ...attendance, [name]: e.target.value })} className="rounded-lg border border-slate-200 p-2"><option>Present</option><option>Late</option><option>Absent</option></select></td></tr>)}</tbody></table></div></div>;
      if (portalSection === 'Gradebook') return <div className={card}><div className="flex items-center justify-between"><div><h3 className="text-xl font-bold">Gradebook</h3><p className={muted}>Mathematics · SS2A · editable continuous assessment</p></div><button className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"><Download className="h-4 w-4" /> Export</button></div><div className="mt-5 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b text-xs uppercase text-slate-500"><th className="py-3">Student</th><th>CA / 30</th><th>Exam / 70</th><th>Total</th></tr></thead><tbody>{gradeRows.map((row, index) => <tr key={row.name} className="border-b last:border-0"><td className="py-4 font-semibold">{row.name}</td><td><input type="number" value={row.ca} onChange={(e) => setGradeRows(gradeRows.map((item, i) => i === index ? { ...item, ca: Number(e.target.value) } : item))} className="w-20 rounded-lg border p-2" /></td><td><input type="number" value={row.exam} onChange={(e) => setGradeRows(gradeRows.map((item, i) => i === index ? { ...item, exam: Number(e.target.value) } : item))} className="w-20 rounded-lg border p-2" /></td><td className="font-bold text-emerald-700">{row.ca + row.exam}%</td></tr>)}</tbody></table></div></div>;
      if (portalSection === 'Payroll') return <div className={card}><h3 className="text-xl font-bold">Payroll · September 2026</h3><div className="mt-4 space-y-3">{[{ name: 'Basic salary', value: '₦420,000', detail: 'Core monthly salary' }, { name: 'Housing allowance', value: '₦80,000', detail: 'Taxable allowance' }, { name: 'Transport allowance', value: '₦45,000', detail: 'Staff mobility' }, { name: 'PAYE + pension', value: '-₦62,500', detail: 'Statutory deductions' }].map((item) => <div key={item.name} className="rounded-xl border border-slate-200"><button onClick={() => setExpandedPayroll(expandedPayroll === item.name ? null : item.name)} className="flex w-full items-center justify-between p-4 text-left"><span className="font-semibold">{item.name}</span><span className="flex items-center gap-2 font-bold">{item.value}<ChevronDown className={`h-4 w-4 transition ${expandedPayroll === item.name ? 'rotate-180' : ''}`} /></span></button>{expandedPayroll === item.name && <p className="border-t px-4 py-3 text-sm text-slate-500">{item.detail}. Applied to the September payroll run.</p>}</div>)}</div><div className="mt-5 flex justify-between rounded-xl bg-slate-900 p-4 font-bold text-white"><span>Net pay</span><span>₦482,500</span></div></div>;
      if (portalSection === 'Calendar') return <div className={card}><div className="flex items-center justify-between"><h3 className="text-xl font-bold">May 2026</h3><div className="flex gap-2"><button className="rounded-lg border px-3 py-1">‹</button><button className="rounded-lg border px-3 py-1">›</button></div></div><div className="mt-5 grid grid-cols-7 gap-2 text-center text-xs">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <div key={day} className="py-2 font-bold text-slate-400">{day}</div>)}{Array.from({ length: 35 }, (_, index) => { const day = index - 4; const event = [5, 12, 18, 25].includes(day); return <button key={index} className={`min-h-12 rounded-xl p-2 text-left ${day > 0 && day <= 31 ? 'bg-slate-50 hover:bg-emerald-50' : 'text-slate-300'} ${event ? 'border-2 border-emerald-400' : ''}`}>{day > 0 && day <= 31 ? day : ''}{event && <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-emerald-500" />}</button>; })}</div><div className="mt-5 flex gap-4 text-xs text-slate-500"><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-500" />Exam</span><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-amber-500" />Event</span></div></div>;
      if (portalSection === 'Discipline') return <div className={card}><div className="flex items-center justify-between"><div><h3 className="text-xl font-bold">Discipline log</h3><p className={muted}>Private pastoral records</p></div><button onClick={() => setShowDisciplineModal(true)} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white"><Plus className="h-4 w-4" /> Log incident</button></div><div className="mt-5 space-y-3">{['Musa Bello · Late arrival · 15 Sep', 'Chidi Eze · Missing assignment · 10 Sep'].map((item) => <div key={item} className="flex items-center justify-between rounded-xl bg-red-50 p-4 text-sm"><span className="font-semibold text-red-900">{item}</span><AlertTriangle className="h-4 w-4 text-red-600" /></div>)}</div>{showDisciplineModal && <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/40 p-4"><div className="w-full max-w-md rounded-2xl bg-white p-6"><div className="flex justify-between"><h3 className="text-xl font-bold">New incident</h3><button onClick={() => setShowDisciplineModal(false)}>✕</button></div><input placeholder="Student name" className="mt-5 w-full rounded-xl border p-3" /><textarea placeholder="Describe the incident" className="mt-3 h-24 w-full rounded-xl border p-3" /><button onClick={() => setShowDisciplineModal(false)} className="mt-4 w-full rounded-xl bg-slate-900 py-3 font-semibold text-white">Save incident</button></div></div>}</div>;
      if (portalSection === 'Messages') return <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]"><div className={card}><div className="flex justify-between"><h3 className="text-xl font-bold">Inbox</h3><span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">3 new</span></div><div className="mt-4 space-y-2">{['Mrs. Adebayo · Assignment feedback', 'Admin office · Fee reminder', 'Mr. Cole · Parent meeting'].map((item, index) => <button key={item} className={`w-full rounded-xl p-3 text-left text-sm ${index === 0 ? 'bg-emerald-50' : 'bg-slate-50'}`}><p className="font-semibold">{item}</p><p className={muted}>Today · 10:{20 + index}</p></button>)}</div></div><div className={card}><h3 className="text-xl font-bold">Compose message</h3><select className="mt-4 w-full rounded-xl border p-3"><option>To: Class teacher</option><option>To: Admin office</option><option>To: Parent group</option></select><input placeholder="Subject" className="mt-3 w-full rounded-xl border p-3" /><textarea placeholder="Write a message..." className="mt-3 h-32 w-full rounded-xl border p-3" /><button className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white"><Send className="h-4 w-4" /> Send message</button></div></div>;
      if (portalSection === 'Results') return <div className={card}><div className="flex items-center justify-between"><div><h3 className="text-xl font-bold">Results & report card</h3><p className={muted}>2025/26 · Second term</p></div><button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Download PDF</button></div><div className="mt-5 rounded-xl border-2 border-slate-200 p-6"><div className="flex items-center justify-between"><div><p className="font-black">EXAMPREP COLLEGE</p><p className="text-sm text-slate-500">Official student report card preview</p></div><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Verified</span></div><div className="mt-6 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">{[['Average', '84%'], ['Position', '4th'], ['Attendance', '94%'], ['Conduct', 'Excellent']].map(([label, value]) => <div key={label} className="rounded-xl bg-slate-50 p-3"><p className={muted}>{label}</p><p className="mt-1 text-lg font-black">{value}</p></div>)}</div><div className="mt-5 space-y-2">{['Mathematics', 'English Language', 'Physics', 'Chemistry'].map((subject, index) => <div key={subject} className="flex justify-between border-b py-3 text-sm"><span>{subject}</span><b>{88 - index * 3}%</b></div>)}</div></div></div>;
      if (portalSection === 'Fees') return <div className="grid gap-5 lg:grid-cols-2"><div className={card}><p className={muted}>Outstanding balance</p><h3 className="mt-2 text-4xl font-black">₦185,000</h3><div className="mt-5 h-2 rounded-full bg-slate-100"><div className="h-full w-[72%] rounded-full bg-emerald-500" /></div><p className="mt-2 text-sm text-slate-500">72% of term fees paid</p><button className="mt-5 w-full rounded-xl bg-emerald-600 py-3 font-bold text-white">Pay with Paystack / Stripe</button></div><div className={card}><h3 className="text-xl font-bold">Receipts</h3><div className="mt-4 space-y-3">{['INV-2048 · ₦250,000 · 02 Sep 2026', 'INV-1984 · ₦120,000 · 12 Jun 2026'].map((item) => <div key={item} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-sm"><span>{item}</span><button className="text-emerald-700"><Download className="h-4 w-4" /></button></div>)}</div></div></div>;
      if (portalSection === 'CBT Exams') return <div className={card}><div className="flex items-center justify-between"><div><h3 className="text-xl font-bold">CBT examination room</h3><p className={muted}>Physics mock · 40 questions</p></div><span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700"><TimerReset className="h-4 w-4" /> 38:42</span></div><div className="mt-5 grid gap-5 lg:grid-cols-[1fr_220px]"><div><p className="text-lg font-semibold">A body moving in uniform circular motion has:</p><div className="mt-4 grid gap-3">{['Constant speed and constant velocity', 'Constant speed but changing velocity', 'Constant velocity but changing speed', 'Zero acceleration'].map((option, index) => <button key={option} className="rounded-xl border p-4 text-left hover:border-emerald-500"><b className="mr-3">{String.fromCharCode(65 + index)}.</b>{option}</button>)}</div><div className="mt-5 flex justify-between"><button className="rounded-xl border px-4 py-2">Previous</button><button className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white">Next question</button></div></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-sm font-bold">Answer review</p><div className="mt-3 grid grid-cols-5 gap-2">{Array.from({ length: 20 }, (_, index) => <button key={index} className={`h-8 rounded-lg text-xs font-bold ${index === 0 ? 'bg-emerald-600 text-white' : index < 7 ? 'bg-emerald-100 text-emerald-700' : 'bg-white'}`}>{index + 1}</button>)}</div><p className="mt-4 text-xs text-slate-500">Tab switches detected: {tabSwitches}</p></div></div></div>;
      if (portalSection === 'Exam Builder') return <div className={card}><h3 className="text-xl font-bold">Exam Builder</h3><div className="mt-5 grid grid-cols-3 gap-2 text-center text-sm">{['1. Details', '2. Questions', '3. Publish'].map((step, index) => <div key={step} className={`rounded-xl p-3 font-bold ${index === 0 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{step}</div>)}</div><div className="mt-6 grid gap-3 md:grid-cols-2"><input placeholder="Exam title" className="rounded-xl border p-3" /><select className="rounded-xl border p-3"><option>Mathematics</option><option>Physics</option></select><input placeholder="Duration (minutes)" className="rounded-xl border p-3" /><input placeholder="Total questions" className="rounded-xl border p-3" /></div><button className="mt-5 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white">Continue to questions</button></div>;
      if (portalSection === 'Admin Panel') return <div className={card}><div className="flex items-center justify-between"><div><h3 className="text-xl font-bold">Admin panel</h3><p className={muted}>Manage students, teachers, classes and settings</p></div><button className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"><Plus className="h-4 w-4" /> Add record</button></div><div className="mt-5 flex items-center gap-3"><div className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input placeholder="Search students or teachers" className="w-full rounded-xl border py-2.5 pl-10 pr-3" /></div><button className="rounded-xl border px-4 py-2">Filters</button></div><div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b text-xs uppercase text-slate-500"><th className="py-3">Name</th><th>Role</th><th>Class</th><th>Status</th></tr></thead><tbody>{[['Ada Okafor', 'Student', 'SS2A', 'Active'], ['Musa Bello', 'Student', 'SS2A', 'Active'], ['Mr. Adeyemi', 'Teacher', 'Science', 'Active']].map((row) => <tr key={row[0]} className="border-b"><td className="py-4 font-semibold">{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td><td className="text-emerald-700">{row[3]}</td></tr>)}</tbody></table></div></div>;
      if (portalSection === 'Settings') return <div className="grid gap-5 lg:grid-cols-2"><div className={card}><h3 className="text-xl font-bold">Settings</h3>{[['Dark mode', portalDarkMode, () => setPortalDarkMode(!portalDarkMode)], ['Two-factor authentication', true, () => {}], ['Email notifications', true, () => {}]].map(([label, checked, action]) => <button key={label} onClick={action} className="mt-4 flex w-full items-center justify-between rounded-xl bg-slate-50 p-4 text-left"><span className="font-medium">{label}</span><span className={`h-6 w-11 rounded-full p-1 ${checked ? 'bg-emerald-600' : 'bg-slate-300'}`}><span className={`block h-4 w-4 rounded-full bg-white transition ${checked ? 'translate-x-5' : ''}`} /></span></button>)}</div><div className={card}><div className="flex items-center gap-3"><LockKeyhole className="text-emerald-600" /><div><h3 className="font-bold">Security centre</h3><p className={muted}>Your account is protected with 2FA.</p></div></div><button className="mt-5 rounded-xl border px-4 py-2 text-sm">Manage devices</button></div></div>;
      if (portalSection === 'Help Center') return <div className={card}><h3 className="text-xl font-bold">Help Center</h3><div className="mt-4 space-y-2">{['How do I submit an assignment?', 'How can I pay school fees?', 'Where can I find my report card?', 'How do teachers publish an exam?'].map((question) => <details key={question} className="rounded-xl bg-slate-50 p-4"><summary className="cursor-pointer font-semibold">{question}</summary><p className="mt-3 text-sm text-slate-500">Open a support ticket or contact the school office for help with this workflow.</p></details>)}</div><button className="mt-5 rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white">Create support ticket</button></div>;
      if (portalSection === 'Notifications') return <div className={card}><div className="flex items-center justify-between"><h3 className="text-xl font-bold">Notifications</h3><button onClick={() => setShowAnnouncement(!showAnnouncement)} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Compose announcement</button></div>{showAnnouncement && <div className="mt-4 rounded-xl bg-emerald-50 p-4"><input placeholder="Announcement title" className="w-full rounded-xl border p-3" /><textarea placeholder="Write announcement" className="mt-3 h-24 w-full rounded-xl border p-3" /><button className="mt-3 rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white">Publish</button></div>}<div className="mt-5 space-y-3">{['Results for Second Term are ready', 'New Mathematics assignment posted', 'School assembly starts at 8:00 AM'].map((item) => <div key={item} className="flex gap-3 rounded-xl bg-slate-50 p-4"><Bell className="h-5 w-5 text-amber-500" /><div><p className="font-semibold">{item}</p><p className={muted}>Just now</p></div></div>)}</div></div>;
      if (portalSection === 'Live Feed') return <div className={card}><div className="flex items-center justify-between"><div><h3 className="text-xl font-bold">Live activity feed</h3><p className={muted}>Updates every 3.5 seconds · pulse {feedTick}</p></div><span className="flex items-center gap-2 text-sm font-bold text-red-600"><span className="h-2 w-2 animate-pulse rounded-full bg-red-600" /> Live</span></div><div className="mt-5 space-y-3">{feed.map((item, index) => <div key={`${item}-${feedTick}`} className="flex items-center gap-3 rounded-xl border border-slate-100 p-4"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-700">{index + 1}</span><div><p className="font-semibold">{item}</p><p className={muted}>{index + 1} min ago</p></div></div>)}</div></div>;
      if (portalSection === 'Analytics') return <div className="grid gap-5 lg:grid-cols-2"><div className={card}><h3 className="text-xl font-bold">Performance trend</h3><p className={muted}>Average scores · last 6 weeks</p><div className="mt-5 rounded-xl bg-emerald-50 p-4"><Sparkline values="0,30 20,27 40,23 60,18 80,14 100,5" /></div></div><div className={card}><h3 className="text-xl font-bold">Enrollment by class</h3><div className="mt-5 space-y-4">{[['JSS1', 82], ['JSS2', 66], ['SS1', 74], ['SS2', 58]].map(([label, value]) => <div key={label}><div className="mb-1 flex justify-between text-sm"><span>{label}</span><b>{value}</b></div><div className="h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-violet-500" style={{ width: `${value}%` }} /></div></div>)}</div></div><div className={`${card} lg:col-span-2`}><h3 className="text-xl font-bold">Attendance heatmap</h3><div className="mt-4 grid grid-cols-12 gap-2">{Array.from({ length: 84 }, (_, index) => <span key={index} title="Attendance activity" className={`h-5 rounded ${index % 9 === 0 ? 'bg-emerald-700' : index % 4 === 0 ? 'bg-emerald-400' : index % 3 === 0 ? 'bg-emerald-200' : 'bg-slate-100'}`} />)}</div></div></div>;
      return <div className="space-y-5"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{[['Active students', '1,248', '+8.2%', Users], ['Attendance today', '94.6%', '+2.1%', CheckCircle], ['Fees collected', '₦18.4m', '+12.4%', CreditCard], ['Average score', '78.4%', '+4.8%', TrendingUp]].map(([label, value, change, Icon]) => <div key={label} className={card}><div className="flex items-start justify-between"><div><p className={muted}>{label}</p><p className="mt-2 text-2xl font-black">{value}</p><p className="mt-1 text-xs font-bold text-emerald-600">{change} this month</p></div><Icon className="h-5 w-5 text-emerald-600" /></div><div className="mt-3"><Sparkline /></div></div>)}</div><div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]"><div className={card}><div className="flex items-center justify-between"><div><h3 className="text-xl font-bold">Academic pulse</h3><p className={muted}>School-wide engagement this week</p></div><button onClick={() => setPortalSection('Analytics')} className="text-sm font-semibold text-emerald-700">View analytics</button></div><div className="mt-5 grid grid-cols-7 items-end gap-3">{[42, 58, 48, 72, 66, 84, 76].map((height, index) => <div key={index} className="text-center"><div className="h-32 rounded-t-xl bg-slate-100"><div className="mt-auto h-full rounded-t-xl bg-emerald-500" style={{ height: `${height}%` }} /></div><span className="mt-2 block text-xs text-slate-500">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</span></div>)}</div></div><div className={card}><div className="flex items-center justify-between"><h3 className="text-xl font-bold">Live feed</h3><button onClick={() => setPortalSection('Live Feed')} className="text-sm font-semibold text-emerald-700">Open</button></div><div className="mt-4 space-y-3">{feed.slice(0, 3).map((item) => <div key={item} className="flex gap-3 text-sm"><span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" /><span>{item}</span></div>)}</div></div></div><div className={card}><div className="flex items-center justify-between"><div><h3 className="text-xl font-bold">Quick actions</h3><p className={muted}>Jump into the work that matters</p></div><button onClick={() => setShowAnnouncement(true)} className="rounded-xl border px-3 py-2 text-sm">New announcement</button></div><div className="mt-4 flex flex-wrap gap-3">{[['Student Portal', GraduationCap], ['Gradebook', BarChart3], ['Attendance', CheckCircle], ['CBT Exams', TimerReset], ['Messages', MessageSquare], ['Calendar', CalendarDays]].map(([label, Icon]) => <button key={label} onClick={() => setPortalSection(label)} className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold hover:bg-emerald-50"><Icon className="h-4 w-4 text-emerald-600" />{label}</button>)}</div></div></div>;
    };

    return <div className={`min-h-screen ${portalDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}`}><div className="flex min-h-screen"><aside className={`hidden w-64 shrink-0 border-r p-5 lg:block ${portalDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'}`}><div className="flex items-center gap-3"><BrandMark className="h-10 w-10 shrink-0" /><div><p className="font-black">Examprepp</p><p className="text-xs text-slate-500">School operations</p></div></div><div className="mt-7 rounded-xl bg-slate-100 p-2"><p className="px-2 text-xs font-bold uppercase text-slate-500">Workspace</p><select value={portalRole} onChange={(e) => setPortalRole(e.target.value)} className="mt-2 w-full rounded-lg border-0 bg-white p-2 text-sm font-semibold"><option>Student</option><option>Teacher</option><option>Administrator</option><option>Accountant</option></select></div><nav className="mt-6 space-y-1">{nav.map(({ label, icon: Icon }) => <button key={label} onClick={() => setPortalSection(label)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium ${portalSection === label ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}><Icon className="h-4 w-4" />{label}</button>)}</nav></aside><main className="min-w-0 flex-1"><header className={`sticky top-0 z-10 border-b px-5 py-4 backdrop-blur ${portalDarkMode ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white/90'}`}><div className="mx-auto flex max-w-7xl items-center justify-between gap-4"><div><p className="text-sm font-semibold text-emerald-600">{portalRole} workspace</p><h1 className="text-2xl font-black">{portalSection}</h1></div><div className="flex items-center gap-2"><button onClick={() => setPortalDarkMode(!portalDarkMode)} className="rounded-xl border p-2" title="Toggle dark mode">{portalDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button><button onClick={() => setPortalSection('Notifications')} className="relative rounded-xl border p-2"><Bell className="h-4 w-4" /><span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" /></button><button onClick={() => { setUser(null); setCurrentScreen('landing'); }} className="rounded-xl border p-2"><LogOut className="h-4 w-4" /></button></div></div></header><div className="mx-auto max-w-7xl p-5 lg:p-8"><div className="mb-6 flex gap-2 overflow-x-auto lg:hidden">{nav.slice(0, 8).map(({ label }) => <button key={label} onClick={() => setPortalSection(label)} className="whitespace-nowrap rounded-full border px-3 py-2 text-xs font-semibold">{label}</button>)}</div>{renderSection()}</div></main></div></div>;
  };

  const DashboardScreen = () => {
    const stats = [
      { label: 'Study streak', value: '12 days', icon: Sparkles },
      { label: 'Avg. score', value: '84%', icon: TrendingUp },
      { label: 'Tasks complete', value: '7/10', icon: CheckCircle },
      { label: 'Focus hours', value: '5.4h', icon: Clock }
    ];

    return (
      <div className="min-h-screen bg-slate-100 text-slate-800">
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <BrandMark className="h-10 w-10 shrink-0" />
              <div>
                <p className="text-lg font-bold text-slate-900">Examprepp</p>
                <p className="text-xs text-slate-500">Dashboard</p>
              </div>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <span className="text-sm font-medium text-slate-600">Welcome, {user?.name}</span>
              <button onClick={() => setCurrentScreen('upload')} className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700">Upload</button>
              {!isPremium && (
                <button onClick={() => setCurrentScreen('payment')} className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600">Full access</button>
              )}
              <button onClick={() => { setUser(null); setCurrentScreen('landing'); }} className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100">
                <LogOut className="h-4 w-4" />
              </button>
            </div>

            <button onClick={() => setShowMenu(!showMenu)} className="rounded-xl border border-slate-200 p-2 md:hidden">
              {showMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {showMenu && (
            <div className="mx-auto max-w-6xl space-y-2 px-4 pb-4 md:hidden">
              <button onClick={() => setCurrentScreen('upload')} className="w-full rounded-xl bg-slate-100 px-4 py-3 text-left font-medium">📤 Upload & Extract</button>
              <button onClick={() => setCurrentScreen('planner')} className="w-full rounded-xl bg-slate-100 px-4 py-3 text-left font-medium">🗓️ Study planner</button>
              {!isPremium && <button onClick={() => setCurrentScreen('payment')} className="w-full rounded-xl bg-amber-100 px-4 py-3 text-left font-medium text-amber-700">💎 Full access</button>}
              <button onClick={() => { setUser(null); setCurrentScreen('landing'); setShowMenu(false); }} className="w-full rounded-xl bg-red-50 px-4 py-3 text-left font-medium text-red-600">🚪 Logout</button>
            </div>
          )}
        </div>

        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Progress overview</p>
              <h2 className="mt-2 text-3xl font-black text-slate-900">Your learning dashboard</h2>
            </div>
            {!isPremium && (
              <button onClick={() => setCurrentScreen('payment')} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 px-5 py-3 font-semibold text-white shadow-lg shadow-amber-500/20 transition hover:brightness-105">
                <ShieldCheck className="h-4 w-4" />
                Upgrade to full access
              </button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="mt-2 text-2xl font-black text-slate-900">{value}</p>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900">Study modes</h3>
                  <span className="text-sm font-medium text-emerald-700">Improved flow</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {[
                    { title: 'Practice mode', desc: 'Daily challenge sets', icon: BrainCircuit, screen: 'practice', color: 'from-emerald-500 to-green-600' },
                    { title: 'Exam mode', desc: 'Timed mock exams', icon: Target, screen: 'selectSubject', color: 'from-violet-500 to-purple-600' },
                    { title: 'Upload notes', desc: 'Convert study text into practice', icon: FileText, screen: 'upload', color: 'from-sky-500 to-blue-600' }
                  ].map((card) => (
                    <button key={card.title} onClick={() => setCurrentScreen(card.screen)} className={`group rounded-2xl bg-gradient-to-br ${card.color} p-4 text-left text-white shadow-lg transition hover:-translate-y-0.5`}>
                      <div className="flex items-center justify-between">
                        <card.icon className="h-6 w-6" />
                        <ArrowRight className="h-4 w-4 opacity-80" />
                      </div>
                      <h4 className="mt-10 text-lg font-bold">{card.title}</h4>
                      <p className="mt-2 text-sm text-white/85">{card.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900">Recent exam activity</h3>
                  <button onClick={() => setCurrentScreen('savedList')} className="text-sm font-semibold text-emerald-700">View all</button>
                </div>
                <div className="mt-5 space-y-3">
                  {savedExams.length > 0 ? (
                    [...savedExams].reverse().slice(0, 3).map((exam) => (
                      <div key={exam.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <div>
                          <p className="font-semibold text-slate-900">{exam.subject}</p>
                          <p className="text-sm text-slate-500">{exam.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-emerald-600">{exam.percentage}%</p>
                          <p className="text-xs text-slate-500">{exam.score}/{exam.total}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
                      No saved exams yet. Start a new mock exam to track your progress.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-lg shadow-slate-900/15">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Premium overview</h3>
                  <button onClick={() => setCurrentScreen('payment')} className="rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-slate-900">{isPremium ? 'Active' : 'Upgrade'}</button>
                </div>
                <div className="mt-5 space-y-4">
                  {['Unlimited practice tests', 'Advanced analytics', 'Priority study planner', 'Fast note extraction'].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                      <div className="rounded-full bg-emerald-500/20 p-2 text-emerald-300">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <span className="text-sm text-slate-200">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900">Daily focus plan</h3>
                <div className="mt-5 space-y-4">
                  {[
                    { time: '08:30', task: 'Mathematics revision', level: 'High priority' },
                    { time: '11:00', task: 'English grammar drills', level: 'Medium' },
                    { time: '16:00', task: 'Physics recap', level: 'High priority' }
                  ].map((item) => (
                    <div key={item.time} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3">
                      <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-slate-900">{item.task}</p>
                          <span className="text-xs font-medium text-slate-500">{item.level}</span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PlannerScreen = () => {
    const planItems = [
      { day: 'Mon', focus: 'Math practice', status: 'Completed' },
      { day: 'Tue', focus: 'English writing', status: 'In progress' },
      { day: 'Wed', focus: 'Chemistry recap', status: 'Next' },
      { day: 'Thu', focus: 'Physics mock', status: 'Next' },
      { day: 'Fri', focus: 'Biology review', status: 'Planned' }
    ];

    return (
      <div className="min-h-screen bg-slate-100 p-4">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-center justify-between">
            <button onClick={() => setCurrentScreen('dashboard')} className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white">← Back</button>
            <h2 className="text-3xl font-black text-slate-900">Study planner</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {planItems.map((item) => (
              <div key={item.day} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{item.day}</p>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{item.focus}</h3>
                <div className="mt-5 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{item.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const SubjectSelectionScreen = () => {
    return (
      <div className="min-h-screen bg-slate-100 p-4">
        <div className="mx-auto max-w-6xl">
          <button onClick={() => setCurrentScreen('dashboard')} className="mb-6 rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white">← Back</button>

          <div className="mb-8 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">Exam mode</p>
              <h2 className="text-3xl font-black text-slate-900">Select subject</h2>
            </div>
            <div className="hidden rounded-full border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-medium text-violet-700 md:block">
              {isPremium ? 'Full access enabled' : 'Unlock more exam packs'}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => {
                  setSelectedExamSubject(subject);
                  setCurrentSubject(subject);
                  setCurrentQuestionIndex(0);
                  setUserAnswers({});
                  setCurrentScreen('practice');
                }}
                className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-3 text-4xl">
                  {subject === 'Mathematics' && '📐'}
                  {subject === 'English Language' && '📖'}
                  {subject === 'Physics' && '⚛️'}
                  {subject === 'Chemistry' && '🧪'}
                  {subject === 'Biology' && '🧬'}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{subject}</h3>
                <p className="mt-2 text-sm text-slate-600">{QUESTIONS_DB[subject].length} questions</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const PracticeScreen = () => {
    const questions = QUESTIONS_DB[currentSubject] || [];
    const currentQuestion = questions[currentQuestionIndex];
    const userAnswer = userAnswers[currentQuestion?.id];
    const isAnswered = userAnswer !== undefined;

    if (!currentQuestion) {
      const correctCount = questions.filter((q) => userAnswers[q.id] === q.answer).length;
      const percentage = Math.round((correctCount / questions.length) * 100);

      const handleSaveExam = () => {
        const examData = {
          id: Date.now(),
          subject: selectedExamSubject,
          date: new Date().toLocaleDateString(),
          score: correctCount,
          total: questions.length,
          percentage,
          answers: userAnswers,
          timestamp: new Date().toLocaleString()
        };

        setSavedExams([...savedExams, examData]);
        alert('✅ Exam saved successfully!');
      };

      return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-violet-50 p-4">
          <div className="mx-auto max-w-2xl">
            <div className="mb-6 rounded-[2rem] bg-white p-8 text-center shadow-lg border border-slate-200">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle className="h-12 w-12" />
              </div>
              <h2 className="text-3xl font-black text-slate-900">Exam complete</h2>

              <div className="mt-6 rounded-3xl bg-gradient-to-r from-emerald-500 to-violet-600 p-8 text-white">
                <div className="text-5xl font-black">{percentage}%</div>
                <p className="mt-2 text-xl">{correctCount} out of {questions.length} correct</p>
              </div>

              <div className="mt-6 space-y-3">
                <button onClick={handleSaveExam} className="w-full rounded-2xl bg-emerald-600 py-3 font-bold text-white transition hover:bg-emerald-700">💾 Save this exam</button>
                <button onClick={() => { setCurrentQuestionIndex(0); setUserAnswers({}); setCurrentScreen('selectSubject'); }} className="w-full rounded-2xl bg-violet-600 py-3 font-bold text-white transition hover:bg-violet-700">📚 Retake another exam</button>
                <button onClick={() => { setCurrentQuestionIndex(0); setUserAnswers({}); setCurrentScreen('dashboard'); }} className="w-full rounded-2xl bg-slate-600 py-3 font-bold text-white transition hover:bg-slate-700">← Back to dashboard</button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-slate-100 p-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <button onClick={() => setCurrentScreen('dashboard')} className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white">← Back</button>
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">{currentSubject}</h3>
              <p className="text-sm text-slate-500">Question {currentQuestionIndex + 1} of {questions.length}</p>
            </div>
            <div className="w-20" />
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg">
            <h3 className="mb-6 text-2xl font-bold text-slate-900">{currentQuestion.question}</h3>

            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option, idx) => {
                const isCorrect = idx === currentQuestion.answer;
                const isSelected = userAnswer === idx;
                let bgColor = 'border-slate-200 bg-slate-50 hover:bg-slate-100';

                if (isAnswered) {
                  if (isCorrect) {
                    bgColor = 'border-emerald-500 bg-emerald-50';
                  } else if (isSelected && !isCorrect) {
                    bgColor = 'border-red-500 bg-red-50';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => !isAnswered && setUserAnswers({ ...userAnswers, [currentQuestion.id]: idx })}
                    disabled={isAnswered}
                    className={`w-full rounded-2xl border-2 p-4 text-left transition ${bgColor}`}
                  >
                    <span className="mr-3 font-black">{String.fromCharCode(65 + idx)}.</span>
                    {option}
                    {isAnswered && isCorrect && <CheckCircle className="float-right mt-1 h-5 w-5 text-emerald-600" />}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="mb-6 rounded-2xl border-l-4 border-blue-500 bg-blue-50 p-4">
                <p className="font-semibold text-blue-900">Explanation:</p>
                <p className="mt-2 text-blue-800">{currentQuestion.explanation}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))} disabled={currentQuestionIndex === 0} className="rounded-xl bg-slate-300 px-6 py-2 font-semibold text-slate-700 disabled:opacity-50">Previous</button>
              <button onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)} className="rounded-xl bg-emerald-600 px-6 py-2 font-semibold text-white">{currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const UploadSummarizeScreen = () => {
    return (
      <div className="min-h-screen bg-slate-100 p-4">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-black text-slate-900">Upload & extract</h2>
            <button onClick={() => setCurrentScreen('dashboard')} className="rounded-xl bg-slate-700 p-2 text-white"><Home className="h-5 w-5" /></button>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900">Turn notes into practice questions</h3>
            <p className="mt-2 text-slate-600">Upload text files with MCQ formats and instantly extract structured content for revision.</p>

            <div className="mt-6 rounded-2xl border-l-4 border-blue-500 bg-blue-50 p-4">
              <p className="font-semibold text-blue-900">Format example</p>
              <pre className="mt-2 text-xs text-blue-800">{`1. What is 2+2?\nA. 3\nB. 4\nC. 5\nD. 6\nAnswer: B`}</pre>
            </div>

            <div className="mt-6 rounded-3xl border-2 border-dashed border-sky-300 bg-sky-50 p-10 text-center">
              <label className="block cursor-pointer">
                <div className="mb-4 text-5xl">📁</div>
                <h4 className="text-lg font-semibold text-slate-900">Click to upload your file</h4>
                <p className="mt-2 text-sm text-slate-600">TXT files only</p>
                <input type="file" onChange={handleFileUpload} accept=".txt" className="hidden" disabled={isLoading} />
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={startVoiceCapture}
                className="rounded-2xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-700"
              >
                {isListening ? '🎙️ Listening...' : '🎙️ Dictate question set'}
              </button>
              <button
                onClick={readUploadedText}
                className="rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
              >
                🔊 Read uploaded questions aloud
              </button>
            </div>

            {!voiceSupported && (
              <p className="mt-3 text-sm text-slate-500">Voice support works best in Chrome or Edge browsers.</p>
            )}

            {uploadedFile && (
              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                ✓ File selected: <span className="font-semibold">{uploadedFile.name}</span>
              </div>
            )}
          </div>

          {isLoading && (
            <div className="mt-6 rounded-[2rem] bg-white p-8 text-center shadow-sm border border-slate-200">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />
              <p className="font-semibold text-slate-700">Extracting questions...</p>
            </div>
          )}

          {extractedQuestions.length > 0 && !isLoading && (
            <div className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Extracted questions</h3>
                  <p className="text-sm text-slate-600">{summary}</p>
                </div>
                <button onClick={() => { setSummary(''); setUploadedFile(null); setExtractedQuestions([]); setUploadedAnswers({}); }} className="rounded-xl bg-sky-600 px-4 py-2 font-semibold text-white">Upload another</button>
              </div>

              <div className="space-y-6">
                {extractedQuestions.map((question) => {
                  const selected = uploadedAnswers[question.number];
                  const correct = question.answer;

                  return (
                    <div key={question.number} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Question {question.number}</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">{question.text}</p>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {question.options.map((option) => {
                          const isSelected = selected === option.letter;
                          const isCorrectOption = correct === option.letter;
                          const showCorrect = selected && correct;
                          let optionClass = 'border border-slate-200 bg-white text-slate-800';

                          if (showCorrect && isCorrectOption) {
                            optionClass = 'border border-emerald-500 bg-emerald-100 text-slate-900';
                          } else if (isSelected) {
                            optionClass = 'border border-blue-500 bg-blue-100 text-slate-900';
                          }

                          if (showCorrect && isSelected && !isCorrectOption) {
                            optionClass = 'border border-red-500 bg-red-100 text-slate-900';
                          }

                          return (
                            <button key={option.letter} onClick={() => setUploadedAnswers((prev) => ({ ...prev, [question.number]: option.letter }))} className={`${optionClass} rounded-2xl p-4 text-left transition hover:shadow-sm`}>
                              <span className="mr-3 font-black">{option.letter}.</span>
                              {option.text}
                              {showCorrect && isCorrectOption && <span className="ml-2 text-sm font-semibold text-emerald-700">✓ Correct</span>}
                            </button>
                          );
                        })}
                      </div>

                      {selected && correct && (
                        <div className="mt-4 rounded-2xl bg-slate-100 p-4 text-sm text-slate-700">
                          {selected === correct ? (
                            <p className="font-semibold text-emerald-700">Correct! You selected {selected}.</p>
                          ) : (
                            <p className="font-semibold text-red-700">Incorrect. You selected {selected}. Correct answer: {correct}.</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const SavedListScreen = () => (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <button onClick={() => setCurrentScreen('dashboard')} className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white">← Back</button>
          <h2 className="text-3xl font-black text-slate-900">Saved exams</h2>
        </div>

        {savedExams.length === 0 ? (
          <div className="rounded-[2rem] bg-white p-12 text-center shadow-sm border border-slate-200">
            <p className="text-xl text-slate-600">No saved exams yet.</p>
            <button onClick={() => setCurrentScreen('selectSubject')} className="mt-4 rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white">Take an exam</button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {[...savedExams].reverse().map((exam) => (
              <div key={exam.id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900">{exam.subject}</h3>
                <p className="mt-2 text-sm text-slate-500">{exam.timestamp}</p>
                <div className="mt-4 text-3xl font-black text-emerald-600">{exam.percentage}%</div>
                <p className="mt-2 font-semibold text-slate-800">Score: {exam.score}/{exam.total}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const PaymentScreen = () => {
    const plans = [
      { name: 'Starter', price: '₦1,500', benefit: 'Essential study access', featured: false },
      { name: 'Pro', price: '₦2,500', benefit: 'Full practice + analytics', featured: true },
      { name: 'Premium', price: '₦4,500', benefit: 'Unlimited advanced prep', featured: false }
    ];

    return (
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">Full access</p>
              <h2 className="text-3xl font-black text-slate-900">Choose your premium plan</h2>
            </div>
            <button onClick={() => setCurrentScreen('dashboard')} className="rounded-xl bg-slate-700 px-4 py-2 font-semibold text-white">Cancel</button>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan.name} className={`rounded-[2rem] border p-6 shadow-sm ${plan.featured ? 'border-amber-300 bg-gradient-to-b from-amber-50 to-white' : 'border-slate-200 bg-white'}`}>
                <p className="text-lg font-bold text-slate-900">{plan.name}</p>
                <div className="mt-4 text-4xl font-black text-slate-900">{plan.price}<span className="text-base font-medium text-slate-500">/month</span></div>
                <p className="mt-3 text-sm text-slate-600">{plan.benefit}</p>
                <ul className="mt-5 space-y-2 text-sm text-slate-700">
                  <li>✓ Advanced practice library</li>
                  <li>✓ Smart analytics dashboard</li>
                  <li>✓ Unlimited exam simulation</li>
                </ul>
                <button
                  onClick={() => {
                    setIsPremium(true);
                    setCurrentScreen('dashboard');
                  }}
                  className={`mt-6 w-full rounded-2xl px-4 py-3 font-bold text-white ${plan.featured ? 'bg-gradient-to-r from-amber-500 to-yellow-500' : 'bg-slate-900'}`}
                >
                  {plan.featured ? 'Get full access' : 'Choose plan'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (!user) {
    return <LandingScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {currentScreen === 'portal' && <SchoolPortal user={user} questionBank={QUESTIONS_DB} onLogout={() => { setUser(null); setCurrentScreen('landing'); }} />}
      {currentScreen === '__legacy-portal' && <PortalScreen />}
      {currentScreen === 'dashboard' && <DashboardScreen />}
      {currentScreen === 'practice' && <PracticeScreen />}
      {currentScreen === 'upload' && <UploadSummarizeScreen />}
      {currentScreen === 'selectSubject' && <SubjectSelectionScreen />}
      {currentScreen === 'savedList' && <SavedListScreen />}
      {currentScreen === 'payment' && <PaymentScreen />}
      {currentScreen === 'planner' && <PlannerScreen />}
    </div>
  );
}