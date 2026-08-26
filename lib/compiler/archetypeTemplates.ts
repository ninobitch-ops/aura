import { ParsedPromptAST } from './lexerParser';
import { PlatformType, ThemePreset } from '@/types/aurabots';

export function generateAppCodeForArchetype(
  ast: ParsedPromptAST,
  platform: PlatformType,
  theme: ThemePreset
): string {
  switch (ast.archetype) {
    case 'fintech':
      return generateFintechApp(ast, platform);
    case 'fitness':
      return generateFitnessApp(ast, platform);
    case 'iot':
      return generateIoTApp(ast, platform);
    case 'kanban':
      return generateKanbanApp(ast, platform);
    case 'ecommerce':
      return generateEcommerceApp(ast, platform);
    case 'chat':
      return generateChatApp(ast, platform);
    case 'music_synth':
      return generateMusicSynthApp(ast, platform);
    case 'notes_wiki':
      return generateNotesApp(ast, platform);
    case 'food_delivery':
      return generateFoodDeliveryApp(ast, platform);
    case 'travel_planner':
      return generateTravelApp(ast, platform);
    default:
      return generateGeneralDashboardApp(ast, platform);
  }
}

// 1. FINTECH / CRYPTO DEFI APP
function generateFintechApp(ast: ParsedPromptAST, platform: PlatformType): string {
  return `import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, ArrowDownLeft, RefreshCw, TrendingUp, ShieldCheck, 
  Wallet, Layers, BarChart3, Clock, CheckCircle2, ChevronRight,
  Zap, Copy, ExternalLink, Settings, Bell, Flame, Activity
} from 'lucide-react';

export default function App() {
  const [balance, setBalance] = useState(48290.45);
  const [stakedAmount, setStakedAmount] = useState(12500);
  const [selectedToken, setSelectedToken] = useState('ETH');
  const [swapFrom, setSwapFrom] = useState('ETH');
  const [swapTo, setSwapTo] = useState('USDC');
  const [fromAmount, setFromAmount] = useState('1.5');
  const [activeTab, setActiveTab] = useState<'portfolio' | 'swap' | 'stake' | 'history'>('portfolio');
  const [isSwapping, setIsSwapping] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const tokens = [
    { symbol: 'ETH', name: 'Ethereum', price: 3420.50, change: '+5.4%', balance: 6.82, icon: '⟠' },
    { symbol: 'SOL', name: 'Solana', price: 184.20, change: '+12.8%', balance: 45.0, icon: '◎' },
    { symbol: 'BTC', name: 'Bitcoin', price: 67940.00, change: '+2.1%', balance: 0.24, icon: '₿' },
    { symbol: 'AURA', name: 'Aura Protocol', price: 14.85, change: '+34.2%', balance: 850.0, icon: '✦' },
    { symbol: 'USDC', name: 'USD Coin', price: 1.00, change: '0.0%', balance: 5200.0, icon: '$' },
  ];

  const transactions = [
    { id: 'tx-1', type: 'swap', desc: 'Swapped 2.0 ETH for 6,840 USDC', time: '10m ago', amount: '+6,840 USDC', status: 'completed' },
    { id: 'tx-2', type: 'stake', desc: 'Staked 45 SOL in Apex Pool', time: '2h ago', amount: '45 SOL', status: 'completed' },
    { id: 'tx-3', type: 'receive', desc: 'Received from 0x8F4...9C2', time: '1d ago', amount: '+0.5 BTC', status: 'completed' },
    { id: 'tx-4', type: 'yield', desc: 'Compounded Staking Yield', time: '2d ago', amount: '+18.4 AURA', status: 'completed' },
  ];

  const triggerBeep = (freq = 600) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {}
  };

  const handleSwap = () => {
    if (!fromAmount || isNaN(Number(fromAmount))) return;
    setIsSwapping(true);
    triggerBeep(880);
    setTimeout(() => {
      setIsSwapping(false);
      triggerBeep(1200);
      setNotification(\`Successfully swapped \${fromAmount} \${swapFrom} to \${swapTo}!\`);
      setTimeout(() => setNotification(null), 4000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 font-sans pb-16">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 font-black text-lg">
            A
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wide text-white uppercase">${ast.title}</h1>
            <div className="flex items-center space-x-1.5 text-[11px] text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Mainnet Live • 12ms Latency</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => { triggerBeep(440); setBalance(b => b + 1000); }} 
            className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition flex items-center space-x-1"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Faucet +$1k</span>
          </button>
        </div>
      </header>

      {/* Notification Banner */}
      {notification && (
        <div className="bg-emerald-500/10 border-b border-emerald-500/30 px-4 py-2 text-center text-xs text-emerald-300 flex items-center justify-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-4xl mx-auto p-4 space-y-5">
        {/* Navigation Tabs */}
        <div className="flex bg-[#0F172A] p-1 rounded-xl border border-slate-800">
          {(['portfolio', 'swap', 'stake', 'history'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => { triggerBeep(520); setActiveTab(tab); }}
              className={\`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all \${
                activeTab === tab
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }\`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TAB 1: PORTFOLIO */}
        {activeTab === 'portfolio' && (
          <div className="space-y-4">
            {/* Total Balance Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#151F38] to-[#0A1020] border border-cyan-500/30 p-6 shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Net Portfolio Value</span>
                  <div className="text-3xl font-extrabold text-white mt-1 tracking-tight">
                    \${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="inline-flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <TrendingUp className="w-3 h-3 mr-1" /> +$2,450.20 (24h)
                    </span>
                    <span className="text-xs text-slate-500">APY Yield: 14.8%</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => { triggerBeep(700); setActiveTab('swap'); }}
                    className="p-3 bg-cyan-500 hover:bg-cyan-400 text-[#090D16] font-bold rounded-xl shadow-lg transition flex flex-col items-center justify-center text-[10px]"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                  <button 
                    onClick={() => { triggerBeep(700); setActiveTab('swap'); }}
                    className="p-3 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold rounded-xl border border-slate-700 transition flex flex-col items-center justify-center text-[10px]"
                  >
                    <ArrowDownLeft className="w-4 h-4" />
                    <span>Receive</span>
                  </button>
                </div>
              </div>

              {/* Sparkline Canvas Simulation */}
              <div className="mt-6 pt-4 border-t border-slate-800/80">
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>Portfolio Performance (7D)</span>
                  <span className="text-cyan-400 font-mono">High: $49,120</span>
                </div>
                <div className="h-16 w-full flex items-end space-x-1">
                  {[40, 48, 45, 62, 58, 75, 70, 85, 82, 95, 90, 100].map((val, idx) => (
                    <div
                      key={idx}
                      style={{ height: \`\${val}%\` }}
                      className="flex-1 bg-gradient-to-t from-cyan-600/30 to-cyan-400 rounded-t-sm hover:brightness-125 transition"
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Asset List */}
            <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Your Assets</h3>
              <div className="space-y-2">
                {tokens.map(token => (
                  <div 
                    key={token.symbol}
                    onClick={() => { triggerBeep(650); setSelectedToken(token.symbol); }}
                    className={\`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer \${
                      selectedToken === token.symbol
                        ? 'bg-cyan-500/10 border-cyan-500/40 shadow-sm'
                        : 'bg-[#151F38]/40 border-slate-800 hover:border-slate-700'
                    }\`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-cyan-400 text-lg border border-slate-700">
                        {token.icon}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white flex items-center space-x-1.5">
                          <span>{token.name}</span>
                          <span className="text-xs text-slate-400 font-normal">({token.symbol})</span>
                        </div>
                        <div className="text-xs text-slate-400 font-mono">
                          {token.balance} {token.symbol}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-white font-mono">
                        \${(token.balance * token.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-xs font-semibold text-emerald-400 font-mono">
                        {token.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SWAP */}
        {activeTab === 'swap' && (
          <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Instant Cross-Chain Swap</span>
            </h3>

            {/* From Input */}
            <div className="bg-[#151F38] p-4 rounded-xl border border-slate-700">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>You Pay</span>
                <span>Balance: 6.82 ETH</span>
              </div>
              <div className="flex items-center justify-between space-x-2">
                <input 
                  type="number"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="bg-transparent text-2xl font-bold text-white focus:outline-none w-full font-mono"
                  placeholder="0.0"
                />
                <select 
                  value={swapFrom}
                  onChange={(e) => setSwapFrom(e.target.value)}
                  className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5 text-sm font-bold text-white focus:outline-none"
                >
                  <option value="ETH">ETH</option>
                  <option value="SOL">SOL</option>
                  <option value="BTC">BTC</option>
                  <option value="AURA">AURA</option>
                </select>
              </div>
            </div>

            {/* Swap Direction Toggle */}
            <div className="flex justify-center -my-2">
              <button 
                onClick={() => {
                  triggerBeep(700);
                  const temp = swapFrom;
                  setSwapFrom(swapTo);
                  setSwapTo(temp);
                }}
                className="w-9 h-9 rounded-full bg-slate-800 border border-cyan-500/40 text-cyan-400 flex items-center justify-center hover:scale-110 transition shadow-lg"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* To Output */}
            <div className="bg-[#151F38] p-4 rounded-xl border border-slate-700">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>You Receive (Estimated)</span>
                <span>Fee: ~0.001 ETH</span>
              </div>
              <div className="flex items-center justify-between space-x-2">
                <div className="text-2xl font-bold text-cyan-300 font-mono">
                  {((Number(fromAmount) || 0) * 3420.50).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <select 
                  value={swapTo}
                  onChange={(e) => setSwapTo(e.target.value)}
                  className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5 text-sm font-bold text-white focus:outline-none"
                >
                  <option value="USDC">USDC</option>
                  <option value="ETH">ETH</option>
                  <option value="SOL">SOL</option>
                  <option value="AURA">AURA</option>
                </select>
              </div>
            </div>

            <button 
              disabled={isSwapping}
              onClick={handleSwap}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 bg-[length:200%_auto] hover:bg-right transition-all duration-300 text-slate-950 font-black rounded-xl uppercase tracking-wider text-sm shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {isSwapping ? 'Routing Quantum Transaction...' : 'Execute Swap'}
            </button>
          </div>
        )}

        {/* TAB 3: STAKING */}
        {activeTab === 'stake' && (
          <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Flame className="w-4 h-4 text-purple-400" />
              <span>Aura Staking & Yield Multiplier</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-[#151F38] rounded-xl border border-slate-700">
                <span className="text-xs text-slate-400">Total Staked</span>
                <div className="text-xl font-bold text-white font-mono mt-1">\${stakedAmount.toLocaleString()}</div>
              </div>
              <div className="p-4 bg-[#151F38] rounded-xl border border-purple-500/30">
                <span className="text-xs text-purple-300">Base APY</span>
                <div className="text-xl font-bold text-purple-400 font-mono mt-1">18.42%</div>
              </div>
            </div>
            <button 
              onClick={() => {
                triggerBeep(900);
                setStakedAmount(s => s + 500);
                setNotification('Staked additional $500 in High-Yield Liquidity Pool!');
                setTimeout(() => setNotification(null), 3000);
              }}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-purple-600/30"
            >
              Deposit +$500 to Staking Pool
            </button>
          </div>
        )}

        {/* TAB 4: HISTORY */}
        {activeTab === 'history' && (
          <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">On-Chain Activity</h3>
            <div className="space-y-2">
              {transactions.map(tx => (
                <div key={tx.id} className="p-3 bg-[#151F38]/50 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-xs">
                      TX
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{tx.desc}</div>
                      <div className="text-[10px] text-slate-400">{tx.time}</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">{tx.amount}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}`;
}

