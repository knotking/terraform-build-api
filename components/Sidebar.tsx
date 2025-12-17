import React from 'react';
import { Hammer, Edit3, ShieldAlert, History, Terminal } from 'lucide-react';
import { AppMode } from '../types';

interface SidebarProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentMode, setMode }) => {
  const menuItems = [
    { mode: AppMode.GENERATE, icon: Hammer, label: 'Generate', desc: 'Create from prompt' },
    { mode: AppMode.EDIT, icon: Edit3, label: 'Edit & Refactor', desc: 'Modify existing code' },
    { mode: AppMode.ANALYZE, icon: ShieldAlert, label: 'Analyze', desc: 'Security & Best Practices' },
    { mode: AppMode.HISTORY, icon: History, label: 'History', desc: 'Past sessions' },
  ];

  return (
    <div className="w-20 lg:w-64 h-full bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 transition-all duration-300">
      <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800">
        <div className="w-8 h-8 bg-gradient-to-br from-tf-500 to-tf-700 rounded-lg flex items-center justify-center shadow-lg shadow-tf-500/20">
            <Terminal className="text-white w-5 h-5" />
        </div>
        <span className="hidden lg:block ml-3 font-bold text-lg tracking-tight text-white">
          Terra<span className="text-tf-500">Forge</span>
        </span>
      </div>

      <nav className="flex-1 py-6 space-y-2 px-3">
        {menuItems.map((item) => (
          <button
            key={item.mode}
            onClick={() => setMode(item.mode)}
            className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group ${
              currentMode === item.mode
                ? 'bg-tf-500/10 text-tf-500 ring-1 ring-tf-500/50'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <item.icon className={`w-6 h-6 shrink-0 ${currentMode === item.mode ? 'text-tf-500' : 'group-hover:text-slate-200'}`} />
            <div className="hidden lg:block ml-3 text-left">
              <p className={`text-sm font-medium ${currentMode === item.mode ? 'text-tf-100' : ''}`}>
                {item.label}
              </p>
              <p className="text-xs text-slate-500 group-hover:text-slate-400 truncate w-32">
                {item.desc}
              </p>
            </div>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="hidden lg:block p-3 rounded-lg bg-slate-800/50 border border-slate-700">
          <p className="text-xs text-slate-400 font-mono">Gemini 2.5 Flash</p>
          <div className="flex items-center mt-1 space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs text-emerald-500 font-medium">System Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;