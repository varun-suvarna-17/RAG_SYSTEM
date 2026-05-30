import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import useChatStore from '../store/chatStore'
import Sidebar from '../components/Sidebar'
import ChatMessage from '../components/ChatMessage'
import ChatInput from '../components/ChatInput'
import LoadingBubble from '../components/LoadingBubble'
import { HiSparkles } from 'react-icons/hi2'

const SUGGESTIONS = [
  'Who is the HOD of AIML?',
  'List AIML 4th sem courses',
  'Who teaches DBMS?',
  'Show recent notices',
]

export default function ChatPage() {
  const messagesEndRef = useRef(null)
  const orbRef = useRef(null)
  const {
    messages,
    isLoading,
    error,
    sessionId,
    addMessage,
    setLoading,
    setError,
    setSessionId,
    newSession,
  } = useChatStore()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSend = async (question) => {
    setError(null)
    addMessage({ role: 'user', content: question })
    setLoading(true)

    try {
      const { data } = await api.post('/api/query', {
        question,
        top_k: 3,
      })

      addMessage({
        role: 'assistant',
        content: data.answer,
        meta: {
          context: data.context,
          top_score: data.top_score,
          is_relevant: data.is_relevant,
          model: data.model,
          tokens_used: data.tokens_used,
        },
      })

      // Persist conversation after a successful RAG response
      try {
        const saveRes = await api.post('/api/conversation/save', {
          question: data.question,
          answer: data.answer,
          top_score: data.top_score,
          model_used: data.model,
          tokens_used: data.tokens_used,
          session_id: sessionId || undefined,
        })
        if (saveRes.data?.session_id) {
          setSessionId(saveRes.data.session_id)
        }
      } catch (saveErr) {
        console.warn('Could not save conversation:', saveErr.message)
      }
    } catch (err) {
      const errMsg = err.message || 'Failed to get a response. Is the backend running?'
      setError(errMsg)
      addMessage({
        role: 'assistant',
        content: `Sorry, something went wrong: ${errMsg}`,
      })
    } finally {
      setLoading(false)
    }
  }

  const showEmptyState = messages.length === 0 && !isLoading

  return (
    <div className="void-grid-bg flex h-screen p-2 sm:p-4">
      <div className="void-panel flex min-h-0 w-full flex-1 overflow-hidden">
        <div className="hidden shrink-0 lg:block">
          <Sidebar onNewChat={newSession} />
        </div>

        {/* Mobile top bar */}
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-[rgba(214,255,63,0.08)] bg-[#11130C]/50 px-4 py-3 lg:hidden">
            <Link to="/" className="flex items-center gap-2">
              <HiSparkles className="text-[#D6FF3F]" />
              <span className="text-sm font-bold">void.ai</span>
            </Link>
            <div className="flex gap-2">
              <button type="button" onClick={newSession} className="btn-ghost px-3 py-1.5 text-xs">
                New
              </button>
              <Link to="/history" className="btn-ghost px-3 py-1.5 text-xs">
                History
              </Link>
            </div>
          </div>

          <div className="relative flex min-h-0 flex-1 flex-col">
            {/* Inner grid glow */}
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(214,255,63,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(214,255,63,0.03) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-[#D6FF3F]/8 blur-3xl"
              aria-hidden
            />

            <div className="custom-scrollbar relative flex-1 overflow-y-auto px-4 py-6 sm:px-8">
              <div className="mx-auto max-w-3xl">
                {showEmptyState && (
                  <div className="flex flex-col items-center py-8 text-center sm:py-16">
                    <div ref={orbRef} className="orb-glow relative mb-6 h-24 w-24 sm:h-28 sm:w-28">
                      <div className="glow-orb-core absolute inset-0 rounded-full" />
                      <div className="absolute inset-3 rounded-full bg-[#D6FF3F]/15 blur-xl" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#F5F5E8] sm:text-3xl">
                      Welcome back!
                    </h1>
                    <p className="mt-2 max-w-md text-sm text-[#9CA38A]">
                      Ask anything about departments, courses, faculty, fees, and notices.
                    </p>
                  </div>
                )}

                <div className="space-y-6">
                  {messages.map((msg, i) => (
                    <ChatMessage key={i} message={msg} />
                  ))}
                  {isLoading && <LoadingBubble />}
                  {error && messages.length > 0 && (
                    <p className="text-center text-xs text-red-400">{error}</p>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>

            <ChatInput
              onSend={handleSend}
              disabled={isLoading}
              suggestions={SUGGESTIONS}
              showSuggestions={showEmptyState}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
