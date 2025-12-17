import React from 'react';
import ReactMarkdown from 'react-markdown';

interface CodeViewerProps {
  content: string;
  isMarkdown?: boolean;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ content, isMarkdown = false }) => {
  if (isMarkdown) {
    return (
      <div className="prose prose-invert max-w-none p-4 text-sm overflow-auto h-full">
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline ? (
                <div className="relative group my-4 rounded-lg overflow-hidden border border-slate-700 bg-[#0d1117]">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/50 border-b border-slate-700 text-xs text-slate-400">
                     <span>{match ? match[1] : 'code'}</span>
                  </div>
                  <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed bg-[#0d1117] text-slate-200 m-0">
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                </div>
              ) : (
                <code className="bg-slate-800 text-slate-200 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  }

  return (
    <pre className="p-4 text-sm font-mono leading-relaxed overflow-auto h-full text-slate-200 bg-[#0d1117]">
      <code>{content}</code>
    </pre>
  );
};

export default CodeViewer;