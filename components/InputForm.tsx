import React, { useState, useCallback, useRef } from 'react';
import { Send, Sparkles, Image as ImageIcon, X } from 'lucide-react';
import { RelationshipLevel } from '../types';

interface InputFormProps {
  onSubmit: (text: string, relationship: RelationshipLevel, image?: string) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [input, setInput] = useState('');
  const [relationship, setRelationship] = useState<RelationshipLevel>(RelationshipLevel.UNKNOWN);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() || selectedImage) {
      onSubmit(input, relationship, selectedImage || undefined);
    }
  }, [input, relationship, selectedImage, onSubmit]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto relative z-10">
      <div className="flex flex-col gap-4">
        
        {/* Relationship Selector */}
        <div className="relative z-20">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 ml-1">
            Who are you talking to?
          </label>
          <select 
            value={relationship} 
            onChange={(e) => setRelationship(e.target.value as RelationshipLevel)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-xl focus:ring-brand-accent focus:border-brand-accent block p-3 appearance-none cursor-pointer transition-colors hover:bg-slate-750"
          >
            {Object.values(RelationshipLevel).map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        {/* Input Box */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-accent to-brand-emerald rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col">
            
            {/* Image Preview Area */}
            {selectedImage && (
              <div className="relative w-full h-48 bg-slate-950 border-b border-slate-800">
                <img src={selectedImage} alt="Upload preview" className="w-full h-full object-contain p-4" />
                <button 
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 p-1 bg-slate-800/80 rounded-full text-white hover:bg-red-500/80 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={selectedImage ? "Add context about the photo..." : "Describe the context (e.g. coffee shop, hiking trip, bio says...)"}
              className={`w-full bg-transparent text-white p-6 pb-20 text-lg placeholder-slate-500 focus:outline-none resize-none ${selectedImage ? 'h-32' : 'h-40'}`}
              disabled={isLoading}
            />
            
            <div className="absolute bottom-4 right-4 left-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${selectedImage ? 'bg-brand-emerald/20 text-brand-emerald' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                  title="Analyze an image"
                >
                  <ImageIcon size={14} />
                  {selectedImage ? 'Image Added' : 'Add Image'}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading || (!input.trim() && !selectedImage)}
                className={`
                  flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300
                  ${isLoading || (!input.trim() && !selectedImage)
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                    : 'bg-white text-slate-900 hover:bg-brand-accent hover:text-white hover:scale-105 hover:shadow-lg active:scale-95'
                  }
                `}
              >
                {isLoading ? (
                  <>
                    <Sparkles size={18} className="animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Generate</span>
                    <Send size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};