import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Copy, Check, Database, Zap, Sparkles } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import gsap from 'gsap';

/* ──── Typing animation ──── */
const TypedText = ({ text, onDone }) => {
    const [shown, setShown] = useState('');
    const [done, setDone] = useState(false);

    useEffect(() => {
        setShown('');
        setDone(false);
        let i = 0;
        const id = setInterval(() => {
            if (i < text.length) {
                setShown(text.slice(0, ++i));
            } else {
                clearInterval(id);
                setDone(true);
                onDone?.();
            }
        }, 10);
        return () => clearInterval(id);
    }, [text]);

    return (
        <div className="md">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{shown}</ReactMarkdown>
            {!done && <span className="cursor" />}
        </div>
    );
};

/* ──── Skeleton thinking ──── */
const ThinkingBubble = () => (
    <motion.div
        key="thinking"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="flex items-start gap-3"
    >
        <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center" style={{ background: 'rgba(99,102,241,.12)', border: '1px solid rgba(99,102,241,.2)' }}>
            <Bot size={15} style={{ color: 'var(--violet-light)' }} />
        </div>
        <div className="bubble-bot px-5 py-4 flex-1 max-w-lg space-y-3">
            <div className="flex items-center gap-2 mb-1">
                <div className="flex gap-1"><div className="dot" /><div className="dot" /><div className="dot" /></div>
                <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--violet-light)' }}>Querying…</span>
            </div>
            <div className="skel w-4/5" />
            <div className="skel w-3/5" />
            <div className="skel w-2/3" />
        </div>
    </motion.div>
);

