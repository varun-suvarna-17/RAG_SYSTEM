import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineServerStack,
  HiOutlineMagnifyingGlassCircle,
  HiOutlineClock,
  HiSparkles,
  HiArrowRight,
} from 'react-icons/hi2'
import Navbar from '../components/Navbar'
import GlassCard from '../components/GlassCard'

const features = [
  {
    icon: HiOutlineChatBubbleLeftRight,
    title: 'Student Chat',
    desc: 'Ask natural-language questions and get RAG-powered answers instantly.',
  },
  {
    icon: HiOutlineServerStack,
    title: 'Admin Management',
    desc: 'Manage departments, courses, faculty, fees, notices, and students.',
  },
  {
    icon: HiOutlineMagnifyingGlassCircle,
    title: 'Smart Retrieval',
    desc: 'FAISS vector search finds the most relevant college data for every query.',
  },
  {
    icon: HiOutlineClock,
    title: 'Conversation History',
    desc: 'Review past questions and answers stored securely in the database.',
  },
]

export default function LandingPage() {
  const heroRef = useRef(null)
  const orbRef = useRef(null)
  const panelRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(panelRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      })

      gsap.from(heroRef.current?.children || [], {
        y: 36,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        delay: 0.15,
        ease: 'power3.out',
      })

      gsap.to(orbRef.current, {
        y: -14,
        scale: 1.08,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      gsap.from(cardsRef.current.filter(Boolean), {
        y: 24,
        opacity: 0,
        duration: 0.65,
        stagger: 0.08,
        delay: 0.5,
        ease: 'power2.out',
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="void-grid-bg min-h-screen pb-12">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
        <div ref={panelRef} className="void-panel relative overflow-hidden p-8 sm:p-12">
          {/* Glow blobs */}
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#D6FF3F]/10 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-[#A3E635]/8 blur-3xl"
            aria-hidden
          />

          <section ref={heroRef} className="relative z-10 text-center">
            {/* Glowing orb */}
            <div className="mb-8 flex justify-center">
              <div ref={orbRef} className="orb-glow relative h-28 w-28 sm:h-36 sm:w-36">
                <div className="glow-orb-core absolute inset-0 rounded-full" />
                <div className="absolute inset-4 rounded-full bg-[#D6FF3F]/20 blur-xl" />
                <HiSparkles className="absolute inset-0 m-auto text-3xl text-[#080A05] sm:text-4xl" />
              </div>
            </div>

            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#6B7C2A]">
              College RAG Assistant
            </p>
            <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-[#F5F5E8] sm:text-5xl">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-[#D6FF3F] to-[#A3E635] bg-clip-text text-transparent">
                void.ai
              </span>
            </h1>
            <p className="mx-auto max-w-lg text-base text-[#9CA38A] sm:text-lg">
              Ask anything about your college data.
            </p>

            {/* CTA input-style bar */}
            <div className="mx-auto mt-10 max-w-xl">
              <div className="chat-input-bar mx-auto">
                <span className="text-sm text-[#6B7C2A]">What would you like to know?</span>
                <Link to="/chat" className="btn-icon ml-auto" aria-label="Go to chat">
                  <HiArrowRight className="text-lg" />
                </Link>
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/chat" className="btn-primary min-w-[200px]">
                Ask void.ai
              </Link>
              <Link to="/admin/login" className="btn-ghost min-w-[200px]">
                Admin Panel
              </Link>
            </div>
          </section>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <GlassCard
                key={f.title}
                className="glow-border group"
                ref={(el) => {
                  cardsRef.current[i] = el
                }}
              >
                <div className="mb-4 inline-flex rounded-full bg-[#D6FF3F]/12 p-3.5 text-2xl text-[#D6FF3F] transition group-hover:scale-105 group-hover:shadow-[0_0_24px_rgba(214,255,63,0.2)]">
                  <Icon />
                </div>
                <h3 className="mb-2 text-base font-bold text-[#F5F5E8]">{f.title}</h3>
                <p className="text-sm leading-relaxed text-[#9CA38A]">{f.desc}</p>
              </GlassCard>
            )
          })}
        </section>
      </main>
    </div>
  )
}
