import React, { useEffect, useState } from 'react';
import { GenerationResult, AppMode } from '../types';
import { getHistory, deleteHistoryItem, clearAllHistory } from '../services/historyService';
import { Hammer, Edit3, ShieldAlert, Trash2, ArrowRight, Calendar, Clock } from 'lucide-react';

interface HistoryViewProps {
  onRestore: (item: GenerationResult) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ onRestore }) => {
  const [items, setItems] = useState<GenerationResult[]>([]);

  useEffect(() => {
    setItems(getHistory());
  }, []);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = deleteHistoryItem(id);
    setItems(updated);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all history?')) {
      clearAllHistory();
      setItems([]);
    }
  };

  const getIcon = (type: AppMode) => {
    switch (type) {
      case AppMode.GENERATE: return <Hammer className="w-4 h-4 text-emerald-400" />;
      case AppMode.EDIT: return <Edit3 className="w-4 h-4 text-blue-400" />;
      case AppMode.ANALYZE: return <ShieldAlert className="w-4 h-4 text-amber-400" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getTypeLabel = (type: AppMode) => {
    switch (type) {
      case AppMode.GENERATE: return 'Generation';
      case AppMode.EDIT: return 'Refactor';
      case AppMode.ANALYZE: return 'Analysis';
      default: return type;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500">
        <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
          <Clock className="w-8 h-8 opacity-50" />
        </div>
        <p className="text-lg font-medium">No history yet</p>
        <p className="text-sm">Generate, edit, or analyze Terraform code to see it here.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Clock className="w-6 h-6 text-tf-500" />
          Session History
        </h2>
        <button 
          onClick={handleClearAll}
          className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 rounded-md transition-colors"
        >
          Clear All History
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {items.map((item) => (
          <div 
            key={item.id}
            onClick={() => onRestore(item)}
            className="group relative bg-slate-800/40 border border-slate-700/50 hover:border-tf-500/50 hover:bg-slate-800/80 rounded-xl p-5 cursor-pointer transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-900/50 border border-slate-700 text-xs font-medium text-slate-300">
                  {getIcon(item.type)}
                  {getTypeLabel(item.type)}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(item.timestamp)}
                </span>
              </div>
              <button
                onClick={(e) => handleDelete(e, item.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                title="Delete item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-slate-200 line-clamp-2 font-mono bg-slate-900/30 p-2 rounded border border-slate-800/50">
                {item.input.slice(0, 150)}{item.input.length > 150 ? '...' : ''}
              </p>
              {item.instruction && (
                <p className="mt-2 text-xs text-slate-400 italic">
                  <span className="text-tf-500 not-italic font-semibold mr-1">Instruction:</span> 
                  {item.instruction}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-slate-600 font-mono">{item.model}</span>
              <div className="flex items-center text-xs font-medium text-tf-500 group-hover:translate-x-1 transition-transform">
                Restore Session <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryView;