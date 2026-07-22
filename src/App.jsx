import React, { useState } from 'react';
import { BookOpen, Menu, X, Home, Settings, LogOut, BarChart3, Clock, CheckCircle, Lightbulb } from 'lucide-react';
import './App.css';

export default function ExamPrepApp() {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [user, setUser] = useState(null);
  const [currentSubject, setCurrentSubject] = useState('Mathematics');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isPremium, setIsPremium] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedExamSubject, setSelectedExamSubject] = useState('Mathematics');
  const [savedExams, setSavedExams] = useState([]);

  const QUESTIONS_DB = {
    'Mathematics': [
      {
        id: 'math1',
        question: 'If 2x + 3 = 11, find the value of x',
        options: ['2', '3', '4', '5'],
        answer: 2,
        explanation: 'Solving: 2x + 3 = 11, subtract 3 from both sides: 2x = 8, divide by 2: x = 4',
        free: true
      },
      {
        id: 'math2',
        question: 'What is 15% of 200?',
        options: ['20', '25', '30', '35'],
        answer: 2,
        explanation: '15% of 200 = (15/100) × 200 = 0.15 × 200 = 30',
        free: true
      },
      {
        id: 'math3',
        question: 'Simplify: 3(2x - 4) + 2(x + 3)',
        options: ['8x - 6', '8x - 18', '6x - 6', '8x + 6'],
        answer: 0,
        explanation: '3(2x - 4) + 2(x + 3) = 6x - 12 + 2x + 6 = 8x - 6',
        free: true
      },
      {
        id: 'math4',
        question: 'If y = 2x + 1, what is y when x = 3?',
        options: ['5', '6', '7', '8'],
        answer: 2,
        explanation: 'Substitute x = 3 into y = 2x + 1: y = 2(3) + 1 = 6 + 1 = 7',
        free: true
      },
      {
        id: 'math5',
        question: 'What is the value of √144?',
        options: ['10', '11', '12', '13'],
        answer: 2,
        explanation: 'The square root of 144 is 12, since 12 × 12 = 144',
        free: true
      },
      {
        id: 'math6',
        question: 'Find the area of a rectangle with length 8cm and width 5cm',
        options: ['13 cm²', '26 cm²', '40 cm²', '80 cm²'],
        answer: 2,
        explanation: 'Area of rectangle = length × width = 8 × 5 = 40 cm²',
        free: false
      },
      {
        id: 'math7',
        question: 'If a:b = 2:3 and b:c = 4:5, find a:c',
        options: ['8:15', '2:5', '6:20', '8:12'],
        answer: 0,
        explanation: 'a:b = 2:3 and b:c = 4:5. Result: a:c = 8:15',
        free: false
      },
      {
        id: 'math8',
        question: 'Solve for x: x/4 = 3',
        options: ['7', '12', '9', '16'],
        answer: 1,
        explanation: 'Multiply both sides by 4: x = 3 × 4 = 12',
        free: false
      },
      {
        id: 'math9',
        question: 'What is the sum of the angles in a triangle?',
        options: ['90°', '180°', '270°', '360°'],
        answer: 1,
        explanation: 'The sum of all interior angles in any triangle is always 180°',
        free: false
      },
      {
        id: 'math10',
        question: 'If 5x - 2 = 18, find x',
        options: ['2', '3', '4', '5'],
        answer: 2,
        explanation: '5x - 2 = 18, add 2: 5x = 20, divide by 5: x = 4',
        free: false
      }
    ],
    'English Language': [
      {
        id: 'eng1',
        question: 'Choose the opposite of: LENIENT',
        options: ['Strict', 'Friendly', 'Kind', 'Gentle'],
        answer: 0,
        explanation: 'Lenient means permissive. The opposite is strict.',
        free: true
      },
      {
        id: 'eng2',
        question: 'In "The committee has submitted ITS report", ITS shows:',
        options: ['Possession', 'Plurality', 'Action', 'Time'],
        answer: 0,
        explanation: 'ITS is a possessive pronoun.',
        free: true
      },
      {
        id: 'eng3',
        question: 'She is _____ intelligent than her sister.',
        options: ['more', 'most', 'very', 'much'],
        answer: 0,
        explanation: 'Use "more" when comparing two things.',
        free: true
      },
      {
        id: 'eng4',
        question: 'The RUNNING water was crystal clear. RUNNING is:',
        options: ['Noun', 'Verb', 'Adjective', 'Adverb'],
        answer: 2,
        explanation: '"Running" modifies "water" and functions as an adjective.',
        free: true
      },
      {
        id: 'eng5',
        question: 'Choose the word similar to DILIGENT:',
        options: ['Lazy', 'Hardworking', 'Careless', 'Slow'],
        answer: 1,
        explanation: 'Diligent means hardworking and careful.',
        free: true
      },
      {
        id: 'eng6',
        question: 'The plural form of "crisis" is:',
        options: ['Crisises', 'Crises', 'Crisis', 'Crisii'],
        answer: 1,
        explanation: 'Crisis becomes Crises in plural.',
        free: false
      },
      {
        id: 'eng7',
        question: 'Choose the correct punctuation: "Where is my book" asked John',
        options: ['"Where is my book?" asked John.', 'Where is my book? asked John', '"Where is my book", asked John', 'Where is my book, asked John?'],
        answer: 0,
        explanation: 'Direct speech needs quotation marks and period at end.',
        free: false
      },
      {
        id: 'eng8',
        question: 'Identify: "The classroom was a zoo."',
        options: ['Simile', 'Metaphor', 'Personification', 'Hyperbole'],
        answer: 1,
        explanation: 'A metaphor directly compares without "like" or "as".',
        free: false
      },
      {
        id: 'eng9',
        question: 'The passive form of "She writes a letter" is:',
        options: ['A letter is written by her', 'A letter was written by her', 'A letter is being written by her', 'A letter has been written by her'],
        answer: 0,
        explanation: 'Present tense passive: is/are + past participle.',
        free: false
      },
      {
        id: 'eng10',
        question: 'Choose the correct spelling:',
        options: ['Occassion', 'Ocassion', 'Occasion', 'Ocasion'],
        answer: 2,
        explanation: 'Occasion with two "c"s and one "s".',
        free: false
      }
    ],
    'Physics': [
      {
        id: 'phys1',
        question: 'What is the SI unit of force?',
        options: ['Kilogram', 'Newton', 'Joule', 'Watt'],
        answer: 1,
        explanation: 'The SI unit of force is Newton (N).',
        free: true
      },
      {
        id: 'phys2',
        question: 'Speed of light in vacuum is:',
        options: ['3 × 10⁶ m/s', '3 × 10⁷ m/s', '3 × 10⁸ m/s', '3 × 10⁹ m/s'],
        answer: 2,
        explanation: 'Speed of light is approximately 3 × 10⁸ m/s.',
        free: true
      },
      {
        id: 'phys3',
        question: 'Which is a vector quantity?',
        options: ['Mass', 'Speed', 'Velocity', 'Energy'],
        answer: 2,
        explanation: 'Velocity has both magnitude and direction.',
        free: true
      },
      {
        id: 'phys4',
        question: 'Acceleration due to gravity is:',
        options: ['8.8 m/s²', '9.8 m/s²', '10.8 m/s²', '11.8 m/s²'],
        answer: 1,
        explanation: 'Acceleration due to gravity is approximately 9.8 m/s².',
        free: true
      },
      {
        id: 'phys5',
        question: 'Ohm\'s Law states:',
        options: ['V = I/R', 'V = IR', 'R = VI', 'I = V/R²'],
        answer: 1,
        explanation: 'Ohm\'s Law: V = IR.',
        free: true
      },
      {
        id: 'phys6',
        question: 'Best conductor of electricity:',
        options: ['Copper', 'Silver', 'Gold', 'Aluminum'],
        answer: 1,
        explanation: 'Silver is the best electrical conductor.',
        free: false
      },
      {
        id: 'phys7',
        question: 'Wavelength of visible light:',
        options: ['100-400 nm', '400-700 nm', '700-1000 nm', '1000-3000 nm'],
        answer: 1,
        explanation: 'Visible light: 400-700 nanometers.',
        free: false
      },
      {
        id: 'phys8',
        question: 'Define pressure:',
        options: ['Force per unit area', 'Force per unit time', 'Power per unit area', 'Energy per unit time'],
        answer: 0,
        explanation: 'Pressure = Force / Area.',
        free: false
      },
      {
        id: 'phys9',
        question: 'SI unit of power:',
        options: ['Joule', 'Watt', 'Newton', 'Hertz'],
        answer: 1,
        explanation: 'The SI unit of power is Watt (W).',
        free: false
      },
      {
        id: 'phys10',
        question: 'Newton\'s Third Law:',
        options: ['First Law', 'Second Law', 'Third Law', 'Fourth Law'],
        answer: 2,
        explanation: 'Action and reaction are equal and opposite.',
        free: false
      }
    ],
    'Chemistry': [
      {
        id: 'chem1',
        question: 'Atomic number of Carbon:',
        options: ['4', '6', '8', '12'],
        answer: 1,
        explanation: 'Carbon has atomic number 6.',
        free: true
      },
      {
        id: 'chem2',
        question: 'Gas required for combustion:',
        options: ['Nitrogen', 'Oxygen', 'Hydrogen', 'Carbon dioxide'],
        answer: 1,
        explanation: 'Oxygen is needed for combustion.',
        free: true
      },
      {
        id: 'chem3',
        question: 'pH of neutral solution:',
        options: ['7', '0', '14', '1'],
        answer: 0,
        explanation: 'Neutral solution has pH 7.',
        free: true
      },
      {
        id: 'chem4',
        question: 'Chemical formula for table salt:',
        options: ['KCl', 'NaCl', 'CaCl₂', 'MgCl₂'],
        answer: 1,
        explanation: 'Table salt is NaCl.',
        free: true
      },
      {
        id: 'chem5',
        question: 'Define valency:',
        options: ['Number of neutrons', 'Number of electrons lost or gained', 'Number of protons', 'Atomic mass'],
        answer: 1,
        explanation: 'Valency is electrons lost, gained, or shared.',
        free: true
      },
      {
        id: 'chem6',
        question: 'Which is a non-metal:',
        options: ['Iron', 'Copper', 'Chlorine', 'Silver'],
        answer: 2,
        explanation: 'Chlorine is a non-metal.',
        free: false
      },
      {
        id: 'chem7',
        question: 'Formula for sulfuric acid:',
        options: ['H₂SO₃', 'H₂SO₄', 'HSO₄', 'H₃SO₄'],
        answer: 1,
        explanation: 'Sulfuric acid is H₂SO₄.',
        free: false
      },
      {
        id: 'chem8',
        question: 'Removing salt from seawater is called:',
        options: ['Crystallization', 'Desalination', 'Evaporation', 'Condensation'],
        answer: 1,
        explanation: 'Desalination removes dissolved salts.',
        free: false
      },
      {
        id: 'chem9',
        question: 'Atomic mass of Oxygen:',
        options: ['8', '16', '24', '32'],
        answer: 1,
        explanation: 'Oxygen has atomic mass 16.',
        free: false
      },
      {
        id: 'chem10',
        question: 'Most abundant element in atmosphere:',
        options: ['Oxygen', 'Nitrogen', 'Hydrogen', 'Carbon dioxide'],
        answer: 1,
        explanation: 'Nitrogen is 78% of atmosphere.',
        free: false
      }
    ],
    'Biology': [
      {
        id: 'bio1',
        question: 'Basic unit of life:',
        options: ['Atom', 'Molecule', 'Cell', 'Tissue'],
        answer: 2,
        explanation: 'The cell is the basic unit of life.',
        free: true
      },
      {
        id: 'bio2',
        question: 'Organelle for energy production:',
        options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi apparatus'],
        answer: 1,
        explanation: 'Mitochondria is the powerhouse of the cell.',
        free: true
      },
      {
        id: 'bio3',
        question: 'What is photosynthesis:',
        options: ['Breakdown of glucose', 'Production of glucose from light', 'Absorption of light', 'Release of oxygen'],
        answer: 1,
        explanation: 'Photosynthesis produces glucose from light.',
        free: true
      },
      {
        id: 'bio4',
        question: 'Chromosomes in human cell:',
        options: ['23', '46', '92', '48'],
        answer: 1,
        explanation: 'Humans have 46 chromosomes (23 pairs).',
        free: true
      },
      {
        id: 'bio5',
        question: 'Function of enzymes:',
        options: ['Store energy', 'Speed up reactions', 'Transport nutrients', 'Provide structure'],
        answer: 1,
        explanation: 'Enzymes speed up biochemical reactions.',
        free: true
      },
      {
        id: 'bio6',
        question: 'Blood cell type fights infections:',
        options: ['Red blood cells', 'White blood cells', 'Platelets', 'Plasma cells'],
        answer: 1,
        explanation: 'White blood cells fight infections.',
        free: false
      },
      {
        id: 'bio7',
        question: 'Cell division producing identical cells:',
        options: ['Meiosis', 'Mitosis', 'Fusion', 'Fission'],
        answer: 1,
        explanation: 'Mitosis produces identical daughter cells.',
        free: false
      },
      {
        id: 'bio8',
        question: 'Where is insulin produced:',
        options: ['Liver', 'Pancreas', 'Thyroid', 'Kidney'],
        answer: 1,
        explanation: 'Insulin is produced in the pancreas.',
        free: false
      },
      {
        id: 'bio9',
        question: 'Main function of kidney:',
        options: ['Digestion', 'Excretion', 'Respiration', 'Circulation'],
        answer: 1,
        explanation: 'Kidneys filter waste and produce urine.',
        free: false
      },
      {
        id: 'bio10',
        question: 'Gas plants absorb for photosynthesis:',
        options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'],
        answer: 2,
        explanation: 'Plants absorb carbon dioxide.',
        free: false
      }
    ]
  };

  const subjects = Object.keys(QUESTIONS_DB);

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
        const questionRegex = /(\d+)\.\s*(.+?)(?=(?:\d+\.|$))/gs;
        const questions = [];
        let match;

        while ((match = questionRegex.exec(content)) !== null) {
          const questionNum = match[1];
          const questionContent = match[2].trim();
          const lines = questionContent.split('\n').filter(l => l.trim());
          
          if (lines.length < 2) continue;

          const questionText = lines[0];
          const options = [];
          let answerLine = '';

          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.toLowerCase().startsWith('answer:')) {
              answerLine = line;
            } else if (/^[A-D]\./.test(line)) {
              const optionMatch = line.match(/^([A-D])\.\s*(.+)/);
              if (optionMatch) {
                options.push({
                  letter: optionMatch[1],
                  text: optionMatch[2].trim()
                });
              }
            }
          }

          let correctAnswer = '';
          const answerMatch = answerLine.match(/Answer:\s*([A-D])/i);
          if (answerMatch) {
            correctAnswer = answerMatch[1];
          }

          if (questionText && options.length > 0) {
            questions.push({
              number: questionNum,
              text: questionText,
              options: options,
              answer: correctAnswer
            });
          }
        }

        if (questions.length === 0) {
          setSummary('❌ No questions found. Use format:\n1. Question?\nA. Option\nAnswer: A');
          setIsLoading(false);
          return;
        }

        let formattedOutput = `✅ QUESTIONS EXTRACTED\n`;
        formattedOutput += `📄 File: ${file.name}\n`;
        formattedOutput += `📊 Total Questions: ${questions.length}\n`;
        formattedOutput += `${'='.repeat(60)}\n\n`;

        questions.forEach((q) => {
          formattedOutput += `${q.number}. ${q.text}\n`;
          q.options.forEach((opt) => {
            const isCorrect = opt.letter === q.answer;
            const marker = isCorrect ? '✓' : ' ';
            formattedOutput += `${opt.letter}. ${opt.text} ${marker}\n`;
          });
          formattedOutput += `📍 Answer: ${q.answer}\n\n`;
        });

        setSummary(formattedOutput);
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 via-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <BookOpen className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800">ExamPrep NG</h1>
            <p className="text-gray-600 mt-2">Master JAMB Exams Easily</p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
            />
            <button
              onClick={() => {
                if (name.trim()) {
                  setUser({ name });
                  setCurrentScreen('dashboard');
                }
              }}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
            >
              Get Started
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">Free access to practice questions</p>
        </div>
      </div>
    );
  };

  const DashboardScreen = () => {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BookOpen className="w-8 h-8 text-green-600 mr-2" />
                <h1 className="text-xl font-bold">ExamPrep NG</h1>
              </div>
              <button onClick={() => setShowMenu(!showMenu)} className="md:hidden">
                {showMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="hidden md:flex items-center gap-4">
                <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
                <button
                  onClick={() => setCurrentScreen('upload')}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  📤 Upload
                </button>
                {!isPremium && (
                  <button
                    onClick={() => setCurrentScreen('payment')}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
                  >
                    💎 Premium
                  </button>
                )}
                <button
                  onClick={() => {
                    setUser(null);
                    setCurrentScreen('landing');
                  }}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
            {showMenu && (
              <div className="md:hidden mt-4 pb-4 space-y-2">
                <button
                  onClick={() => { setCurrentScreen('upload'); setShowMenu(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
                >
                  📤 Upload & Extract
                </button>
                {!isPremium && (
                  <button
                    onClick={() => { setCurrentScreen('payment'); setShowMenu(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
                  >
                    💎 Premium
                  </button>
                )}
                <button
                  onClick={() => { setUser(null); setCurrentScreen('landing'); setShowMenu(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 rounded-lg text-red-600"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold mb-8">Choose Study Mode:</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setCurrentScreen('practice')}
              className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl font-bold hover:shadow-lg transition hover:scale-105"
            >
              📚 Practice Mode
            </button>
            <button
              onClick={() => setCurrentScreen('selectSubject')}
              className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-xl font-bold hover:shadow-lg transition hover:scale-105"
            >
              ⏱️ Exam Mode
            </button>
            <button
              onClick={() => setCurrentScreen('upload')}
              className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl font-bold hover:shadow-lg transition hover:scale-105"
            >
              📤 Upload & Extract
            </button>
          </div>

          {savedExams.length > 0 && (
            <div className="mt-8">
              <button
                onClick={() => setCurrentScreen('savedList')}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
              >
                📁 View Saved Exams ({savedExams.length})
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const SubjectSelectionScreen = () => {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <button
            onClick={() => setCurrentScreen('dashboard')}
            className="mb-6 px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            ← Back
          </button>

          <h2 className="text-3xl font-bold mb-8">Select Subject for Exam:</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition hover:scale-105 text-center"
              >
                <div className="text-3xl mb-3">
                  {subject === 'Mathematics' && '📐'}
                  {subject === 'English Language' && '📖'}
                  {subject === 'Physics' && '⚛️'}
                  {subject === 'Chemistry' && '🧪'}
                  {subject === 'Biology' && '🧬'}
                </div>
                <h3 className="font-bold text-lg text-gray-800">{subject}</h3>
                <p className="text-sm text-gray-600 mt-2">{QUESTIONS_DB[subject].length} Questions</p>
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
      const correctCount = questions.filter(q => userAnswers[q.id] === q.answer).length;
      const percentage = Math.round((correctCount / questions.length) * 100);

      const handleSaveExam = () => {
        const examData = {
          id: Date.now(),
          subject: selectedExamSubject,
          date: new Date().toLocaleDateString(),
          score: correctCount,
          total: questions.length,
          percentage: percentage,
          answers: userAnswers,
          timestamp: new Date().toLocaleString()
        };

        setSavedExams([...savedExams, examData]);
        alert('✅ Exam saved successfully!');
      };

      return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6 text-center">
              <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Exam Completed!</h2>

              <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-8 text-white mb-6">
                <div className="text-5xl font-bold mb-2">{percentage}%</div>
                <p className="text-xl">{correctCount} out of {questions.length} correct</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleSaveExam}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
                >
                  💾 Save This Exam
                </button>
                <button
                  onClick={() => {
                    setCurrentQuestionIndex(0);
                    setUserAnswers({});
                    setCurrentScreen('selectSubject');
                  }}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition"
                >
                  📚 Retake Another Exam
                </button>
                <button
                  onClick={() => {
                    setCurrentQuestionIndex(0);
                    setUserAnswers({});
                    setCurrentScreen('dashboard');
                  }}
                  className="w-full bg-gray-600 text-white py-3 rounded-lg font-bold hover:bg-gray-700 transition"
                >
                  ← Back to Dashboard
                </button>
              </div>
            </div>

            {savedExams.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold mb-6">📁 Your Saved Exams ({savedExams.length})</h3>
                <div className="space-y-3">
                  {savedExams.map((exam) => (
                    <div key={exam.id} className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-gray-800">{exam.subject}</p>
                          <p className="text-sm text-gray-600">{exam.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">{exam.percentage}%</p>
                          <p className="text-sm text-gray-600">{exam.score}/{exam.total}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setCurrentScreen('dashboard')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              ← Back
            </button>
            <div className="text-center">
              <h3 className="font-bold text-gray-700">{currentSubject}</h3>
              <p className="text-sm text-gray-600">Question {currentQuestionIndex + 1} of {questions.length}</p>
            </div>
            <div></div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h3 className="text-lg font-semibold mb-6 text-gray-800">{currentQuestion.question}</h3>

            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option, idx) => {
                const isCorrect = idx === currentQuestion.answer;
                const isSelected = userAnswer === idx;
                let bgColor = 'bg-gray-50 border-gray-200 hover:bg-gray-100';

                if (isAnswered) {
                  if (isCorrect) {
                    bgColor = 'bg-green-100 border-green-500';
                  } else if (isSelected && !isCorrect) {
                    bgColor = 'bg-red-100 border-red-500';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => !isAnswered && setUserAnswers({ ...userAnswers, [currentQuestion.id]: idx })}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 border-2 rounded-lg transition ${bgColor}`}
                  >
                    <span className="font-bold mr-3">{String.fromCharCode(65 + idx)}.</span>
                    {option}
                    {isAnswered && isCorrect && <CheckCircle className="w-5 h-5 text-green-600 float-right mt-1" />}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <p className="font-semibold text-blue-900">Explanation:</p>
                <p className="text-blue-800 mt-2">{currentQuestion.explanation}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg"
              >
                {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const UploadSummarizeScreen = () => {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">📤 Upload & Extract</h1>
              <button
                onClick={() => setCurrentScreen('dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Home className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold mb-2">📝 Extract Questions & Answers</h2>
            <p className="text-gray-600 mb-2">Upload a text file with questions and answers.</p>
            <p className="text-sm text-gray-500 mb-6">Format: 1. Question? A. Option Answer: A</p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
              <p className="font-semibold text-blue-900 mb-2">📋 Format Example:</p>
              <pre className="text-xs text-blue-800 font-mono">
{`1. What is 2+2?
A. 3
B. 4
C. 5
D. 6
Answer: B`}
              </pre>
            </div>

            <div className="border-2 border-dashed border-blue-400 rounded-lg p-12 text-center bg-blue-50">
              <label className="cursor-pointer block">
                <div className="text-5xl mb-4">📁</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Click to upload</h3>
                <p className="text-sm text-gray-600">Text files only (Max 5MB)</p>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".txt"
                  className="hidden"
                  disabled={isLoading}
                />
              </label>
            </div>

            {uploadedFile && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">✓ File: <span className="font-semibold">{uploadedFile.name}</span></p>
              </div>
            )}
          </div>

          {isLoading && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4 mx-auto"></div>
              <p className="text-gray-600 font-semibold">Extracting questions...</p>
            </div>
          )}

          {summary && !isLoading && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">✅ Extracted Questions</h2>
                <button
                  onClick={() => { setSummary(''); setUploadedFile(null); }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Upload Another
                </button>
              </div>
              <div className="bg-gradient-to-b from-green-50 to-gray-50 rounded-lg p-6 whitespace-pre-wrap text-gray-800 text-sm max-h-[700px] overflow-y-auto border-2 border-green-200 font-mono">
                {summary}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const SavedListScreen = () => {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setCurrentScreen('dashboard')}
            className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            ← Back
          </button>

          <h2 className="text-3xl font-bold mb-8">📁 Your Saved Exams</h2>

          {savedExams.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <p className="text-xl text-gray-600 mb-4">No saved exams yet</p>
              <button
                onClick={() => setCurrentScreen('selectSubject')}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
              >
                Take an Exam
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...savedExams].reverse().map((exam) => (
                <div key={exam.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                  <h3 className="text-xl font-bold text-gray-800">{exam.subject}</h3>
                  <p className="text-sm text-gray-500 mb-4">{exam.timestamp}</p>
                  <div className="text-3xl font-bold text-green-600 mb-2">{exam.percentage}%</div>
                  <p className="font-semibold text-gray-800">Score: {exam.score}/{exam.total}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const PaymentScreen = () => {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">💎 Premium Plans</h2>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <p className="text-gray-600 mb-6">Upgrade for unlimited access</p>
            <button
              onClick={() => {
                setIsPremium(true);
                setCurrentScreen('dashboard');
              }}
              className="px-6 py-2 bg-yellow-500 text-white rounded-lg font-bold hover:bg-yellow-600"
            >
              Upgrade - ₦2,500/month
            </button>
            <button
              onClick={() => setCurrentScreen('dashboard')}
              className="ml-4 px-6 py-2 bg-gray-300 text-gray-700 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!user) {
    return <LandingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {currentScreen === 'dashboard' && <DashboardScreen />}
      {currentScreen === 'practice' && <PracticeScreen />}
      {currentScreen === 'upload' && <UploadSummarizeScreen />}
      {currentScreen === 'selectSubject' && <SubjectSelectionScreen />}
      {currentScreen === 'savedList' && <SavedListScreen />}
      {currentScreen === 'payment' && <PaymentScreen />}
    </div>
  );
}