/* ──── Single message bubble ──── */
const Bubble = ({ msg, isLatest }) => {
    const ref = useRef();
    const [copied, setCopied] = useState(false);
    const isUser = msg.role === 'user';

    useEffect(() => {
        gsap.from(ref.current, { y: 14, opacity: 0, duration: 0.32, ease: 'power2.out' });
    }, []);

    const copy = async () => {
        await navigator.clipboard.writeText(msg.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div ref={ref} className={`flex items-end gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && (
                <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center shadow-sm" style={{ background: 'rgba(99,102,241,.12)', border: '1px solid rgba(99,102,241,.2)' }}>
                    <Bot size={15} style={{ color: 'var(--violet-light)' }} />
                </div>
            )}

            <div className={`max-w-[78%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div className={`relative group ${isUser ? 'bubble-user px-5 py-3' : 'bubble-bot px-5 py-4'}`}>
                    {!isUser && (
                        <button onClick={copy} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-white/5">
                            {copied ? <Check size={11} style={{ color: 'var(--emerald)' }} /> : <Copy size={11} style={{ color: 'var(--text-3)' }} />}
                        </button>
                    )}
                    {isUser ? (
                        <p className="text-sm leading-relaxed text-white whitespace-pre-wrap">{msg.content}</p>
                    ) : isLatest ? (
                        <TypedText text={msg.content} />
                    ) : (
                        <div className="md"><ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown></div>
                    )}
                </div>
                {!isUser && (
                    <div className="flex items-center gap-1 mt-1.5 px-1">
                        <Sparkles size={9} style={{ color: 'var(--text-3)' }} />
                        <span className="text-[10px]" style={{ color: 'var(--text-3)' }}>Sahyadri RAG</span>
                    </div>
                )}
            </div>

            {isUser && (
                <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)', boxShadow: '0 3px 12px rgba(99,102,241,.3)' }}>
                    <User size={15} className="text-white" />
                </div>
            )}
        </div>
    );
};

/* ──── Welcome screen ──── */
const Welcome = ({ onSuggest }) => {
    const ref = useRef();
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.wcard', { y: 24, opacity: 0, stagger: 0.09, duration: 0.55, ease: 'power3.out', delay: 0.2 });
            gsap.from('.wtitle', { y: 16, opacity: 0, duration: 0.6, ease: 'power3.out' });
            gsap.to('.worb', { scale: 1.07, duration: 2.5, ease: 'sine.inOut', yoyo: true, repeat: -1 });
        }, ref);
        return () => ctx.revert();
    }, []);

    const cards = [
        { q: "Who is the HOD of CS?", icon: "👨‍💼" },
        { q: "What courses are in Semester 5?", icon: "📚" },
        { q: "List all faculty", icon: "👥" },
        { q: "Tell me about the CS department", icon: "🏛️" },
    ];

    return (
        <div ref={ref} className="flex flex-col items-center justify-center h-full text-center px-8 pb-28">
            <div className="worb w-16 h-16 rounded-2xl mb-6 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#4f46e5,#6d28d9)', boxShadow: '0 16px 48px rgba(99,102,241,.35)' }}>
                <Database size={28} className="text-white" />
            </div>
            <h1 className="wtitle text-3xl font-black grad mb-2">Sahyadri RAG System</h1>
            <p className="text-sm mb-8 max-w-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>
                Natural language access to your college database. Ask anything.
            </p>
            <div className="grid grid-cols-2 gap-2.5 w-full max-w-md">
                {cards.map((c, i) => (
                    <button
                        key={i}
                        onClick={() => onSuggest(c.q)}
                        className="wcard text-left p-4 rounded-xl transition-all hover:scale-[1.02]"
                        style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border)' }}
                    >
                        <span className="text-xl mb-2 block">{c.icon}</span>
                        <span className="text-xs leading-snug font-medium" style={{ color: 'var(--text-2)' }}>{c.q}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

/* ──── Main component ──── */
export default function ChatInterface({ initialQuery, onQuerySent }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [latestBot, setLatestBot] = useState(-1);
    const endRef = useRef();
    const inputRef = useRef();
    const barRef = useRef();
    const sentRef = useRef(false);  // Guard against double-send

    useEffect(() => {
        gsap.from(barRef.current, { y: 50, opacity: 0, duration: 0.7, ease: 'power3.out', delay: 0.3 });
    }, []);

    useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

    useEffect(() => {
        if (initialQuery && !sentRef.current) {
            sentRef.current = true;
            doSend(initialQuery);
        }
    }, [initialQuery]);

    const doSend = useCallback(async (text) => {
        const q = text.trim();
        if (!q || loading) return;

        setMessages(prev => {
            const withUser = [...prev, { role: 'user', content: q }];
            return withUser;
        });
        setInput('');
        if (inputRef.current) inputRef.current.style.height = '36px';
        setLoading(true);
        onQuerySent?.(q);

        try {
            const res = await axios.post('http://localhost:8000/query', null, { params: { query: q, student_id: 123 } });
            const answer = res.data.response;
            setMessages(prev => {
                const all = [...prev, { role: 'bot', content: answer }];
                setLatestBot(all.length - 1);
                return all;
            });
        } catch (err) {
            const errMsg = err.response
                ? `⚠️ Server error (${err.response.status}): ${err.response.data?.detail || 'Unknown error'}`
                : '⚠️ Cannot reach the backend at localhost:8000. Is it running?';
            setMessages(prev => {
                const all = [...prev, { role: 'bot', content: errMsg }];
                setLatestBot(all.length - 1);
                return all;
            });
        } finally {
            setLoading(false);
            sentRef.current = false;
        }
    }, [loading, onQuerySent]);

    const handleSend = () => doSend(input);

    return (
        <div className="flex flex-col h-full w-full relative">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto scroll px-6 py-6 space-y-5">
                {messages.length === 0 && !loading
                    ? <Welcome onSuggest={doSend} />
                    : <>
                        {messages.map((m, i) => <Bubble key={i} msg={m} isLatest={i === latestBot && m.role === 'bot'} />)}
                        <AnimatePresence>{loading && <ThinkingBubble />}</AnimatePresence>
                    </>
                }
                <div ref={endRef} />
            </div>

            {/* Input */}
            <div ref={barRef} className="px-5 pb-5 pt-2 flex-shrink-0">
                <div className={`rounded-2xl transition-all duration-300 ${loading ? 'ai-glow' : ''}`}
                    style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border)' }}>
                    <div className="flex items-end gap-2 p-2.5">
                        <textarea
                            ref={inputRef}
                            rows={1}
                            value={input}
                            onChange={e => {
                                setInput(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = Math.min(e.target.scrollHeight, 110) + 'px';
                            }}
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                            placeholder={loading ? 'Processing your query…' : 'Ask anything about Sahyadri — faculty, courses, departments…'}
                            disabled={loading}
                            className="chat-input flex-1 py-2 px-2 max-h-[110px] scroll"
                            style={{ height: '36px' }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                            className="send-btn w-9 h-9 shrink-0"
                        >
                            {loading
                                ? <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(255,255,255,.15)', borderTopColor: 'rgba(255,255,255,.8)' }} />
                                : <Send size={15} />
                            }
                        </button>
                    </div>
                    <div className="flex items-center justify-between px-4 pb-2.5 pt-0.5">
                        <span className="text-[10px]" style={{ color: 'var(--text-3)' }}>Enter to send · Shift+Enter for newline</span>
                        <div className="flex items-center gap-1">
                            <Zap size={9} style={{ color: 'var(--emerald)' }} />
                            <span className="text-[10px]" style={{ color: 'var(--text-3)' }}>Rule-based SQL + Gemini AI</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
