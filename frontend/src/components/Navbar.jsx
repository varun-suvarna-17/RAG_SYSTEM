import { useEffect, useRef } from 'react';
import { BrainCircuit, Bell, ChevronDown } from 'lucide-react';
import gsap from 'gsap';

export default function Navbar() {
    const ref = useRef();
    useEffect(() => {
        gsap.from(ref.current.children, {
            y: -20, opacity: 0, stagger: 0.06, duration: 0.6, ease: 'power3.out', delay: 0.1
        });
    }, []);

    return (
        <nav className="glass fixed top-0 inset-x-0 z-50 h-14 flex items-center px-5 gap-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div ref={ref} className="flex items-center gap-4 w-full">
                {/* Logo */}
                <div className="flex items-center gap-2.5 flex-shrink-0">
                    <div className="relative w-8 h-8">
                        <div className="absolute inset-0 rounded-xl blur-md opacity-60" style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)' }}></div>
                        <div className="relative w-8 h-8 rounded-xl flex items-center justify-center ring-1 ring-white/10" style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)' }}>
                            <BrainCircuit size={16} className="text-white" />
                        </div>
                    </div>
                    <div>
                        <p className="font-bold text-sm grad leading-none">Sahyadri RAG</p>
                        <p className="text-[10px] leading-none mt-0.5" style={{ color: 'var(--text-3)' }}>AI Knowledge System</p>
                    </div>
                </div>

                {/* Status pill */}
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full mx-auto" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--emerald)', boxShadow: '0 0 6px #10b981' }}></div>
                    <span className="text-[11px] font-semibold" style={{ color: 'var(--emerald)' }}>System Online</span>
                </div>

                {/* Right */}
                <div className="flex items-center gap-2 ml-auto">
                    <button className="w-8 h-8 rounded-lg glass flex items-center justify-center transition-colors hover:border-violet-500/30" style={{ color: 'var(--text-3)' }}>
                        <Bell size={14} />
                    </button>
                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl cursor-pointer transition-all hover:bg-white/5" style={{ border: '1px solid var(--border)' }}>
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)' }}>S</div>
                        <span className="text-xs font-medium hidden sm:block" style={{ color: 'var(--text-2)' }}>Student</span>
                        <ChevronDown size={12} style={{ color: 'var(--text-3)' }} />
                    </div>
                </div>
            </div>
        </nav>
    );
}
