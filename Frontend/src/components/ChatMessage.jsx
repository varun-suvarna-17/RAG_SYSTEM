import { HiUser, HiSparkles } from 'react-icons/hi2'

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? 'bg-[#D6FF3F]/15 text-[#D6FF3F]'
            : 'bg-[#A3E635]/15 text-[#A3E635]'
        }`}
      >
        {isUser ? <HiUser /> : <HiSparkles />}
      </div>
      <div
        className={`max-w-[85%] rounded-[24px] px-5 py-4 text-sm leading-relaxed sm:max-w-[75%] ${
          isUser
            ? 'border border-[#D6FF3F]/20 bg-[#D6FF3F]/8 text-[#F5F5E8]'
            : 'glass-card border border-[rgba(214,255,63,0.12)] py-4'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>

        {!isUser && message.meta && (
          <details className="mt-3 border-t border-[rgba(214,255,63,0.1)] pt-3">
            <summary className="cursor-pointer text-xs text-[#9CA38A] transition hover:text-[#D6FF3F]">
              View context & metadata
            </summary>
            <div className="mt-2 space-y-2 text-xs text-[#9CA38A]">
              {message.meta.model && (
                <p>
                  Model: <span className="text-[#D6FF3F]">{message.meta.model}</span>
                </p>
              )}
              {message.meta.top_score != null && (
                <p>Top score: {message.meta.top_score.toFixed(4)}</p>
              )}
              {message.meta.is_relevant === false && (
                <p className="text-amber-400">Low relevance — answer may be uncertain.</p>
              )}
              {message.meta.context?.length > 0 && (
                <ul className="custom-scrollbar mt-2 max-h-40 list-inside list-disc overflow-y-auto">
                  {message.meta.context.map((chunk, i) => (
                    <li key={i} className="mb-1">
                      {typeof chunk === 'string'
                        ? chunk.slice(0, 200) + (chunk.length > 200 ? '…' : '')
                        : chunk.text?.slice(0, 200) || JSON.stringify(chunk).slice(0, 200)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  )
}
