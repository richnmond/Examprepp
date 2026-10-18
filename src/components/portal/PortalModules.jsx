import React, { useEffect, useState } from 'react';
import { AlertTriangle, Bell, ChevronDown, Download, FileText, Lightbulb, Plus, Send, TimerReset, Upload } from 'lucide-react';
import { defaultAttendance, defaultGradeRows, feedItems } from './portalData';

const Card = ({ children, className = '' }) => <div className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</div>;
const muted = 'text-slate-500';

function StudentPortal() {
  return <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]"><Card><h3 className="text-xl font-bold">Student profile</h3><div className="mt-5 flex items-center gap-4"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-xl font-black text-emerald-700">AO</div><div><p className="text-lg font-bold">Ada Okafor</p><p className={muted}>SS2A · ID EX-2048 · Science track</p></div></div><div className="mt-6 grid grid-cols-2 gap-3 text-sm"><div className="rounded-xl bg-slate-50 p-3"><p className={muted}>Courses</p><b>8 active</b></div><div className="rounded-xl bg-slate-50 p-3"><p className={muted}>Attendance</p><b>94%</b></div></div></Card><Card><h3 className="text-xl font-bold">Today&apos;s timetable</h3><div className="mt-4 space-y-3">{['08:00 Mathematics · Room 2', '10:15 Physics · Lab 1', '13:00 English Language · Room 4', '15:30 Study hall · Library'].map((item) => <div key={item} className="rounded-xl bg-slate-50 p-3 text-sm font-medium">{item}</div>)}</div></Card><Card className="lg:col-span-2"><h3 className="text-xl font-bold">Assignments & library</h3><div className="mt-4 grid gap-3 md:grid-cols-3">{['Physics lab report · Due tomorrow', 'English comprehension · Due Friday', 'JAMB revision pack · 32 questions'].map((item) => <div key={item} className="rounded-xl border border-slate-200 p-4 text-sm"><p className="font-semibold">{item}</p><button className="mt-3 text-emerald-700">Open resource</button></div>)}</div></Card></div>;
}

