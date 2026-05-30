import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import useChatStore from '../store/chatStore'
import Sidebar from '../components/Sidebar'
import GlassCard from '../components/GlassCard'
import { HiOutlineChatBubbleLeftRight, HiOutlineArrowLeft } from 'react-icons/hi2'

export default function ConversationHistory() {
  const navigate = useNavigate()
  const newSession = useChatStore((s) => s.newSession)
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/api/conversation/history')
        setConversations(data.conversations || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  const formatDate = (value) => {
    if (!value) return '—'
    try {
      return new Date(value).toLocaleString()
    } catch {
      return String(value)
    }
  }

  return (
    <div className="void-grid-bg flex h-screen p-2 sm:p-4">
      <div className="void-panel flex min-h-0 w-full flex-1 overflow-hidden">
        <div className="hidden shrink-0 lg:block">
          <Sidebar
            onNewChat={() => {
              newSession()
              navigate('/chat')
            }}
          />
        </div>

        <main className="custom-scrollbar flex-1 overflow-auto p-5 sm:p-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#6B7C2A]">
                History
              </p>
              <h1 className="mt-1 text-2xl font-bold text-[#F5F5E8] sm:text-3xl">
                Conversation History
              </h1>
              <p className="mt-1 text-sm text-[#9CA38A]">Your past questions and AI answers</p>
            </div>
            <Link to="/chat" className="btn-primary w-fit">
              <HiOutlineArrowLeft />
              Back to Chat
            </Link>
          </div>

          {loading && (
            <p className="text-center text-[#9CA38A]">Loading history…</p>
          )}

          {error && (
            <GlassCard className="border-red-500/30 text-red-400">{error}</GlassCard>
          )}

          {!loading && !error && conversations.length === 0 && (
            <GlassCard className="text-center">
              <HiOutlineChatBubbleLeftRight className="mx-auto mb-4 text-5xl text-[#D6FF3F]/40" />
              <p className="text-[#F5F5E8]">No conversations yet</p>
              <p className="mt-2 text-sm text-[#9CA38A]">
                Start chatting to see history here.
              </p>
              <Link to="/chat" className="btn-primary mt-6 inline-flex">
                Go to Chat
              </Link>
            </GlassCard>
          )}

          <div className="space-y-4">
            {conversations.map((convo, i) => (
              <GlassCard key={convo.id ?? i} className="glow-border">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs text-[#9CA38A]">
                  <span className="rounded-full bg-[#D6FF3F]/8 px-3 py-1 text-[#D6FF3F]">
                    {formatDate(convo.asked_at || convo.created_at)}
                  </span>
                  {convo.session_id && (
                    <span className="rounded-full bg-[#050605] px-3 py-1">
                      Session: {String(convo.session_id).slice(0, 8)}…
                    </span>
                  )}
                </div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#6B7C2A]">
                  Question
                </p>
                <p className="mb-4 text-[#F5F5E8]">{convo.question}</p>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#D6FF3F]">
                  Answer
                </p>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#9CA38A]">
                  {convo.answer}
                </p>
                {(convo.model_used || convo.top_score != null) && (
                  <p className="mt-4 border-t border-[rgba(214,255,63,0.1)] pt-3 text-xs text-[#6B7C2A]">
                    {convo.model_used && <>Model: {convo.model_used} · </>}
                    {convo.top_score != null && <>Score: {Number(convo.top_score).toFixed(4)}</>}
                  </p>
                )}
              </GlassCard>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
