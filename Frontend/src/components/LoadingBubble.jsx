import { HiSparkles } from 'react-icons/hi2'

export default function LoadingBubble() {
  return (
    <div className="flex gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D6FF3F]/15">
        <HiSparkles className="animate-pulse text-[#D6FF3F]" />
      </div>
      <div className="glass-card flex items-center gap-2 px-5 py-4">
        <span className="h-2 w-2 animate-bounce rounded-full bg-[#D6FF3F] [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-[#A3E635] [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-[#D6FF3F]" />
        <span className="ml-2 text-sm text-[#9CA38A]">void.ai is thinking…</span>
      </div>
    </div>
  )
}
