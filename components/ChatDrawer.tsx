'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, AlertTriangle, Sparkles, Loader2 } from 'lucide-react';
import { ChatMessage, SupportedLanguage, HouseholdProfile, CpcbCategory } from '@/types';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  city: string;
  aqi: number;
  category: CpcbCategory;
  profile: HouseholdProfile;
  language: SupportedLanguage;
}

export function ChatDrawer({
  isOpen,
  onClose,
  city,
  aqi,
  category,
  profile,
  language,
}: ChatDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const starterQuestions: Record<SupportedLanguage, string[]> = {
    en: [
      'Should my child attend outdoor school sports today?',
      'Is an expensive air purifier necessary for an apartment?',
      'How effective is damp cloth window sealing?',
      'Can my elderly parent go for a 6:00 AM walk?',
    ],
    hi: [
      'क्या आज बच्चे को बाहर खेलने भेजना सुरक्षित है?',
      'क्या घर में महंगा प्यूरीफायर लगाना जरूरी है?',
      'खिड़की पर गीला कपड़ा लगाने से कितना फायदा होता है?',
      'क्या सुबह 6 बजे सैर पर जाना ठीक है?',
    ],
    mr: [
      'आज मुलाने बाहेर खेळाच्या सरावाला जावे का?',
      'घरासाठी महागडा प्युरिफायर घेणे गरजेचे आहे का?',
      'खिडकीवर ओला टॉवेल ठेवल्याने खरोखर फायदा होतो का?',
      'सकाळी फिरायला जाणे आज सुरक्षित आहे का?',
    ],
  };

  const initialGreeting: Record<SupportedLanguage, string> = {
    en: `Hello! I am your "How In थंडीत" assistant. I can answer practical smog questions for your home in ${city} (Current AQI: ${aqi}). How can I help you today?`,
    hi: `नमस्ते! मैं "How In थंडीत" सहायक हूँ। मैं ${city} (AQI: ${aqi}) के लिए प्रदूषण से बचाव के घरेलू सवालों के जवाब दे सकता हूँ। मैं आपकी क्या मदद करूँ?`,
    mr: `नमस्कार! मी आपला "How In थंडीत" सल्लागार आहे. ${city} (सध्याचा AQI: ${aqi}) मधील धूर आणि प्रदूषणापासून संरक्षणासाठी तुम्ही थेट प्रश्न विचारू शकता.`,
  };

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          sender: 'assistant',
          text: initialGreeting[language],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [language, city, aqi]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ sender: m.sender, text: m.text })),
          context: {
            city,
            aqi,
            category,
            language,
            profile,
          },
        }),
      });

      const data = await res.json();
      const botReply = data.reply || 'Sorry, I could not generate a reply. Please try again.';

      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          sender: 'assistant',
          text: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error('Chat request error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          sender: 'assistant',
          text: 'Network error communicating with the advisor. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {language === 'hi' ? 'सलाह पूछें' : language === 'mr' ? 'सल्लागार चॅट' : 'Ask How In थंडीत'}
              </h2>
              <span className="text-xs text-slate-500">
                {city} • AQI {aqi}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safety banner */}
        <div className="px-4 py-2 bg-amber-50 border-b border-amber-100 flex items-center gap-2 text-[11px] text-amber-900">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>
            {language === 'hi'
              ? 'प्रदूषण से बचाव की जानकारी। यह चिकित्सीय सलाह नहीं है।'
              : language === 'mr'
              ? 'केवळ प्रदूषणापासून संरक्षणासाठी माहिती. वैद्यकीय सल्ला नाही.'
              : 'Environmental harm-reduction only. Not clinical or medical advice.'}
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5 text-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-br-xs'
                    : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>
                <div
                  className={`text-[9px] mt-1 text-right ${
                    m.sender === 'user' ? 'text-slate-400' : 'text-slate-400'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 py-1">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span>{language === 'hi' ? 'उत्तर तैयार हो रहा है...' : language === 'mr' ? 'विचार करत आहे...' : 'Thinking...'}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Starter Prompt Chips */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mb-1.5">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              <span>{language === 'hi' ? 'सुझाए गए सवाल' : language === 'mr' ? 'सुचवलेले प्रश्न' : 'Suggested Questions'}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {starterQuestions[language]?.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="text-left text-[11px] py-1 px-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/50 transition truncate max-w-full"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                language === 'hi'
                  ? 'सवाल पूछें...'
                  : language === 'mr'
                  ? 'प्रश्न विचारा...'
                  : 'Ask about morning walk, purifiers, school...'
              }
              className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
