import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Lock, 
  Key, 
  Castle, 
  Map, 
  Lightbulb, 
  Zap, 
  Trophy, 
  RotateCcw,
  Check
} from 'lucide-react';
import Snow from './components/Snow';
import Star, { ItemVariant } from './components/Star';
import { generateGameData, randomInt } from './utils/mathUtils';
import { GameState, Problem, StarData } from './types';

const PROBLEMS_PER_LEVEL = 8;

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [score, setScore] = useState(0);
  
  // Game Data State
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [stars, setStars] = useState<StarData[]>([]);
  
  // Gate Puzzle State (3 separate codes)
  const [gateProblems, setGateProblems] = useState<Problem[]>([]);
  const [gateInputs, setGateInputs] = useState<string[]>(["", "", ""]);
  const [activeGateInput, setActiveGateInput] = useState<number>(0);
  
  // UI State
  const [message, setMessage] = useState<string>('');
  const [feedbackColor, setFeedbackColor] = useState<string>('text-white');

  const currentProblem = problems[currentProblemIndex];

  // --- Helpers ---

  const initStarsLevel = (type: 'MULT_DIV' | 'ADD_SUB' | 'UNITS', nextState: GameState) => {
    const { problems: newProblems, stars: newStars } = generateGameData(PROBLEMS_PER_LEVEL, type);
    setProblems(newProblems);
    setStars(newStars);
    setCurrentProblemIndex(0);
    setGameState(nextState);
    setMessage('Najdi správnou odpověď!');
    setFeedbackColor('text-white');
  };

  const initGateLevel = () => {
    // 3 Simple problems. We ensure they are very clean for 4th graders.
    const problems: Problem[] = [];

    // 1. Simple multiplication
    const a1 = randomInt(2, 5);
    const b1 = randomInt(2, 5);
    problems.push({ display: `${a1} · ${b1}`, result: a1 * b1 });

    // 2. Simple multiplication
    const a2 = randomInt(3, 4);
    const b2 = randomInt(3, 5);
    problems.push({ display: `${a2} · ${b2}`, result: a2 * b2 });

    // 3. Simple division (ensure integer result)
    // We pick the answer (2-9) and multiply by 2 or 3 to get dividend.
    const result3 = randomInt(2, 9);
    const divisor3 = 2; 
    problems.push({ display: `${result3 * divisor3} : ${divisor3}`, result: result3 });

    setGateProblems(problems);
    setGateInputs(["", "", ""]);
    setActiveGateInput(0);
    setGameState('level_1_gate');
  };

  // --- Logic to determine visual variant ---
  const getCurrentVariant = (): ItemVariant => {
    if (gameState === 'level_3_add') return 'fuel';
    if (gameState === 'level_4_units') return 'gift';
    return 'star';
  };

  // --- Actions ---

  const handleGateNumpad = (num: number) => {
    setGateInputs(prev => {
      const newInputs = [...prev];
      // Limit to 2 digits per box just in case
      if (newInputs[activeGateInput].length < 2) {
        newInputs[activeGateInput] = newInputs[activeGateInput] + num;
      }
      return newInputs;
    });
  };

  const handleGateClear = () => {
    setGateInputs(prev => {
      const newInputs = [...prev];
      newInputs[activeGateInput] = "";
      return newInputs;
    });
  };

  const handleGateUnlock = () => {
    // Check all inputs
    const isCorrect0 = parseInt(gateInputs[0]) === gateProblems[0].result;
    const isCorrect1 = parseInt(gateInputs[1]) === gateProblems[1].result;
    const isCorrect2 = parseInt(gateInputs[2]) === gateProblems[2].result;

    if (isCorrect0 && isCorrect1 && isCorrect2) {
      setGameState('story_2');
    } else {
      alert("Některý výsledek není správně. Zkontroluj to!");
    }
  };

  const handleStarClick = (star: StarData) => {
    if (!currentProblem) return;

    if (star.value === currentProblem.result) {
      // Correct
      setScore((prev) => prev + 1);
      setMessage('Výborně! Správná odpověď!');
      setFeedbackColor('text-green-400');
      setStars((prev) => prev.filter((s) => s.id !== star.id));

      if (currentProblemIndex + 1 >= problems.length) {
        // Level Completed logic
        setTimeout(() => {
           if (gameState === 'level_2_mult') setGameState('story_3');
           else if (gameState === 'level_3_add') setGameState('story_4');
           else if (gameState === 'level_4_units') setGameState('victory');
        }, 1000);
      } else {
        // Next problem
        setTimeout(() => {
          setCurrentProblemIndex((prev) => prev + 1);
          setMessage('Další příklad...');
          setFeedbackColor('text-white');
        }, 500);
      }
    } else {
      // Wrong
      setMessage('To není správně, zkus znovu!');
      setFeedbackColor('text-red-400');
    }
  };

  const restartGame = () => {
    setScore(0);
    setGameState('intro');
  };

  // --- RENDERERS ---

  const renderStoryScreen = (
    icon: React.ReactNode, 
    title: string, 
    text: React.ReactNode, 
    btnText: string, 
    action: () => void,
    bgColorClass: string = "bg-slate-900"
  ) => (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 animate-fade-in">
      <div className={`max-w-3xl w-full ${bgColorClass} border-4 border-slate-600 rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col items-center text-center`}>
        <div className="mb-6 text-yellow-400 animate-bounce drop-shadow-lg filter">
          {icon}
        </div>
        <h2 className="text-3xl md:text-5xl font-christmas text-yellow-400 mb-6 drop-shadow-md">{title}</h2>
        <div className="text-lg md:text-xl text-slate-200 mb-10 font-sans leading-relaxed space-y-4">
          {text}
        </div>
        <button 
          onClick={action}
          className="group relative inline-flex items-center px-8 py-4 bg-red-600 overflow-hidden rounded-full font-bold text-xl text-white shadow-lg hover:bg-red-500 transition-all hover:scale-105 active:scale-95"
        >
          <span className="relative flex items-center gap-3">
             {btnText} <ArrowRight />
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white select-none">
      <Snow />
      
      {/* --- HUD (Only Playing Star Levels) --- */}
      {(gameState.startsWith('level_') && gameState !== 'level_1_gate') && (
        <div className="absolute top-0 left-0 right-0 p-4 z-20 flex flex-col md:flex-row gap-4 justify-between items-center max-w-6xl mx-auto pointer-events-none">
          <div className="bg-slate-800/90 backdrop-blur px-6 py-2 rounded-full border border-slate-600 shadow-lg">
            <span className="font-christmas text-2xl text-yellow-300">Zbývá: {stars.length}</span>
          </div>
          
          <div className={`bg-slate-900/90 px-12 py-4 rounded-2xl border-2 border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.3)] transform transition-all duration-300 ${feedbackColor === 'text-red-400' ? 'shake' : ''}`}>
             <div className={`text-5xl md:text-6xl font-christmas font-bold tracking-wider ${feedbackColor}`}>
               {currentProblem ? currentProblem.display : 'Hotovo!'}
             </div>
          </div>

          <div className="bg-slate-800/90 backdrop-blur px-6 py-2 rounded-full border border-slate-600 shadow-lg">
            <span className="font-christmas text-2xl text-green-300">Celkové Skóre: {score}</span>
          </div>
        </div>
      )}

      {/* --- Game Area (Stars/Fuel/Gifts) --- */}
      {(gameState.startsWith('level_') && gameState !== 'level_1_gate') && (
        <div className="absolute inset-0 z-10">
          {stars.map((star) => (
            <Star 
              key={star.id} 
              data={star} 
              onClick={handleStarClick} 
              variant={getCurrentVariant()}
            />
          ))}
          <div className={`absolute left-0 right-0 text-center pointer-events-none px-4 transition-all duration-500
             ${getCurrentVariant() === 'gift' ? 'top-24' : 'bottom-12'} 
          `}>
            {/* If it's the gift level, move message to top so it's not covered by the pile */}
            <p className={`text-2xl font-bold ${feedbackColor} animate-pulse drop-shadow-md bg-slate-900/50 inline-block px-4 py-2 rounded-xl`}>
              {message}
            </p>
          </div>
        </div>
      )}

      {/* --- SCREENS --- */}

      {/* 1. INTRO */}
      {gameState === 'intro' && renderStoryScreen(
        <Castle size={96} />,
        "Vánoční Záchrana",
        <>
          <p>Vítej v Severním pólu! Jsi připraven stát se Santovým hlavním počtářem?</p>
          <p>Čekají tě 4 důležité zkoušky. Musíš prokázat, že umíš skvěle počítat, aby Vánoce proběhly hladce.</p>
          <p className="text-sm text-slate-400">Příběhová hra pro 4. ročník</p>
        </>,
        "Začít dobrodružství",
        () => setGameState('story_1')
      )}

      {/* 2. STORY 1 -> GATE */}
      {gameState === 'story_1' && renderStoryScreen(
        <Map size={96} />,
        "Ztraceni v mlze",
        <>
          <p>Je Štědrý den, ale na les padla hustá magická mlha. Sobi nevidí na krok a nemohou vzlétnout!</p>
          <p>Před námi je <strong>Starodávná Brána</strong>, která vede nad mraky. Je ale zamčená třemi zámky.</p>
          <p className="text-yellow-300">Elfové našli na kamenech příklady. Vyřeš je všechny, abys bránu odemkl.</p>
        </>,
        "Jít k bráně",
        initGateLevel
      )}

      {/* 3. LEVEL 1: GATE PUZZLE */}
      {gameState === 'level_1_gate' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/90 backdrop-blur-xl px-4">
           <div className="max-w-4xl w-full bg-slate-900 border-2 border-yellow-700 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] p-6 md:p-8 flex flex-col items-center">
              <div className="mb-4 text-yellow-500"><Lock size={64} /></div>
              <h2 className="text-2xl md:text-3xl font-christmas text-yellow-400 mb-2">Bezpečnostní Kód</h2>
              <p className="text-slate-400 text-center mb-6">Klikni na políčko a vypočítej příklad.</p>
              
              <div className="flex flex-col md:flex-row justify-center gap-4 mb-8 w-full">
                {gateProblems.map((p, i) => (
                  <div 
                    key={i} 
                    onClick={() => setActiveGateInput(i)}
                    className={`
                      relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex-1
                      ${activeGateInput === i ? 'bg-slate-800 border-yellow-400 scale-105' : 'bg-slate-800/50 border-slate-600'}
                    `}
                  >
                    <div className="text-xs text-slate-400 uppercase tracking-widest mb-2 text-center">Zámek {i+1}</div>
                    <div className="font-bold text-2xl text-white font-christmas text-center mb-2">{p.display} = ?</div>
                    <div className="bg-black/50 h-12 rounded flex items-center justify-center text-2xl text-yellow-400 font-mono">
                      {gateInputs[i] || "_"}
                    </div>
                    {parseInt(gateInputs[i]) === p.result && (
                      <div className="absolute top-2 right-2 text-green-500"><Check size={20} /></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Numpad */}
              <div className="bg-black/40 p-4 rounded-2xl border border-slate-700 w-full max-w-sm">
                 <div className="grid grid-cols-3 gap-2">
                    {[1,2,3,4,5,6,7,8,9].map(n => (
                      <button 
                        key={n}
                        onClick={() => handleGateNumpad(n)}
                        className="bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white font-bold py-3 rounded-xl text-xl transition-colors shadow-md"
                      >
                        {n}
                      </button>
                    ))}
                    <button onClick={handleGateClear} className="bg-red-900/50 hover:bg-red-900 text-red-200 font-bold py-3 rounded-xl">C</button>
                    <button 
                      onClick={() => handleGateNumpad(0)}
                      className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl text-xl"
                    >
                      0
                    </button>
                    <button onClick={handleGateUnlock} className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                      <Key className="w-6 h-6" />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* 4. STORY 2 -> STARS MULT/DIV */}
      {gameState === 'story_2' && renderStoryScreen(
        <Lightbulb size={96} />,
        "Cesta je volná!",
        <>
          <p>Brána se s vrzáním otevřela! Ale podívej, vesnice skřítků pod námi je celá zhasnutá.</p>
          <p>Hvězdy, které mají osvětlovat cestu Santovi, vyhasly. Musíme je znovu nabít matematickou energií.</p>
          <p className="text-blue-300">Skřítci říkají, že hvězdy fungují na <strong>násobení a dělení</strong>. Rychle, klikej na správné výsledky!</p>
        </>,
        "Rozsvítit hvězdy",
        () => initStarsLevel('MULT_DIV', 'level_2_mult')
      )}

      {/* 5. STORY 3 -> STARS ADD/SUB */}
      {gameState === 'story_3' && renderStoryScreen(
        <Zap size={96} />,
        "Prázdná nádrž",
        <>
          <p>Vesnice svítí! Jsi úžasný! Santa už nasedá do sání, ale... motor nechce naskočit.</p>
          <p>Došlo kouzelné palivo. Musíme namíchat novou směs z hvězdného prachu.</p>
          <p className="text-green-300">Před tebou jsou bubliny s energií. Musíš vypočítat <strong>sčítání a odčítání</strong> a kliknout na správnou bublinu!</p>
        </>,
        "Namíchat palivo",
        () => initStarsLevel('ADD_SUB', 'level_3_add')
      )}

      {/* 6. STORY 4 -> STARS UNITS */}
      {gameState === 'story_4' && renderStoryScreen(
        <RotateCcw size={96} />, // Using Rotate as a symbol for conversion
        "Poslední kontrola",
        <>
          <p>Sáně vrčí a jsou připraveny k letu! Ale počkat! Dárky jsou rozházené na jedné velké hromadě.</p>
          <p>Některé jsou v metrech, jiné v centimetrech. Některé jsou v kilech, jiné v tunách!</p>
          <p className="text-pink-300">Podívej se dolů na hromadu dárků a najdi ten, který má správný <strong>převod jednotek</strong>.</p>
        </>,
        "Setřídit dárky",
        () => initStarsLevel('UNITS', 'level_4_units')
      )}

      {/* 7. VICTORY */}
      {gameState === 'victory' && renderStoryScreen(
        <Trophy size={96} />,
        "Vánoce jsou zachráněny!",
        <>
          <p>Dokázal jsi to! Všechny dárky jsou naložené, sáně natankované a cesta září jasnými hvězdami.</p>
          <p>Santa právě vzlétl a mává ti na rozloučenou: <em>"Ho Ho Ho! Děkuji ti, matematický hrdino!"</em></p>
          <p className="text-yellow-400 mt-4 font-bold text-2xl">Celkové skóre: {score}</p>
        </>,
        "Zahrát si znovu",
        restartGame,
        "bg-green-900/90 border-yellow-500"
      )}
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
};

export default App;