import { useState } from 'react'
import { HiPaperAirplane, HiOutlinePaperClip } from 'react-icons/hi2'

export default function ChatInput({ onSend, disabled, suggestions = [], showSuggestions = true }) {
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    send(text)
  }

  const send = (value) => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setText('')
  }

  return (
    <div className="px-4 pb-6 pt-2 sm:px-8">
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
        <div className="chat-input-bar">
          <HiOutlinePaperClip className="shrink-0 text-lg text-[#6B7C2A]" aria-hidden />
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ask void.ai anything about your college…"
            disabled={disabled}
            className="min-w-0 flex-1 border-none bg-transparent text-sm text-[#F5F5E8] outline-none placeholder:text-[#6B7C2A]"
          />
          <button
            type="submit"
            disabled={disabled || !text.trim()}
            className="btn-icon"
            aria-label="Send message"
          >
            <HiPaperAirplane className="text-lg" />
          </button>
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="mx-auto mt-4 grid max-w-3xl gap-3 sm:grid-cols-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              disabled={disabled}
              onClick={() => send(s)}
              className="suggestion-card disabled:cursor-not-allowed disabled:opacity-50"
            >
              <p className="text-sm font-medium text-[#F5F5E8]">{s}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
