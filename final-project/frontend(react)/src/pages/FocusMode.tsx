import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, X } from 'lucide-react';

export default function FocusMode() {
  const navigate = useNavigate();
  const [timer, setTimer] = React.useState(25 * 60);
  const [isActive, setIsActive] = React.useState(false);

  React.useEffect(() => {
    let interval: any = null;
    if (isActive && timer > 0) {
      interval = setInterval(() => setTimer(timer - 1), 1000);
    } else if (timer === 0) {
      setIsActive(false);
      // alert ready
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const toggle = () => setIsActive(!isActive);
  const reset = () => { setTimer(25 * 60); setIsActive(false); };

  const formatTime = () => {
    const mins = Math.floor(timer / 60);
    const secs = timer % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-50 overflow-hidden text-slate-200">
      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 text-slate-500 hover:text-white transition-colors"
      >
        <X size={32} />
      </button>
      
      <div className="text-center space-y-12">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-widest uppercase mb-2">Deep Work</h2>
          <p className="text-slate-500 font-medium">Block out the noise.</p>
        </div>
        
        <div className="text-[12rem] font-black tracking-tighter tabular-nums leading-none bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">
          {formatTime()}
        </div>
        
        <div className="flex space-x-6 justify-center">
          <button 
            onClick={toggle} 
            className="w-20 h-20 rounded-full bg-primary-600 hover:bg-primary-500 text-white flex items-center justify-center shadow-[0_0_40px_rgba(20,184,166,0.5)] transition-all"
          >
            {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-2" />}
          </button>
          <button 
            onClick={reset} 
            className="w-20 h-20 rounded-full border-2 border-slate-800 text-slate-500 hover:text-white hover:border-slate-600 flex items-center justify-center transition-all font-bold tracking-widest uppercase text-sm"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
