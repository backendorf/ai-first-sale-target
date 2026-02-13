
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ProgressBar } from './components/ProgressBar';
import { StatCard } from './components/StatCard';

const STORAGE_KEY = 'saletarget_data_v3';

const CURRENCIES = [
  { symbol: '$', code: 'USD', name: 'US Dollar' },
  { symbol: 'R$', code: 'BRL', name: 'Brazilian Real' },
  { symbol: '€', code: 'EUR', name: 'Euro' },
  { symbol: '£', code: 'GBP', name: 'British Pound' },
  { symbol: '¥', code: 'JPY', name: 'Japanese Yen' },
];

const App: React.FC = () => {
  // --- State Initialization from Local Storage ---
  const [targetAmount, setTargetAmount] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).targetAmount : 1000;
  });
  const [unitValue, setUnitValue] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).unitValue : 50;
  });
  const [salesCount, setSalesCount] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).salesCount : 0;
  });
  const [currency, setCurrency] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).currency : '$';
  });

  const [advice, setAdvice] = useState<string>("");
  const [isLoadingAdvice, setIsLoadingAdvice] = useState<boolean>(false);
  const [showConfig, setShowConfig] = useState<boolean>(false);

  // --- Persistence Hook ---
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
      targetAmount, 
      unitValue, 
      salesCount,
      currency
    }));
  }, [targetAmount, unitValue, salesCount, currency]);

  // --- Calculations ---
  const safeUnitValue = useMemo(() => unitValue > 0 ? unitValue : 1, [unitValue]);
  const currentAmount = useMemo(() => salesCount * unitValue, [salesCount, unitValue]);
  
  const percentage = useMemo(() => {
    const total = targetAmount > 0 ? targetAmount : 1;
    return (currentAmount / total) * 100;
  }, [currentAmount, targetAmount]);
  
  const salesNeeded = useMemo(() => {
    const remaining = targetAmount - currentAmount;
    if (remaining <= 0) return 0;
    return Math.ceil(remaining / safeUnitValue);
  }, [targetAmount, currentAmount, safeUnitValue]);

  // --- Handlers ---
  const handleAddSale = useCallback(() => {
    setSalesCount(prev => prev + 1);
  }, []);

  const handleRemoveSale = useCallback(() => {
    setSalesCount(prev => Math.max(0, prev - 1));
  }, []);

  const handleReset = useCallback(() => {
    if (window.confirm("CONFIRM RESET: All progress will be deleted.")) {
      setSalesCount(0);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4 md:p-8 selection:bg-white selection:text-black">
      <div className="w-full max-w-4xl space-y-8">
        
        {/* Header */}
        <header className="flex justify-between items-baseline border-b-4 border-white pb-6">
          <h1 className="text-6xl font-black tracking-tighter">SALETARGET.</h1>
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowConfig(!showConfig)}
              className="text-[10px] font-bold uppercase tracking-widest border-2 border-white px-4 py-2 hover:bg-white hover:text-black transition-all active:scale-95"
            >
              {showConfig ? 'Lock Config' : 'Setup Target'}
            </button>
          </div>
        </header>

        {/* Configuration Panel */}
        {showConfig && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-900 p-8 border-2 border-white animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col space-y-3">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Currency</label>
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-black border-2 border-white p-4 text-2xl font-black focus:outline-none focus:bg-white focus:text-black transition-all appearance-none cursor-pointer"
              >
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.symbol}>{c.symbol} ({c.code})</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col space-y-3">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Target ({currency})</label>
              <input 
                type="number" 
                value={targetAmount}
                onChange={(e) => setTargetAmount(Math.max(0, Number(e.target.value)))}
                className="bg-black border-2 border-white p-4 text-3xl font-black focus:outline-none focus:bg-white focus:text-black transition-all"
                placeholder="0"
              />
            </div>
            <div className="flex flex-col space-y-3">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Per Sale ({currency})</label>
              <input 
                type="number" 
                value={unitValue}
                onChange={(e) => setUnitValue(Math.max(0, Number(e.target.value)))}
                className="bg-black border-2 border-white p-4 text-3xl font-black focus:outline-none focus:bg-white focus:text-black transition-all"
                placeholder="0"
              />
            </div>
          </div>
        )}

        {/* Dashboard Stats */}
        <main className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              label="Current Revenue" 
              value={`${currency}${currentAmount.toLocaleString()}`} 
              subValue={`Target: ${currency}${targetAmount.toLocaleString()}`}
            />
            <StatCard 
              label="Success Count" 
              value={salesCount} 
              subValue="Verified closed sales"
            />
            <StatCard 
              label="Remaining Steps" 
              value={salesNeeded} 
              className="bg-white text-black"
              subValue={`Sales of ${currency}${unitValue} each`}
            />
          </div>

          {/* Progress Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Mission Progress</span>
              <span className="text-4xl font-black tabular-nums">{Math.floor(percentage)}%</span>
            </div>
            <ProgressBar percentage={percentage} />
          </div>

          {/* Action Area */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-4">
            <button 
              onClick={handleAddSale}
              className="md:col-span-3 py-10 border-4 border-white text-4xl font-black uppercase tracking-tighter hover:bg-white hover:text-black transition-all transform active:scale-[0.97] flex items-center justify-center"
            >
              + RECORD SALE
            </button>
            <button 
              onClick={handleRemoveSale}
              className="py-10 border-4 border-white text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center"
              title="Undo last sale"
            >
              Undo
            </button>
            <button 
              onClick={handleReset}
              className="py-10 border-4 border-white text-xs font-black uppercase tracking-widest hover:bg-red-600 hover:border-red-600 transition-all flex items-center justify-center"
            >
              Reset
            </button>
          </div>
        </main>

        <footer className="pt-20 pb-12 text-center border-t border-zinc-900">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.5em] mb-4">
              Continuous Operation &bull; Persistent Storage &bull; Zero Noise
            </p>
            <div className="flex justify-center space-x-4 opacity-20">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