function Attendance() {
  const [records, setRecords] = useState(defaultAttendance);
  return <Card><div className="flex items-center justify-between"><div><h3 className="text-xl font-bold">Class attendance</h3><p className={muted}>SS2A · Wednesday, 16 September 2026</p></div><button className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Save register</button></div><div className="mt-5 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b text-xs uppercase text-slate-500"><th className="py-3">Student</th><th>Status</th><th>Change</th></tr></thead><tbody>{Object.entries(records).map(([firstName, status]) => <tr key={firstName} className="border-b last:border-0"><td className="py-4 font-semibold">{firstName} {firstName === 'Ada' ? 'Okafor' : firstName === 'Musa' ? 'Bello' : 'Eze'}</td><td><span className={`rounded-full px-2 py-1 text-xs font-bold ${status === 'Present' ? 'bg-emerald-100 text-emerald-700' : status === 'Late' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{status}</span></td><td><select value={status} onChange={(event) => setRecords({ ...records, [firstName]: event.target.value })} className="rounded-lg border border-slate-200 p-2"><option>Present</option><option>Late</option><option>Absent</option></select></td></tr>)}</tbody></table></div></Card>;
}

function Gradebook() {
  const [rows, setRows] = useState(defaultGradeRows);
  const update = (index, field, value) => setRows(rows.map((row, rowIndex) => rowIndex === index ? { ...row, [field]: Number(value) } : row));
  return <Card><div className="flex items-center justify-between"><div><h3 className="text-xl font-bold">Gradebook</h3><p className={muted}>Mathematics · SS2A · editable continuous assessment</p></div><button className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"><Download className="h-4 w-4" /> Export</button></div><div className="mt-5 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b text-xs uppercase text-slate-500"><th className="py-3">Student</th><th>CA / 30</th><th>Exam / 70</th><th>Total</th></tr></thead><tbody>{rows.map((row, index) => <tr key={row.name} className="border-b last:border-0"><td className="py-4 font-semibold">{row.name}</td><td><input type="number" value={row.ca} onChange={(event) => update(index, 'ca', event.target.value)} className="w-20 rounded-lg border p-2" /></td><td><input type="number" value={row.exam} onChange={(event) => update(index, 'exam', event.target.value)} className="w-20 rounded-lg border p-2" /></td><td className="font-bold text-emerald-700">{row.ca + row.exam}%</td></tr>)}</tbody></table></div></Card>;
}

function Messages() { return <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]"><Card><div className="flex justify-between"><h3 className="text-xl font-bold">Inbox</h3><span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">3 new</span></div><div className="mt-4 space-y-2">{['Mrs. Adebayo · Assignment feedback', 'Admin office · Fee reminder', 'Mr. Cole · Parent meeting'].map((item) => <button key={item} className="w-full rounded-xl bg-slate-50 p-3 text-left text-sm"><p className="font-semibold">{item}</p><p className={muted}>Today · 10:20</p></button>)}</div></Card><Card><h3 className="text-xl font-bold">Compose message</h3><select className="mt-4 w-full rounded-xl border p-3"><option>To: Class teacher</option><option>To: Admin office</option></select><input placeholder="Subject" className="mt-3 w-full rounded-xl border p-3" /><textarea placeholder="Write a message..." className="mt-3 h-32 w-full rounded-xl border p-3" /><button className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white"><Send className="h-4 w-4" /> Send message</button></Card></div>; }

function Payroll() { const [expanded, setExpanded] = useState(null); const rows = [{ name: 'Basic salary', value: '₦420,000' }, { name: 'Housing allowance', value: '₦80,000' }, { name: 'Transport allowance', value: '₦45,000' }, { name: 'PAYE + pension', value: '-₦62,500' }]; return <Card><h3 className="text-xl font-bold">Payroll · September 2026</h3><div className="mt-4 space-y-3">{rows.map((row) => <div key={row.name} className="rounded-xl border border-slate-200"><button onClick={() => setExpanded(expanded === row.name ? null : row.name)} className="flex w-full items-center justify-between p-4 text-left"><span className="font-semibold">{row.name}</span><span className="flex items-center gap-2 font-bold">{row.value}<ChevronDown className={`h-4 w-4 ${expanded === row.name ? 'rotate-180' : ''}`} /></span></button>{expanded === row.name && <p className="border-t px-4 py-3 text-sm text-slate-500">Included in the September payroll run.</p>}</div>)}</div><div className="mt-5 flex justify-between rounded-xl bg-slate-900 p-4 font-bold text-white"><span>Net pay</span><span>₦482,500</span></div></Card>; }

function Calendar() { return <Card><div className="flex items-center justify-between"><h3 className="text-xl font-bold">May 2026</h3><div className="flex gap-2"><button className="rounded-lg border px-3 py-1">‹</button><button className="rounded-lg border px-3 py-1">›</button></div></div><div className="mt-5 grid grid-cols-7 gap-2 text-center text-xs">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <div key={day} className="py-2 font-bold text-slate-400">{day}</div>)}{Array.from({ length: 35 }, (_, index) => { const day = index - 4; const marked = [5, 12, 18, 25].includes(day); return <button key={index} className={`min-h-12 rounded-xl p-2 text-left ${day > 0 && day <= 31 ? 'bg-slate-50 hover:bg-emerald-50' : 'text-slate-300'} ${marked ? 'border-2 border-emerald-400' : ''}`}>{day > 0 && day <= 31 ? day : ''}{marked && <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-emerald-500" />}</button>; })}</div></Card>; }

function LearningHub({ questionBank }) {
  const subjects = Object.keys(questionBank || {});
  const [subject, setSubject] = useState(subjects[0] || 'Mathematics');
  const [studyIndex, setStudyIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfName, setPdfName] = useState('');
  const [notes, setNotes] = useState('');
  const studyQuestions = questionBank?.[subject] || [];
  const studyQuestion = studyQuestions[studyIndex];

  useEffect(() => () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
  }, [pdfUrl]);

  const handlePdfUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfName(file.name);
    setPdfUrl(URL.createObjectURL(file));
  };

  const changeStudySubject = (event) => {
    setSubject(event.target.value);
    setStudyIndex(0);
    setShowAnswer(false);
  };

  return <div className="space-y-5">
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <div className="flex items-start gap-3"><div className="rounded-xl bg-emerald-100 p-3 text-emerald-700"><Lightbulb className="h-5 w-5" /></div><div><h3 className="text-xl font-bold">Learning Hub</h3><p className={muted}>Prepare with your notes before entering the timed CBT.</p></div></div>
        <label className="mt-5 flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50 p-8 text-center"><Upload className="h-8 w-8 text-emerald-600" /><span className="mt-3 font-bold">Upload a PDF to learn</span><span className="mt-1 text-sm text-slate-500">Preview your study material inside the app</span><input type="file" accept="application/pdf,.pdf" onChange={handlePdfUpload} className="hidden" /></label>
        {pdfName && <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-sm"><FileText className="h-5 w-5 text-red-600" /><span className="font-semibold">{pdfName}</span></div>}
        <label className="mt-4 block text-sm font-semibold">Quick notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Write key points while you study..." className="mt-2 h-28 w-full rounded-xl border p-3 font-normal" /></label>
      </Card>
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="text-xl font-bold">Study from CBT questions</h3><p className={muted}>Practice without the exam timer.</p></div><select value={subject} onChange={changeStudySubject} className="rounded-xl border p-2 text-sm">{subjects.map((item) => <option key={item}>{item}</option>)}</select></div>
        {studyQuestion && <div className="mt-5 rounded-2xl bg-slate-50 p-5"><div className="flex justify-between text-xs font-bold uppercase text-slate-500"><span>Study question {studyIndex + 1} of {studyQuestions.length}</span><span>{studyQuestion.free ? 'Free' : 'Advanced'}</span></div><p className="mt-4 text-lg font-bold">{studyQuestion.question}</p><div className="mt-4 grid gap-2">{studyQuestion.options.map((option, index) => <div key={option} className={`rounded-xl border p-3 text-sm ${showAnswer && index === studyQuestion.answer ? 'border-emerald-500 bg-emerald-100 font-bold' : 'bg-white'}`}><b className="mr-2">{String.fromCharCode(65 + index)}.</b>{option}</div>)}</div>{showAnswer && <div className="mt-4 rounded-xl border-l-4 border-emerald-500 bg-emerald-50 p-4 text-sm"><p className="font-bold text-emerald-800">Correct answer: {String.fromCharCode(65 + studyQuestion.answer)}. {studyQuestion.options[studyQuestion.answer]}</p><p className="mt-2 text-slate-700">{studyQuestion.explanation}</p></div>}<div className="mt-5 flex flex-wrap gap-3"><button onClick={() => setShowAnswer(!showAnswer)} className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white">{showAnswer ? 'Hide explanation' : 'Show answer'}</button><button onClick={() => { setStudyIndex(Math.max(0, studyIndex - 1)); setShowAnswer(false); }} disabled={studyIndex === 0} className="rounded-xl border px-4 py-2 disabled:opacity-40">Previous</button><button onClick={() => { setStudyIndex(Math.min(studyQuestions.length - 1, studyIndex + 1)); setShowAnswer(false); }} disabled={studyIndex === studyQuestions.length - 1} className="rounded-xl border px-4 py-2 disabled:opacity-40">Next study question</button></div></div>}
      </Card>
    </div>
    {pdfUrl && <Card><div className="mb-4 flex items-center justify-between"><div><h3 className="text-xl font-bold">PDF study preview</h3><p className={muted}>Read your uploaded material before starting CBT.</p></div><button onClick={() => { URL.revokeObjectURL(pdfUrl); setPdfUrl(''); setPdfName(''); }} className="rounded-xl border px-4 py-2 text-sm">Remove PDF</button></div><iframe title="Uploaded study PDF" src={pdfUrl} className="h-[620px] w-full rounded-xl border" /></Card>}
  </div>;
}

function CbtExam({ questionBank, tabSwitches }) {
  const subjects = Object.keys(questionBank || {});
  const [subject, setSubject] = useState(subjects[0] || 'Mathematics');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(40 * 60);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const questions = questionBank?.[subject] || [];
  const question = questions[questionIndex];
  const selectedAnswer = question ? answers[question.id] : undefined;

  useEffect(() => {
    if (!isStarted || isFinished) return undefined;
    const timer = window.setInterval(() => setSecondsLeft((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [isStarted, isFinished]);

  useEffect(() => {
    setQuestionIndex(0);
    setAnswers({});
    setSecondsLeft(40 * 60);
    setIsStarted(false);
    setIsFinished(false);
    setIsReviewing(false);
  }, [subject]);

  if (!question) return <Card><p className="text-slate-500">No questions are available for this subject.</p></Card>;

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');
  const answeredCount = Object.keys(answers).length;
  const answerQuestion = (optionIndex) => setAnswers((current) => ({ ...current, [question.id]: optionIndex }));
  const correctCount = questions.reduce((total, item) => total + (answers[item.id] === item.answer ? 1 : 0), 0);
  const finishExam = () => setIsFinished(true);

  if (!isStarted) {
    return <Card>
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700"><TimerReset className="h-8 w-8" /></div>
        <h3 className="mt-5 text-2xl font-black">Ready to start your CBT?</h3>
        <p className="mt-2 text-slate-500">Review the exam details before the timer begins.</p>
        <div className="mt-6 grid gap-3 text-left sm:grid-cols-3"><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs uppercase text-slate-500">Subject</p><p className="mt-1 font-bold">{subject}</p></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs uppercase text-slate-500">Questions</p><p className="mt-1 font-bold">{questions.length}</p></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs uppercase text-slate-500">Time limit</p><p className="mt-1 font-bold">40 minutes</p></div></div>
        <select value={subject} onChange={(event) => setSubject(event.target.value)} className="mt-6 w-full rounded-xl border p-3 text-left">{subjects.map((item) => <option key={item}>{item}</option>)}</select>
        <button onClick={() => setIsStarted(true)} className="mt-5 w-full rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-700">Start CBT</button>
        <p className="mt-3 text-xs text-slate-500">The countdown begins only after you click Start CBT.</p>
      </div>
    </Card>;
  }

  if (isFinished) {
    const percentage = Math.round((correctCount / questions.length) * 100);
    if (isReviewing) {
      return <Card>
        <div className="flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div><h3 className="text-2xl font-black">Answer review</h3><p className="text-slate-500">{subject} · Wrong answers are highlighted below.</p></div>
          <button onClick={() => setIsReviewing(false)} className="rounded-xl border px-4 py-2 font-semibold">Back to result</button>
        </div>
        <div className="mt-5 space-y-4">
          {questions.map((item, index) => {
            const selected = answers[item.id];
            const isCorrect = selected === item.answer;
            return <div key={item.id} className={`rounded-2xl border-2 p-5 ${isCorrect ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
              <div className="flex items-start justify-between gap-3"><p className="font-bold">{index + 1}. {item.question}</p><span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-black ${isCorrect ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>{isCorrect ? 'Correct' : 'Wrong'}</span></div>
              <div className="mt-4 grid gap-2 text-sm"><p className="rounded-xl bg-white/80 p-3"><b>Your answer:</b> {selected === undefined ? <span className="text-red-700">Not answered</span> : `${String.fromCharCode(65 + selected)}. ${item.options[selected]}`}</p><p className="rounded-xl bg-white/80 p-3"><b>Correct answer:</b> {String.fromCharCode(65 + item.answer)}. {item.options[item.answer]}</p></div>
              <p className="mt-3 text-sm text-slate-700"><b>Explanation:</b> {item.explanation}</p>
            </div>;
          })}
        </div>
      </Card>;
    }
    return <Card>
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">✓</div>
        <h3 className="mt-4 text-2xl font-black">Exam complete</h3>
        <p className="mt-2 text-slate-500">{subject} · Your answers have been submitted.</p>
        <div className="mt-6 rounded-2xl bg-emerald-50 p-6"><p className="text-5xl font-black text-emerald-700">{percentage}%</p><p className="mt-2 font-semibold">{correctCount} of {questions.length} correct</p><p className="mt-1 text-sm text-slate-500">{questions.length - answeredCount} unanswered</p></div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center"><button onClick={() => { setQuestionIndex(0); setAnswers({}); setSecondsLeft(40 * 60); setIsStarted(false); setIsFinished(false); setIsReviewing(false); }} className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white">Retake exam</button><button onClick={() => setIsReviewing(true)} className="rounded-xl border px-5 py-3 font-semibold">Review answers</button></div>
      </div>
    </Card>;
  }

  return <Card>
    <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div><h3 className="text-xl font-bold">CBT examination room</h3><p className={muted}>Original question bank · {answeredCount}/{questions.length} answered</p></div>
      <div className="flex items-center gap-3"><select value={subject} onChange={(event) => setSubject(event.target.value)} className="rounded-xl border p-2 text-sm">{subjects.map((item) => <option key={item}>{item}</option>)}</select><span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-2 text-sm font-bold text-red-700"><TimerReset className="h-4 w-4" /> {minutes}:{seconds}</span></div>
    </div>
    <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_220px]">
      <div>
        <div className="mb-4 flex items-center justify-between text-sm text-slate-500"><span>Question {questionIndex + 1} of {questions.length}</span><span>Correct answer is hidden until review</span></div>
        <p className="text-lg font-semibold">{question.question}</p>
        <div className="mt-4 grid gap-3">{question.options.map((option, index) => <button key={option} onClick={() => answerQuestion(index)} className={`rounded-xl border p-4 text-left transition ${selectedAnswer === index ? 'border-emerald-600 bg-emerald-50' : 'hover:border-emerald-500'}`}><b className="mr-3">{String.fromCharCode(65 + index)}.</b>{option}</button>)}</div>
        <div className="mt-5 flex justify-between gap-3"><button onClick={() => setQuestionIndex(Math.max(0, questionIndex - 1))} disabled={questionIndex === 0} className="rounded-xl border px-4 py-2 disabled:opacity-40">Previous</button>{questionIndex === questions.length - 1 ? <button onClick={finishExam} className="rounded-xl bg-emerald-600 px-5 py-2 font-semibold text-white">Finish exam</button> : <button onClick={() => setQuestionIndex(questionIndex + 1)} className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white">Next question</button>}</div>
      </div>
      <div className="rounded-xl bg-slate-50 p-4"><p className="text-sm font-bold">Answer review</p><div className="mt-3 grid grid-cols-5 gap-2">{questions.map((item, index) => <button key={item.id} onClick={() => setQuestionIndex(index)} className={`h-8 rounded-lg text-xs font-bold ${index === questionIndex ? 'bg-emerald-600 text-white' : answers[item.id] !== undefined ? 'bg-emerald-100 text-emerald-700' : 'bg-white'}`}>{index + 1}</button>)}</div><p className="mt-4 text-xs text-slate-500">Tab switches detected: {tabSwitches}</p><p className="mt-2 text-xs text-slate-500">Answers and explanations are from the original JSON question pack.</p></div>
    </div>
  </Card>;
}

