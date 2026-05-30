import { Link, useLocation } from 'react-router-dom'
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineClock,
  HiOutlineHome,
  HiOutlineArrowLeftOnRectangle,
  HiOutlineMagnifyingGlass,
  HiSparkles,
} from 'react-icons/hi2'

const navItems = [
  { to: '/chat', label: 'New Chat', icon: HiOutlineChatBubbleLeftRight, action: 'newChat' },
  { to: '/history', label: 'History', icon: HiOutlineClock },
  { to: '/', label: 'Home', icon: HiOutlineHome },
]

export default function Sidebar({
  onNewChat,
  onLogout,
  adminMode = false,
  adminSections = [],
  activeSection,
  onSectionChange,
}) {
  const location = useLocation()

  if (adminMode) {
    return (
      <aside className="flex h-full w-full flex-col bg-[#11130C] p-5 lg:w-[260px] lg:rounded-r-[32px]">
        <Link to="/" className="mb-6 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D6FF3F]/15">
            <HiSparkles className="text-lg text-[#D6FF3F]" />
          </span>
          <div>
            <span className="block text-sm font-bold text-[#F5F5E8]">void.ai</span>
            <span className="block text-[10px] text-[#6B7C2A]">Admin Panel</span>
          </div>
        </Link>

        <nav className="custom-scrollbar flex flex-1 flex-col gap-1.5 overflow-y-auto">
          {adminSections.map((section) => {
            const isActive = activeSection === section.id
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => onSectionChange(section.id)}
                className={`nav-pill ${isActive ? 'nav-pill-active' : 'nav-pill-inactive'}`}
              >
                <section.icon className="shrink-0 text-base" />
                {section.label}
              </button>
            )
          })}
        </nav>

        <button
          type="button"
          onClick={onLogout}
          className="nav-pill mt-4 border border-red-500/20 text-red-400 hover:bg-red-500/10"
        >
          <HiOutlineArrowLeftOnRectangle className="text-base" />
          Logout
        </button>
      </aside>
    )
  }

  return (
    <aside className="flex h-full w-full flex-col bg-[#11130C] p-5 lg:w-[260px] lg:rounded-r-[32px]">
      <Link to="/" className="mb-5 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D6FF3F]/15">
          <HiSparkles className="text-lg text-[#D6FF3F]" />
        </span>
        <div>
          <span className="block text-sm font-bold text-[#F5F5E8]">void.ai</span>
          <span className="block text-[10px] text-[#6B7C2A]">College RAG Assistant</span>
        </div>
      </Link>

      <div className="relative mb-5">
        <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7C2A]" />
        <input
          type="text"
          placeholder="Search chats…"
          className="input-field pl-10 text-xs"
          readOnly
          aria-label="Search chats"
        />
      </div>

      <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-[#6B7C2A]">
        Menu
      </p>

      <nav className="flex flex-col gap-1.5">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.to && item.action !== 'newChat'

          if (item.action === 'newChat') {
            return (
              <button
                key={item.label}
                type="button"
                onClick={onNewChat}
                className="nav-pill nav-pill-inactive"
              >
                <Icon className="text-base" />
                {item.label}
              </button>
            )
          }

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-pill ${isActive ? 'nav-pill-active' : 'nav-pill-inactive'}`}
            >
              <Icon className="text-base" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