// 2. FITNESS & BIOMETRICS APP
function generateFitnessApp(ast: ParsedPromptAST, platform: PlatformType): string {
  return `import React, { useState, useEffect } from 'react';
import { 
  Flame, Heart, Timer, Play, Pause, RotateCcw, Award, 
  Droplet, CheckCircle, ChevronRight, Activity, Plus, Dumbbell
} from 'lucide-react';

export default function App() {
  const [seconds, setSeconds] = useState(45);
  const [isActive, setIsActive] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const [totalSets, setTotalSets] = useState(5);
  const [heartRate, setHeartRate] = useState(142);
  const [calories, setCalories] = useState(384);
  const [waterOz, setWaterOz] = useState(48);
  const [completedWorkouts, setCompletedWorkouts] = useState([
    { name: 'Barbell Squats', sets: '4 x 10', weight: '225 lbs', done: true },
    { name: 'Incline Dumbbell Press', sets: '3 x 12', weight: '70 lbs', done: true },
    { name: 'Pull-Ups', sets: '4 x 15', weight: 'Bodyweight', done: false },
    { name: 'Romanian Deadlifts', sets: '3 x 10', weight: '185 lbs', done: false },
  ]);

  const playTone = (freq = 800) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {}
  };

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(s => s - 1);
      }, 1000);
    } else if (seconds === 0 && isActive) {
      playTone(1200);
      setIsActive(false);
      if (currentSet < totalSets) setCurrentSet(s => s + 1);
      setSeconds(45);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, currentSet, totalSets]);

  const toggleWorkout = (index: number) => {
    playTone(600);
    setCompletedWorkouts(prev => prev.map((w, idx) => idx === index ? { ...w, done: !w.done } : w));
    setCalories(c => c + 35);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 font-sans pb-16">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#0F172A]/90 backdrop-blur border-b border-slate-800 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-300 flex items-center justify-center font-bold">
            <Flame className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white uppercase tracking-wider">${ast.title}</h1>
            <span className="text-[11px] text-purple-400">HIIT Mode Active</span>
          </div>
        </div>
        <div className="flex items-center space-x-1.5 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full">
          <Heart className="w-3.5 h-3.5 text-red-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-red-400">{heartRate} BPM</span>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4">
        {/* Interval Rest Timer Dial */}
        <div className="bg-gradient-to-b from-[#0F172A] to-[#151F38] p-6 rounded-3xl border border-purple-500/30 shadow-2xl text-center space-y-3">
          <div className="text-xs uppercase font-bold text-purple-300 tracking-wider">
            Set {currentSet} of {totalSets} • Rest Interval
          </div>
          <div className="text-6xl font-black text-white font-mono tracking-tight drop-shadow-md">
            00:{seconds < 10 ? \`0\${seconds}\` : seconds}
          </div>
          <div className="flex justify-center space-x-3 pt-2">
            <button 
              onClick={() => { playTone(500); setIsActive(!isActive); }}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg flex items-center space-x-2 hover:brightness-110 transition"
            >
              {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isActive ? 'Pause' : 'Start Timer'}</span>
            </button>
            <button 
              onClick={() => { playTone(400); setIsActive(false); setSeconds(45); }}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Biometrics Summary Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-[#0F172A] rounded-2xl border border-slate-800 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400">Calories Burned</span>
              <div className="text-lg font-bold text-white font-mono">{calories} kcal</div>
            </div>
          </div>
          <div className="p-4 bg-[#0F172A] rounded-2xl border border-slate-800 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Droplet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400">Hydration</span>
              <div className="text-lg font-bold text-white font-mono">{waterOz} oz</div>
            </div>
          </div>
        </div>

        {/* Workout Routine Log */}
        <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
              <Dumbbell className="w-4 h-4 text-purple-400" />
              <span>Today's Strength Matrix</span>
            </h3>
            <button 
              onClick={() => { playTone(750); setWaterOz(w => w + 8); }}
              className="text-[11px] text-cyan-400 hover:underline flex items-center space-x-1"
            >
              <span>+8oz Water</span>
            </button>
          </div>

          <div className="space-y-2">
            {completedWorkouts.map((w, idx) => (
              <div 
                key={idx}
                onClick={() => toggleWorkout(idx)}
                className={\`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition \${
                  w.done 
                    ? 'bg-purple-950/20 border-purple-500/40 text-slate-300' 
                    : 'bg-[#151F38] border-slate-800 text-white hover:border-slate-700'
                }\`}
              >
                <div className="flex items-center space-x-3">
                  <div className={\`w-6 h-6 rounded-lg flex items-center justify-center border \${
                    w.done ? 'bg-purple-600 border-purple-400 text-white' : 'border-slate-600 bg-slate-800'
                  }\`}>
                    {w.done && <CheckCircle className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className={\`text-xs font-bold \${w.done ? 'line-through text-slate-400' : 'text-white'}\`}>
                      {w.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">{w.sets} • {w.weight}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}`;
}

