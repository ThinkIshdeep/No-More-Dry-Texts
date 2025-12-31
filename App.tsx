import React, { useState } from 'react';
import { generateSignal } from './services/geminiService';
import { SignalResponse, RelationshipLevel } from './types';
import { ResponseCard } from './components/ResponseCard';
import { InputForm } from './components/InputForm';
import { Eye, HelpCircle, Sparkles, MessageCircle, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [response, setResponse] = useState<SignalResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentRelationship, setCurrentRelationship] = useState<string>('');

  const handleGenerate = async (input: string, relationship: RelationshipLevel, image?: string) => {
    setIsLoading(true);
    setError(null);
    setResponse(null);
    setCurrentRelationship(relationship);

    try {
      const result = await generateSignal(input, relationship, image);
      setResponse(result);
    } catch (err) {
      setError("Analysis failed. Try being more specific or uploading a clearer image.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark text-slate-200 selection:bg-brand-accent selection:text-brand-dark flex flex-col">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-purple/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-accent/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 w-[30%] h-[30%] bg-brand-emerald/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 w-full p-6 md:p-8 flex items-center justify-between border-b border-white/5 bg-slate-900/50 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-brand-accent to-brand-emerald p-2.5 rounded-xl shadow-lg shadow-brand-accent/20">
            <MessageCircle className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Social Signal AI</h1>
            <p className="text-xs text-slate-400 tracking-wide font-medium">FORMERLY FIRST CONVO STARTER</p>
          </div>
        </div>
        <span className="hidden md:block text-xs font-semibold text-slate-500">
            AI-POWERED V4.0
        </span>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8 relative z-10 w-full max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <div className={`transition-all duration-500 w-full max-w-3xl text-center mb-10 ${response ? 'mt-8' : 'mt-16'}`}>
          {!response && !isLoading && (
            <div className="animate-fade-in mb-8">
              <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-6 leading-tight">
                Stop Sending "Hey."<br/>
                <span className="text-brand-emerald">Start A Conversation.</span>
              </h2>
              <p className="text-lg text-slate-400 max-w-lg mx-auto leading-relaxed">
                Upload a photo or paste a bio. Select your relationship level. Get the perfect opener that actually gets a reply.
              </p>
            </div>
          )}
          
          <InputForm onSubmit={handleGenerate} isLoading={isLoading} />
        </div>

        {/* Error State */}
        {error && (
          <div className="w-full max-w-2xl bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 animate-fade-in mb-8">
            <AlertCircle size={20} />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Results Grid */}
        {response && (
          <div className="w-full flex flex-col items-center animate-fade-in pb-20">
             <div className="mb-6 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Strategy: {currentRelationship.split('(')[0]}
             </div>
             
             <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
              <ResponseCard
                title="The Observer"
                description="Context & Detail Oriented."
                content={response.observer}
                colorClass="bg-brand-accent"
                icon={<Eye size={20} />}
                delay={0}
              />
              <ResponseCard
                title="The Question"
                description="Specific & Engaging."
                content={response.question}
                colorClass="bg-brand-emerald"
                icon={<HelpCircle size={20} />}
                delay={150}
              />
              <ResponseCard
                title="The Witty/Fun"
                description="Lighthearted & Playful."
                content={response.witty}
                colorClass="bg-brand-purple"
                icon={<Sparkles size={20} />}
                delay={300}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-slate-600 text-sm relative z-10 border-t border-white/5 bg-slate-900/30">
        <p>© {new Date().getFullYear()} Social Signal AI.</p>
      </footer>
    </div>
  );
};

export default App;