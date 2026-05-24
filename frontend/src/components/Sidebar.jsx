import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, BookOpen, Calendar, Hash, Lightbulb, Clock, Plus, Sparkles } from 'lucide-react';
import gsap from 'gsap';

const QUICK = [
    { icon: Users, label: 'Who is HOD of CS?', color: '#818cf8' },
    { icon: BookOpen, label: 'Courses in Semester 5', color: '#22d3ee' },
    { icon: Calendar, label: 'Exam schedule', color: '#34d399' },
    { icon: Lightbulb, label: 'Faculty contacts', color: '#f472b6' },
    { icon: Hash, label: 'Available courses', color: '#fbbf24' },
];

export default function Sidebar({ onSelectQuery, history }) {
    const ref = useRef();

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(ref.current, { x: -260, opacity: 0, duration: 0.7, ease: 'power3.out', delay: 0.15 });
            gsap.from('.sbtn-item', { x: -18, opacity: 0, stagger: 0.07, duration: 0.45, ease: 'power2.out', delay: 0.55 });
        });
        return () => ctx.revert();
    }, []);

    return (
        <aside ref={ref} className="fixed left-0 top-14 bottom-0 w-60 hidden lg:flex flex-col py-4 px-3 z-40 glass-dark" style={{ borderRight: '1px solid var(--border)' }}>
            {/* New chat */}
            <button
                onClick={() => window.location.reload()}
                className="sbtn-item flex items-center justify-center gap-2 py-2 px-4 mb-4 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110"
                style={{ background: 'linear-gradient(135deg,#4f46e5,#6d28d9)', boxShadow: '0 4px 12px rgba(99,102,241,.3)' }}
            >
                <Plus size={15} /> New Chat
            </button>

            <div className="flex-1 overflow-y-auto scroll space-y-0.5">
                <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-3)' }}>Quick Queries</p>

                {QUICK.map((item, i) => (
                    <motion.button
                        key={i}
                        className="sbtn sbtn-item w-full"
                        whileHover={{ x: 4 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        onClick={() => onSelectQuery(item.label)}
                    >
                        <item.icon size={14} style={{ color: item.color, flexShrink: 0 }} />
                        <span className="truncate">{item.label}</span>
                    </motion.button>
                ))}

                {history?.length > 0 && (
                    <div className="pt-4">
                        <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-3)' }}>Recent</p>
                        {history.slice(-6).reverse().map((q, i) => (
                            <button key={i} className="sbtn w-full" onClick={() => onSelectQuery(q)}>
                                <Clock size={12} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
                                <span className="truncate text-xs" style={{ color: 'var(--text-3)' }}>{q}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Tip */}
            <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="flex items-start gap-2.5 px-2 py-3 rounded-xl" style={{ background: 'rgba(99,102,241,.07)' }}>
                    <Sparkles size={13} className="mt-0.5 shrink-0" style={{ color: 'var(--violet-light)' }} />
                    <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-3)' }}>
                        Ask in plain English — abbreviations like CS, IS, EC are understood.
                    </p>
                </div>
            </div>
        </aside>
    );
}