// 3. SMART HOME & IOT HUB
function generateIoTApp(ast: ParsedPromptAST, platform: PlatformType): string {
  return `import React, { useState } from 'react';
import { 
  Zap, Lightbulb, Thermometer, Shield, Power, 
  Sun, Moon, Lock, Unlock, Wind, Tv, CheckCircle
} from 'lucide-react';

export default function App() {
  const [temperature, setTemperature] = useState(72);
  const [energyUsage, setEnergyUsage] = useState(2.4);
  const [securityArmed, setSecurityArmed] = useState(true);
  const [activeScene, setActiveScene] = useState<'day' | 'night' | 'away' | 'movie'>('day');
  
  const [devices, setDevices] = useState([
    { id: 1, name: 'Living Room Matrix', room: 'Living Room', active: true, icon: 'light' },
    { id: 2, name: 'Master HVAC Turbo', room: 'Bedroom', active: true, icon: 'wind' },
    { id: 3, name: 'Kitchen Ambience', room: 'Kitchen', active: false, icon: 'light' },
    { id: 4, name: 'Smart OLED Display', room: 'Living Room', active: true, icon: 'tv' },
    { id: 5, name: 'Balcony Security Beam', room: 'Outdoor', active: true, icon: 'shield' },
  ]);

  const playClick = (freq = 550) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {}
  };

  const toggleDevice = (id: number) => {
    playClick(650);
    setDevices(prev => prev.map(d => d.id === id ? { ...d, active: !d.active } : d));
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 font-sans pb-16">
      <header className="sticky top-0 z-20 bg-[#0F172A]/90 backdrop-blur border-b border-slate-800 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center font-bold">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white uppercase">${ast.title}</h1>
            <span className="text-[11px] text-emerald-400">All Systems Nominal</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400">Grid Load</span>
          <div className="text-xs font-mono font-bold text-emerald-400">{energyUsage} kW/h</div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 space-y-4">
        {/* Thermostat & Climate Dial */}
        <div className="bg-gradient-to-br from-[#0F172A] to-[#151F38] p-6 rounded-2xl border border-emerald-500/30 shadow-xl flex flex-col items-center text-center space-y-3">
          <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Climate Control Dial</span>
          <div className="text-5xl font-black text-white font-mono">{temperature}°F</div>
          <div className="text-xs text-slate-400">Humidity: 44% • Eco Mode Active</div>
          <div className="flex space-x-4 pt-2">
            <button 
              onClick={() => { playClick(400); setTemperature(t => t - 1); }}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg border border-slate-700 transition flex items-center justify-center"
            >
              -
            </button>
            <button 
              onClick={() => { playClick(600); setTemperature(t => t + 1); }}
              className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg transition flex items-center justify-center shadow-lg shadow-emerald-600/30"
            >
              +
            </button>
          </div>
        </div>

        {/* Smart Scenes */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { key: 'day', label: 'Day Mode', icon: Sun },
            { key: 'night', label: 'Night Owl', icon: Moon },
            { key: 'away', label: 'Away Guard', icon: Shield },
            { key: 'movie', label: 'Cinema', icon: Tv },
          ].map(s => {
            const Icon = s.icon;
            return (
              <button
                key={s.key}
                onClick={() => { playClick(700); setActiveScene(s.key as any); }}
                className={\`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 transition \${
                  activeScene === s.key 
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md' 
                    : 'bg-[#0F172A] border-slate-800 text-slate-400 hover:border-slate-700'
                }\`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px] font-bold">{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Device Matrix */}
        <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Connected Nodes</h3>
            <button 
              onClick={() => {
                playClick(800);
                setSecurityArmed(!securityArmed);
              }}
              className={\`px-3 py-1 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition \${
                securityArmed ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'
              }\`}
            >
              {securityArmed ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>{securityArmed ? 'Secured' : 'Disarmed'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {devices.map(device => (
              <div 
                key={device.id}
                onClick={() => toggleDevice(device.id)}
                className={\`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition \${
                  device.active 
                    ? 'bg-[#151F38] border-emerald-500/40 text-white shadow-sm' 
                    : 'bg-[#090D16]/60 border-slate-800 text-slate-500'
                }\`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className={\`w-8 h-8 rounded-lg flex items-center justify-center \${
                    device.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-600'
                  }\`}>
                    <Power className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">{device.name}</div>
                    <div className="text-[10px] text-slate-400">{device.room}</div>
                  </div>
                </div>
                <div className={\`w-3 h-3 rounded-full \${device.active ? 'bg-emerald-400 shadow-md shadow-emerald-400/50' : 'bg-slate-700'}\`}></div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}`;
}

