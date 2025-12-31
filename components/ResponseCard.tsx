import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface ResponseCardProps {
  title: string;
  content: string;
  description: string;
  colorClass: string;
  icon: React.ReactNode;
  delay: number;
}

export const ResponseCard: React.FC<ResponseCardProps> = ({ title, content, description, colorClass, icon, delay }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  return (
    <div 
      className={`relative group overflow-hidden rounded-2xl bg-slate-800/50 border border-slate-700 p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:bg-slate-800/80 animate-fade-in`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`absolute top-0 left-0 w-1 h-full ${colorClass} transition-all duration-300 group-hover:w-2`}></div>
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg bg-slate-900/50 ${colorClass.replace('bg-', 'text-')}`}>
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">{title}</h3>
            <p className="text-xs text-slate-400 font-medium">{description}</p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="p-2 rounded-full hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
          title="Copy to clipboard"
        >
          {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
        </button>
      </div>

      <div className="relative min-h-[80px] flex items-center">
        <p className="text-lg text-slate-200 leading-relaxed font-medium">
          "{content}"
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-end">
         <span className={`text-xs font-bold uppercase tracking-wider ${colorClass.replace('bg-', 'text-')} opacity-60`}>
           {title} Mode
         </span>
      </div>
    </div>
  );
};