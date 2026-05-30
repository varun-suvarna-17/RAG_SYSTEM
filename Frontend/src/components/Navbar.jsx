import { Link } from 'react-router-dom'
import { HiSparkles } from 'react-icons/hi2'

export default function Navbar({ showLinks = true }) {
  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-[rgba(214,255,63,0.1)] bg-[#0D0F08]/90 px-5 py-3 backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D6FF3F]/15">
            <HiSparkles className="text-lg text-[#D6FF3F]" />
          </span>
          <div>
            <span className="block text-sm font-bold tracking-tight text-[#F5F5E8]">void.ai</span>
            <span className="block text-[10px] text-[#9CA38A]">College RAG Assistant</span>
          </div>
        </Link>
        {showLinks && (
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/chat" className="btn-ghost px-4 py-2 text-xs">
              Chat
            </Link>
            <Link to="/admin/login" className="btn-primary px-4 py-2 text-xs">
              Admin
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