// 4. KANBAN / AGILE MATRIX APP
function generateKanbanApp(ast: ParsedPromptAST, platform: PlatformType): string {
  return `import React, { useState } from 'react';
import { 
  Plus, CheckCircle2, Clock, AlertCircle, 
  Trash2, MoveRight, Layers, Tag, Filter, User
} from 'lucide-react';

export default function App() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Synthesize Next.js Applet Core', col: 'done', priority: 'high', tag: 'Compiler' },
    { id: 2, title: 'Implement Web Audio oscillator feedback', col: 'progress', priority: 'high', tag: 'Audio' },
    { id: 3, title: 'Build 3D holographic matrix visualizer', col: 'progress', priority: 'medium', tag: 'Canvas' },
    { id: 4, title: 'Configure IndexedDB state persistence', col: 'backlog', priority: 'low', tag: 'Storage' },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showModal, setShowModal] = useState(false);

  const playChime = (freq = 700) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {}
  };

  const moveTask = (id: number, nextCol: string) => {
    playChime(800);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, col: nextCol } : t));
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    playChime(950);
    setTasks(prev => [...prev, {
      id: Date.now(),
      title: newTaskTitle,
      col: 'backlog',
      priority: 'medium',
      tag: 'Feature'
    }]);
    setNewTaskTitle('');
    setShowModal(false);
  };

  const deleteTask = (id: number) => {
    playChime(400);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 font-sans pb-16">
      <header className="sticky top-0 z-20 bg-[#0F172A]/90 backdrop-blur border-b border-slate-800 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/40 text-blue-400 flex items-center justify-center font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white uppercase">${ast.title}</h1>
            <span className="text-[11px] text-blue-400">Sprint Velocity: 48 pts</span>
          </div>
        </div>
        <button 
          onClick={() => { playChime(600); setShowModal(true); }}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1 transition shadow-md shadow-blue-600/30"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Task</span>
        </button>
      </header>

      <main className="max-w-5xl mx-auto p-4">
        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0F172A] border border-blue-500/30 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
              <h3 className="text-sm font-bold text-white uppercase">Create Sprint Task</h3>
              <input 
                type="text"
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                placeholder="Task description..."
                className="w-full bg-[#151F38] border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-400"
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  onClick={addTask}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs"
                >
                  Save Task
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 'backlog', title: 'Backlog', color: 'border-slate-700', next: 'progress' },
            { id: 'progress', title: 'In Progress', color: 'border-blue-500/40', next: 'done' },
            { id: 'done', title: 'Completed', color: 'border-emerald-500/40', next: 'backlog' },
          ].map(col => {
            const colTasks = tasks.filter(t => t.col === col.id);
            return (
              <div key={col.id} className="bg-[#0F172A] rounded-2xl border border-slate-800 p-3 space-y-3 flex flex-col">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{col.title}</span>
                  <span className="text-[11px] font-mono bg-slate-800 px-2 py-0.5 rounded-full text-slate-400">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-2 flex-1">
                  {colTasks.map(task => (
                    <div key={task.id} className="p-3 bg-[#151F38] rounded-xl border border-slate-700/80 space-y-2 shadow-sm">
                      <div className="text-xs font-bold text-white leading-relaxed">{task.title}</div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded-md border border-blue-500/20 font-medium">
                          {task.tag}
                        </span>
                        <div className="flex items-center space-x-1">
                          <button 
                            onClick={() => moveTask(task.id, col.next)}
                            className="p-1 hover:bg-slate-700 text-slate-400 hover:text-cyan-300 rounded transition"
                            title="Advance Column"
                          >
                            <MoveRight className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => deleteTask(task.id)}
                            className="p-1 hover:bg-slate-700 text-slate-500 hover:text-red-400 rounded transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {colTasks.length === 0 && (
                    <div className="text-center py-6 text-xs text-slate-600 italic">No tasks in this lane</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}`;
}

// 5. E-COMMERCE & SNEAKER DROP
function generateEcommerceApp(ast: ParsedPromptAST, platform: PlatformType): string {
  return `import React, { useState } from 'react';
import { 
  ShoppingBag, Flame, Sparkles, Heart, Check, X, 
  ChevronRight, ArrowRight, ShieldCheck, Tag
} from 'lucide-react';

export default function App() {
  const [selectedSize, setSelectedSize] = useState('US 10.5');
  const [cartCount, setCartCount] = useState(0);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [checkoutDone, setCheckoutDone] = useState(false);

  const product = {
    title: 'AuraBot Phantom X1 Cyber-Sneaker',
    dropStatus: 'Live Drop • 14 Units Left',
    price: 280,
    originalPrice: 350,
    sizes: ['US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11', 'US 12'],
    colors: ['#00F0FF', '#A855F7', '#0F172A'],
  };

  const playDropSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {}
  };

  const addToCart = () => {
    playDropSound();
    setCartCount(c => c + 1);
    setCartDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 font-sans pb-16">
      <header className="sticky top-0 z-30 bg-[#0F172A]/90 backdrop-blur border-b border-slate-800 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center font-bold">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white uppercase">${ast.title}</h1>
            <span className="text-[11px] text-amber-400">Exclusive VIP Drop</span>
          </div>
        </div>
        <button 
          onClick={() => setCartDrawerOpen(true)}
          className="relative p-2 bg-slate-800 rounded-xl border border-slate-700 text-slate-300 hover:text-white transition"
        >
          <ShoppingBag className="w-4 h-4" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4">
        {/* Showcase Card */}
        <div className="bg-gradient-to-b from-[#0F172A] via-[#151F38] to-[#0A1020] rounded-3xl border border-amber-500/30 p-6 space-y-4 shadow-2xl">
          <div className="h-52 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 border border-slate-700/80 flex items-center justify-center relative overflow-hidden group">
            <div className="text-7xl group-hover:scale-110 transition duration-500">👟</div>
            <div className="absolute top-3 left-3 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              {product.dropStatus}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">{product.title}</h2>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-black text-amber-400 font-mono">\${product.price}</span>
              <span className="text-xs text-slate-500 line-through font-mono">\${product.originalPrice}</span>
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Select Size</span>
            <div className="grid grid-cols-3 gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={\`py-2 rounded-xl text-xs font-bold transition border \${
                    selectedSize === size
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600'
                  }\`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={addToCart}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black rounded-xl uppercase tracking-wider text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 transition"
          >
            Add to Bag • \${product.price}
          </button>
        </div>
      </main>

      {/* Cart Drawer */}
      {cartDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="bg-[#0F172A] border-l border-slate-800 w-full max-w-sm h-full p-5 flex flex-col justify-between shadow-2xl">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <span className="text-sm font-bold text-white uppercase">Your Bag ({cartCount})</span>
                <button onClick={() => setCartDrawerOpen(false)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cartCount > 0 ? (
                <div className="p-3 bg-[#151F38] rounded-xl border border-slate-700 flex justify-between items-center">
                  <div>
                    <div className="text-xs font-bold text-white">{product.title}</div>
                    <div className="text-[11px] text-slate-400">{selectedSize} • Qty: {cartCount}</div>
                  </div>
                  <span className="text-xs font-bold text-amber-400 font-mono">\${product.price * cartCount}</span>
                </div>
              ) : (
                <div className="text-center py-12 text-xs text-slate-500">Your bag is currently empty</div>
              )}
            </div>

            {cartCount > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex justify-between text-xs font-bold text-white">
                  <span>Total</span>
                  <span className="text-amber-400 font-mono">\${product.price * cartCount}</span>
                </div>
                <button 
                  onClick={() => {
                    playDropSound();
                    setCheckoutDone(true);
                    setTimeout(() => {
                      setCartCount(0);
                      setCheckoutDone(false);
                      setCartDrawerOpen(false);
                    }, 2000);
                  }}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl text-xs uppercase tracking-wider transition"
                >
                  {checkoutDone ? 'Payment Confirmed! 🚀' : 'Instant Checkout'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}`;
}

