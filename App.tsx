import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import CodeViewer from './components/CodeViewer';
import HistoryView from './components/HistoryView';
import { AppMode, GenerationResult } from './types';
import { generateTerraform, editTerraform, analyzeTerraform } from './services/geminiService';
import { saveToHistory } from './services/historyService';
import { Play, Sparkles, Copy, Check, Download, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.GENERATE);
  const [inputContent, setInputContent] = useState('');
  const [instruction, setInstruction] = useState(''); // For Edit mode
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [showCopied, setShowCopied] = useState(false);
  
  // Reset output when mode changes to clear confusion, optionally
  useEffect(() => {
    // Optional: clear output on mode switch? 
    // Let's keep it to allow users to reference previous work if they switch back and forth mentally,
    // but typically a reset is cleaner. 
    // setOutput(''); 
    // setInputContent(''); 
    // setInstruction('');
  }, [mode]);

  const handleAction = async () => {
    if (!inputContent.trim() && mode !== AppMode.GENERATE) {
        // Need source code for Edit/Analyze
        return; 
    }
    if (mode === AppMode.GENERATE && !inputContent.trim()) {
        // Need prompt for Generate
        return;
    }

    setIsLoading(true);
    try {
      let result = '';
      if (mode === AppMode.GENERATE) {
        result = await generateTerraform(inputContent);
      } else if (mode === AppMode.EDIT) {
        result = await editTerraform(inputContent, instruction);
      } else if (mode === AppMode.ANALYZE) {
        result = await analyzeTerraform(inputContent);
      }
      setOutput(result);
      
      // Save to History on success
      if (result && !result.startsWith('Error')) {
        saveToHistory({
            type: mode,
            input: inputContent,
            instruction: mode === AppMode.EDIT ? instruction : undefined,
            output: result,
            model: 'gemini-2.5-flash'
        });
      }

    } catch (e) {
      console.error(e);
      setOutput("An error occurred while processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreHistory = (item: GenerationResult) => {
    setMode(item.type);
    setInputContent(item.input);
    setInstruction(item.instruction || '');
    setOutput(item.output);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const handleDownload = () => {
      const element = document.createElement("a");
      const file = new Blob([output], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = "terraform_output.tf"; // Defaults to .tf, user can rename if markdown
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
  };

  const renderInputSection = () => {
    switch (mode) {
      case AppMode.GENERATE:
        return (
          <div className="flex flex-col h-full">
             <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-300">Prompt / Requirements</label>
                <span className="text-xs text-slate-500">Describe the infrastructure you need</span>
             </div>
            <textarea
              className="flex-1 w-full p-4 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-tf-500 focus:border-transparent outline-none text-slate-200 font-sans resize-none transition-all placeholder:text-slate-600"
              placeholder="e.g., Create an AWS VPC with 2 public subnets, an internet gateway, and an EC2 instance running Ubuntu."
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
            />
          </div>
        );
      case AppMode.EDIT:
        return (
          <div className="flex flex-col h-full space-y-4">
             <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-slate-300">Existing Terraform Code</label>
                </div>
                <textarea
                  className="flex-1 w-full p-4 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-tf-500 focus:border-transparent outline-none text-slate-200 font-mono text-sm resize-none"
                  placeholder="Paste your .tf code here..."
                  value={inputContent}
                  onChange={(e) => setInputContent(e.target.value)}
                />
             </div>
             <div className="h-1/3 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-slate-300">Instructions</label>
                </div>
                <textarea
                  className="flex-1 w-full p-4 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-tf-500 focus:border-transparent outline-none text-slate-200 font-sans resize-none"
                  placeholder="e.g., Change the instance type to t3.micro and add tags."
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                />
             </div>
          </div>
        );
      case AppMode.ANALYZE:
        return (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-300">Terraform Code to Analyze</label>
             </div>
            <textarea
              className="flex-1 w-full p-4 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-tf-500 focus:border-transparent outline-none text-slate-200 font-mono text-sm resize-none"
              placeholder="Paste your .tf code here..."
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const getActionButtonText = () => {
    if (isLoading) return 'Processing...';
    switch (mode) {
        case AppMode.GENERATE: return 'Generate Code';
        case AppMode.EDIT: return 'Apply Changes';
        case AppMode.ANALYZE: return 'Run Analysis';
        default: return 'Action';
    }
  };

  const getHeaderTitle = () => {
      switch (mode) {
          case AppMode.GENERATE: return 'Infrastructure Generator';
          case AppMode.EDIT: return 'Code Refactor & Edit';
          case AppMode.ANALYZE: return 'Security & Logic Analyzer';
          case AppMode.HISTORY: return 'Session History';
          default: return 'Workspace';
      }
  };

  return (
    <div className="flex h-screen bg-[#0f172a] overflow-hidden text-slate-200 font-sans selection:bg-tf-500/30">
      <Sidebar currentMode={mode} setMode={setMode} />

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md flex items-center justify-between px-6 lg:px-8 z-10">
            <div>
                <h1 className="text-xl font-bold text-white">{getHeaderTitle()}</h1>
                <p className="text-xs text-slate-500 mt-0.5">Powered by Google Gemini 2.5</p>
            </div>
            <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700"></div>
            </div>
        </header>

        {/* Main Workspace */}
        <main className="flex-1 p-4 lg:p-6 overflow-hidden flex flex-col relative">
            {mode === AppMode.HISTORY ? (
                <div className="flex-1 glass-panel rounded-2xl shadow-2xl overflow-hidden">
                    <HistoryView onRestore={handleRestoreHistory} />
                </div>
            ) : (
                <div className="flex-1 flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
                    {/* LEFT PANE: INPUT */}
                    <div className="flex-1 flex flex-col min-h-[300px] lg:h-full glass-panel rounded-2xl p-1 shadow-2xl">
                        <div className="flex-1 p-4 overflow-hidden">
                            {renderInputSection()}
                        </div>
                        <div className="p-4 border-t border-slate-700/50 bg-slate-900/50 rounded-b-xl flex justify-between items-center">
                        <div className="text-xs text-slate-500 italic hidden sm:block">
                                {mode === AppMode.GENERATE ? 'Press Generate to create IaC.' : 'Paste code to begin.'}
                        </div>
                            <button
                                onClick={handleAction}
                                disabled={isLoading || (!inputContent.trim())}
                                className={`flex items-center px-6 py-2.5 rounded-lg font-medium text-sm transition-all shadow-lg
                                    ${isLoading 
                                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                                        : 'bg-tf-600 hover:bg-tf-500 text-white shadow-tf-500/20 hover:shadow-tf-500/40 active:transform active:scale-95'
                                    }
                                `}
                            >
                                {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin"/> : <Sparkles className="w-4 h-4 mr-2" />}
                                {getActionButtonText()}
                            </button>
                        </div>
                    </div>

                    {/* RIGHT PANE: OUTPUT */}
                    <div className="flex-1 flex flex-col min-h-[300px] lg:h-full glass-panel rounded-2xl p-1 shadow-2xl overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-12 bg-slate-900/50 border-b border-slate-700/50 flex items-center justify-between px-4 z-20 backdrop-blur-sm rounded-t-xl">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                {mode === AppMode.ANALYZE ? 'Report Output' : 'Generated Code'}
                            </span>
                            <div className="flex items-center space-x-2">
                                {output && (
                                    <>
                                        <button 
                                            onClick={handleDownload}
                                            className="p-1.5 hover:bg-slate-700 rounded-md text-slate-400 hover:text-white transition-colors"
                                            title="Download"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={copyToClipboard}
                                            className="p-1.5 hover:bg-slate-700 rounded-md text-slate-400 hover:text-white transition-colors relative"
                                            title="Copy"
                                        >
                                            {showCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 pt-12 bg-[#0d1117] overflow-hidden rounded-xl relative">
                            {output ? (
                                <CodeViewer content={output} isMarkdown={true} />
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-600 p-8 text-center">
                                    {isLoading ? (
                                        <div className="flex flex-col items-center animate-pulse">
                                            <div className="w-12 h-12 border-4 border-tf-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                            <p className="text-sm font-medium text-tf-500">Gemini is thinking...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-4">
                                                <Play className="w-6 h-6 ml-1 opacity-50" />
                                            </div>
                                            <p className="text-sm">Output will appear here.</p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default App;