function Discipline() { const [open, setOpen] = useState(false); return <Card><div className="flex items-center justify-between"><div><h3 className="text-xl font-bold">Discipline log</h3><p className={muted}>Private pastoral records</p></div><button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white"><Plus className="h-4 w-4" /> Log incident</button></div><div className="mt-5 space-y-3">{['Musa Bello · Late arrival · 15 Sep', 'Chidi Eze · Missing assignment · 10 Sep'].map((item) => <div key={item} className="flex items-center justify-between rounded-xl bg-red-50 p-4 text-sm"><span className="font-semibold text-red-900">{item}</span><AlertTriangle className="h-4 w-4 text-red-600" /></div>)}</div>{open && <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/40 p-4"><div className="w-full max-w-md rounded-2xl bg-white p-6"><div className="flex justify-between"><h3 className="text-xl font-bold">New incident</h3><button onClick={() => setOpen(false)}>✕</button></div><input placeholder="Student name" className="mt-5 w-full rounded-xl border p-3" /><textarea placeholder="Describe the incident" className="mt-3 h-24 w-full rounded-xl border p-3" /><button onClick={() => setOpen(false)} className="mt-4 w-full rounded-xl bg-slate-900 py-3 font-semibold text-white">Save incident</button></div></div>}</Card>; }