// 6. CHAT & MESSENGER APP
function generateChatApp(ast: ParsedPromptAST, platform: PlatformType): string {
  return `import React, { useState } from 'react';
import { 
  Send, Mic, Smile, Hash, Users, 
  Circle, Volume2, ShieldCheck, PhoneCall
} from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'AuraBot AI', text: 'Quantum cryptographic handshake initialized. How can I assist your deployment?', time: '10:42 AM', isMe: false },
    { id: 2, sender: 'You', text: 'Deploying the multi-platform hybrid bundle now.', time: '10:43 AM', isMe: true },
    { id: 3, sender: 'Nexus Protocol', text: 'Node sync completed across 48 global edge clusters.', time: '10:44 AM', isMe: false },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [activeChannel, setActiveChannel] = useState('#general-nexus');

  const playBip = (freq = 900) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {}
  };

  const handleSend = () => {
    if (!inputVal.trim()) return;
    playBip(1000);
    const newMsg = {
      id: Date.now(),
      sender: 'You',
      text: inputVal,
      time: 'Just now',
      isMe: true,
    };
    setMessages(prev => [...prev, newMsg]);
    setInputVal('');

    setTimeout(() => {
      playBip(750);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'Nexus AI',
        text: 'Encrypted telemetry stream verified. Packet acknowledged.',
        time: 'Just now',
        isMe: false,
      }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 font-sans flex flex-col">
      <header className="sticky top-0 z-20 bg-[#0F172A] border-b border-slate-800 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-400 flex items-center justify-center font-bold">
            <Hash className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white uppercase">{activeChannel}</h1>
            <span className="text-[11px] text-cyan-400">12 Nodes Online</span>
          </div>
        </div>
      </header>

      {/* Messages View */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 space-y-3 overflow-y-auto">
        {messages.map(m => (
          <div key={m.id} className={\`flex flex-col \${m.isMe ? 'items-end' : 'items-start'}\`}>
            <span className="text-[10px] text-slate-400 mb-1 px-1">{m.sender} • {m.time}</span>
            <div className={\`p-3 rounded-2xl max-w-xs text-xs leading-relaxed \${
              m.isMe 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-medium rounded-tr-none' 
                : 'bg-[#151F38] border border-slate-800 text-white rounded-tl-none'
            }\`}>
              {m.text}
            </div>
          </div>
        ))}
      </main>

      {/* Input Bar */}
      <footer className="sticky bottom-0 bg-[#0F172A] border-t border-slate-800 p-3">
        <div className="max-w-2xl mx-auto flex items-center space-x-2">
          <input 
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Type an encrypted message..."
            className="flex-1 bg-[#151F38] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
          />
          <button 
            onClick={handleSend}
            className="p-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition shadow-md shadow-cyan-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}`;
}

