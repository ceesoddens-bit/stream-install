import React, { useState } from 'react';
import { Send, X, Bot, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AIChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIChatPopup({ isOpen, onClose }: AIChatPopupProps) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hallo! Ik ben jouw AI-assistent. Ik ben een modern, intelligent model dat volledig op de hoogte is van alle ins en outs van deze software. Hoe kan ik je vandaag helpen?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  if (!isOpen) return null;

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    setMessages(prev => [
      ...prev,
      { id: Date.now(), role: 'user', content: inputValue }
    ]);
    
    setInputValue('');
    
    // Simulate thinking and response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { 
          id: Date.now() + 1, 
          role: 'assistant', 
          content: 'Bedankt voor je vraag! Als slim AI-model kan ik je vertellen dat deze functie momenteel in ontwikkeling is. Kan ik je nog ergens anders mee helpen?' 
        }
      ]);
    }, 1000);
  };

  return (
    <div className="fixed left-4 bottom-28 w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/20 z-[9999] overflow-hidden flex flex-col ring-1 ring-black/5 animate-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-emerald-600 to-blue-700 text-white flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-1 px-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
             <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight">Chat met AI</h3>
            <p className="text-[10px] text-emerald-100 font-medium">Altijd online • Smart Model</p>
          </div>
        </div>
        <button 
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[350px] custom-scrollbar bg-slate-50/50">
        {messages.map((m) => (
          <div 
            key={m.id} 
            className={cn(
                "flex gap-2.5 max-w-[85%]",
                m.role === 'user' ? "flex-row-reverse ml-auto" : ""
            )}
          >
            <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-black/5",
                m.role === 'assistant' ? "bg-emerald-50 text-emerald-600" : "bg-blue-600 text-white"
            )}>
              {m.role === 'assistant' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
            </div>
            <div className={cn(
                "p-3 rounded-2xl text-[12.5px] leading-relaxed shadow-sm ring-1 ring-black/5",
                m.role === 'assistant' 
                    ? "bg-white text-gray-800 rounded-tl-sm" 
                    : "bg-blue-600 text-white rounded-tr-sm"
            )}>
              {m.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-100 flex items-center gap-2">
        <div className="relative flex-1">
          <Input 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type je vraag hier..." 
            className="h-10 text-xs pr-10 bg-gray-50 border-gray-100 focus:bg-white focus:border-emerald-200 focus:ring-emerald-100 rounded-xl transition-all"
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      
      {/* Policy hint */}
      <div className="px-4 pb-3 text-center">
        <span className="text-[9px] text-gray-400 font-medium">Onze AI spreekt momenteel Nederlands</span>
      </div>
    </div>
  );
}