function SimplePanel({ title, children }) { return <Card><h3 className="text-xl font-bold">{title}</h3><div className="mt-4">{children}</div></Card>; }

export default function PortalModules({ section, questionBank, tabSwitches, feedTick }) {
  if (section === 'Student Portal') return <StudentPortal />;
  if (section === 'Attendance') return <Attendance />;
  if (section === 'Gradebook') return <Gradebook />;
  if (section === 'Messages') return <Messages />;
  if (section === 'Payroll') return <Payroll />;
  if (section === 'Calendar') return <Calendar />;
  if (section === 'Learning Hub') return <LearningHub questionBank={questionBank} />;
  if (section === 'CBT Exams') return <CbtExam questionBank={questionBank} tabSwitches={tabSwitches} />;
  if (section === 'Discipline') return <Discipline />;
  if (section === 'Results') return <SimplePanel title="Results & report card"><div className="rounded-xl border-2 border-slate-200 p-6"><p className="font-black">EXAMPREP COLLEGE</p><p className={muted}>Official report card preview · Second term</p><div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">{[['Average', '84%'], ['Position', '4th'], ['Attendance', '94%'], ['Conduct', 'Excellent']].map(([label, value]) => <div key={label} className="rounded-xl bg-slate-50 p-3"><p className={muted}>{label}</p><b>{value}</b></div>)}</div><button className="mt-5 rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white"><Download className="mr-2 inline h-4 w-4" /> Download PDF</button></div></SimplePanel>;
  if (section === 'Fees') return <SimplePanel title="Fees & receipts"><p className={muted}>Outstanding balance</p><p className="mt-2 text-4xl font-black">₦185,000</p><div className="mt-5 h-2 rounded-full bg-slate-100"><div className="h-full w-[72%] rounded-full bg-emerald-500" /></div><button className="mt-5 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white">Pay with Paystack / Stripe</button><div className="mt-5 space-y-2 text-sm">{['INV-2048 · ₦250,000 · 02 Sep 2026', 'INV-1984 · ₦120,000 · 12 Jun 2026'].map((receipt) => <div key={receipt} className="rounded-xl bg-slate-50 p-3">{receipt}</div>)}</div></SimplePanel>;
  if (section === 'Exam Builder') return <SimplePanel title="Exam Builder"><div className="grid grid-cols-3 gap-2 text-center text-sm">{['1. Details', '2. Questions', '3. Publish'].map((step, index) => <div key={step} className={`rounded-xl p-3 font-bold ${index === 0 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{step}</div>)}</div><div className="mt-5 grid gap-3 md:grid-cols-2"><input placeholder="Exam title" className="rounded-xl border p-3" /><select className="rounded-xl border p-3"><option>Mathematics</option><option>Physics</option></select><input placeholder="Duration (minutes)" className="rounded-xl border p-3" /><input placeholder="Total questions" className="rounded-xl border p-3" /></div><button className="mt-5 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white">Continue to questions</button></SimplePanel>;
  if (section === 'Live Feed') return <SimplePanel title={`Live activity feed · pulse ${feedTick}`}><div className="space-y-3">{feedItems.map((item) => <div key={item} className="rounded-xl border border-slate-100 p-4"><p className="font-semibold">{item}</p><p className={muted}>Just now</p></div>)}</div></SimplePanel>;
  if (section === 'Notifications') return <SimplePanel title="Notifications"><button className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white"><Bell className="mr-2 inline h-4 w-4" /> Compose announcement</button><div className="mt-5 space-y-3">{['Results for Second Term are ready', 'New Mathematics assignment posted', 'School assembly starts at 8:00 AM'].map((item) => <div key={item} className="rounded-xl bg-slate-50 p-4 font-semibold">{item}</div>)}</div></SimplePanel>;
  if (section === 'Admin Panel') return <SimplePanel title="Admin panel"><p className={muted}>Students, teachers, classes and settings</p><div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b"><th className="py-3">Name</th><th>Role</th><th>Class</th><th>Status</th></tr></thead><tbody>{[['Ada Okafor', 'Student', 'SS2A', 'Active'], ['Musa Bello', 'Student', 'SS2A', 'Active'], ['Mr. Adeyemi', 'Teacher', 'Science', 'Active']].map((row) => <tr key={row[0]} className="border-b"><td className="py-4 font-semibold">{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td><td className="text-emerald-700">{row[3]}</td></tr>)}</tbody></table></div></SimplePanel>;
  if (section === 'Settings') return <SimplePanel title="Settings"><div className="space-y-3">{['Dark mode', 'Two-factor authentication', 'Email notifications'].map((item) => <div key={item} className="flex justify-between rounded-xl bg-slate-50 p-4"><span>{item}</span><span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">On</span></div>)}</div></SimplePanel>;
  return <SimplePanel title="Help Center"><div className="space-y-2">{['How do I submit an assignment?', 'How can I pay school fees?', 'Where can I find my report card?', 'How do teachers publish an exam?'].map((question) => <details key={question} className="rounded-xl bg-slate-50 p-4"><summary className="cursor-pointer font-semibold">{question}</summary><p className="mt-3 text-sm text-slate-500">Open a support ticket or contact the school office for help.</p></details>)}</div></SimplePanel>;
}