// 7. MUSIC & SYNTHESIZER BEAT LAB
function generateMusicSynthApp(ast: ParsedPromptAST, platform: PlatformType): string {
  return `import React, { useState } from 'react';
import { Volume2, Play, Pause, Disc, Sliders, Music } from 'lucide-react';

export default function App() {
  const [bpm, setBpm] = useState(124);
  const [waveform, setWaveform] = useState<'sine' | 'square' | 'sawtooth'>('sawtooth');
  const [activeSteps, setActiveSteps] = useState([true, false, true, false, true, true, false, true]);

  const playNote = (freq: number) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = waveform;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {}
  };

  const notes = [
    { note: 'C4', freq: 261.63 },
    { note: 'D4', freq: 293.66 },
    { note: 'E4', freq: 329.63 },
    { note: 'F4', freq: 349.23 },
    { note: 'G4', freq: 392.00 },
    { note: 'A4', freq: 440.00 },
    { note: 'B4', freq: 493.88 },
    { note: 'C5', freq: 523.25 },
  ];

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 font-sans p-4 space-y-4">
      <header className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Music className="w-5 h-5 text-cyan-400" />
          <h1 className="text-sm font-bold text-white uppercase">${ast.title}</h1>
        </div>
        <div className="text-xs text-cyan-400 font-mono">BPM: {bpm}</div>
      </header>

      {/* Synthesizer Keys */}
      <div className="bg-[#0F172A] p-4 rounded-2xl border border-slate-800 space-y-3">
        <span className="text-xs font-bold text-slate-400 uppercase">Polyphonic Oscillator Keys</span>
        <div className="grid grid-cols-8 gap-1.5 h-36">
          {notes.map(n => (
            <button
              key={n.note}
              onClick={() => playNote(n.freq)}
              className="bg-slate-800 hover:bg-cyan-500 hover:text-black text-slate-300 font-bold rounded-lg transition text-xs flex flex-col justify-end p-2 border border-slate-700"
            >
              <span>{n.note}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}`;
}

// 8. NOTES & SECOND BRAIN WIKI
function generateNotesApp(ast: ParsedPromptAST, platform: PlatformType): string {
  return `import React, { useState } from 'react';
import { BookOpen, Plus, Search, Tag, FileText } from 'lucide-react';

export default function App() {
  const [notes, setNotes] = useState([
    { id: 1, title: 'Quantum Architecture Blueprint', tag: 'Architecture', body: 'Decentralized template synthesis with real-time compilation.' },
    { id: 2, title: 'Web Audio Synth Parameters', tag: 'Audio', body: 'Frequency modulation ratios for harmonic rich presets.' },
  ]);
  const [selectedNote, setSelectedNote] = useState(notes[0]);

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 font-sans p-4 flex flex-col space-y-3">
      <header className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-purple-400" />
          <h1 className="text-sm font-bold text-white uppercase">${ast.title}</h1>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
        <div className="bg-[#0F172A] p-3 rounded-2xl border border-slate-800 space-y-2">
          {notes.map(n => (
            <div 
              key={n.id} 
              onClick={() => setSelectedNote(n)}
              className={\`p-3 rounded-xl border cursor-pointer \${selectedNote?.id === n.id ? 'bg-purple-900/30 border-purple-500' : 'bg-[#151F38] border-slate-700'}\`}
            >
              <div className="text-xs font-bold text-white">{n.title}</div>
              <span className="text-[10px] text-purple-300">{n.tag}</span>
            </div>
          ))}
        </div>
        <div className="md:col-span-2 bg-[#0F172A] p-5 rounded-2xl border border-slate-800 space-y-3">
          <h2 className="text-base font-bold text-white">{selectedNote?.title}</h2>
          <p className="text-xs text-slate-300 leading-relaxed">{selectedNote?.body}</p>
        </div>
      </div>
    </div>
  );
}`;
}

// 9. FOOD DELIVERY
function generateFoodDeliveryApp(ast: ParsedPromptAST, platform: PlatformType): string {
  return `import React, { useState } from 'react';
import { ShoppingBag, Star, Clock, MapPin, Zap } from 'lucide-react';

export default function App() {
  const [cart, setCart] = useState<{ name: string; price: number }[]>([]);
  const menu = [
    { id: 1, name: 'Cyber Truffle Burger', price: 18.50, rating: 4.9, time: '15m' },
    { id: 2, name: 'Neon Ramen Bowl', price: 16.00, rating: 4.8, time: '12m' },
    { id: 3, name: 'Quantum Green Salad', price: 14.20, rating: 4.7, time: '10m' },
  ];

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 font-sans p-4 space-y-4 max-w-md mx-auto">
      <header className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h1 className="text-sm font-bold text-white uppercase">${ast.title}</h1>
        <span className="text-xs text-cyan-400">Cart: {cart.length} items</span>
      </header>
      <div className="space-y-3">
        {menu.map(item => (
          <div key={item.id} className="p-4 bg-[#0F172A] rounded-2xl border border-slate-800 flex justify-between items-center">
            <div>
              <h3 className="text-xs font-bold text-white">{item.name}</h3>
              <div className="text-[11px] text-slate-400 font-mono">\${item.price.toFixed(2)} • ★ {item.rating}</div>
            </div>
            <button 
              onClick={() => setCart(c => [...c, item])}
              className="px-3 py-1.5 bg-cyan-500 text-black font-bold rounded-lg text-xs"
            >
              Add +
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}`;
}

// 10. TRAVEL PLANNER
function generateTravelApp(ast: ParsedPromptAST, platform: PlatformType): string {
  return `import React, { useState } from 'react';
import { Compass, Calendar, MapPin, DollarSign, Check } from 'lucide-react';

export default function App() {
  const [days, setDays] = useState([
    { day: 1, title: 'Arrival & Cyber City Tour', cost: 120 },
    { day: 2, title: 'Neon High-Speed Rail & Museum', cost: 85 },
    { day: 3, title: 'Holographic Garden & Summit', cost: 140 },
  ]);

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 font-sans p-4 space-y-4 max-w-md mx-auto">
      <header className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h1 className="text-sm font-bold text-white uppercase">${ast.title}</h1>
      </header>
      <div className="space-y-3">
        {days.map(d => (
          <div key={d.day} className="p-4 bg-[#0F172A] rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-cyan-400 font-bold uppercase">Day {d.day}</span>
            <h3 className="text-xs font-bold text-white">{d.title}</h3>
            <div className="text-[11px] text-slate-400 font-mono">Budget: \${d.cost}</div>
          </div>
        ))}
      </div>
    </div>
  );
}`;
}

// 11. GENERAL DASHBOARD
function generateGeneralDashboardApp(ast: ParsedPromptAST, platform: PlatformType): string {
  return `import React, { useState } from 'react';
import { Activity, Zap, CheckCircle2, TrendingUp, Layers, RefreshCw } from 'lucide-react';

export default function App() {
  const [counter, setCounter] = useState(128);
  const [status, setStatus] = useState('Online');

  const playClick = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 font-sans p-4 space-y-4 max-w-3xl mx-auto pb-16">
      <header className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h1 className="text-sm font-bold text-white uppercase">${ast.title}</h1>
        </div>
        <span className="text-xs text-emerald-400 font-mono flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{status}</span>
        </span>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Active Processors', val: counter, change: '+12%' },
          { label: 'Throughput', val: '99.4%', change: '+0.2%' },
          { label: 'Latency', val: '14ms', change: '-4ms' },
          { label: 'Sync Status', val: 'Live', change: 'Edge' },
        ].map((m, i) => (
          <div key={i} className="p-4 bg-[#0F172A] rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase">{m.label}</span>
            <div className="text-lg font-bold text-white font-mono">{m.val}</div>
            <span className="text-[10px] text-cyan-400">{m.change}</span>
          </div>
        ))}
      </div>

      <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 text-center space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase">Live Pipeline Controller</h3>
        <div className="text-4xl font-extrabold text-white font-mono">{counter} ops/sec</div>
        <div className="flex justify-center space-x-3 pt-2">
          <button 
            onClick={() => { playClick(); setCounter(c => c + 10); }}
            className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl text-xs uppercase"
          >
            Increment Ops +10
          </button>
        </div>
      </div>
    </div>
  );
}`;
}
