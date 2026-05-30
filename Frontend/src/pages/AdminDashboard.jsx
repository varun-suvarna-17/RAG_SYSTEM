import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import useAuthStore from '../store/authStore'
import Sidebar from '../components/Sidebar'
import GlassCard from '../components/GlassCard'
import AdminForm from '../components/AdminForm'
import {
  HiOutlineBuildingOffice2,
  HiOutlineBookOpen,
  HiOutlineUserGroup,
  HiOutlineCurrencyDollar,
  HiOutlineMegaphone,
  HiOutlineAcademicCap,
  HiOutlineTableCells,
  HiOutlineArrowPath,
} from 'react-icons/hi2'

const ADMIN_SECTIONS = [
  { id: 'department', label: 'Add Department', icon: HiOutlineBuildingOffice2 },
  { id: 'course', label: 'Add Course', icon: HiOutlineBookOpen },
  { id: 'faculty', label: 'Add Faculty', icon: HiOutlineUserGroup },
  { id: 'fee', label: 'Add Fee', icon: HiOutlineCurrencyDollar },
  { id: 'notice', label: 'Add Notice', icon: HiOutlineMegaphone },
  { id: 'student', label: 'Add Student', icon: HiOutlineAcademicCap },
  { id: 'view', label: 'View Data', icon: HiOutlineTableCells },
  { id: 'rebuild', label: 'Rebuild Index', icon: HiOutlineArrowPath },
]

const TABLE_OPTIONS = [
  'departments',
  'courses',
  'faculty',
  'fees',
  'notices',
  'students',
  'conversations',
  'audit_logs',
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuthStore()

  const [activeSection, setActiveSection] = useState('department')
  const [formLoading, setFormLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const [selectedTable, setSelectedTable] = useState('departments')
  const [tableData, setTableData] = useState([])
  const [tableLoading, setTableLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const handleFormSubmit = async (endpoint, payload) => {
    setFormLoading(true)
    try {
      const { data } = await api.post(endpoint, payload)
      showToast(data.message || 'Saved successfully')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setFormLoading(false)
    }
  }

  const fetchTableData = async () => {
    setTableLoading(true)
    setTableData([])
    try {
      const { data } = await api.get(`/api/admin/data/${selectedTable}`)
      setTableData(data.data || [])
      showToast(`Loaded ${data.count ?? 0} rows from ${selectedTable}`)
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setTableLoading(false)
    }
  }

  const handleRebuildIndex = async () => {
    setFormLoading(true)
    try {
      const { data } = await api.post('/api/admin/rebuild-index')
      showToast(data.message || 'Index rebuilt')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setFormLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  if (!isAuthenticated) return null

  const columns = tableData.length > 0 ? Object.keys(tableData[0]) : []
  const activeLabel = ADMIN_SECTIONS.find((s) => s.id === activeSection)?.label

  return (
    <div className="void-grid-bg flex h-screen p-2 sm:p-4">
      {toast && (
        <div
          className={`fixed right-4 top-4 z-50 max-w-sm px-5 py-3 text-sm shadow-lg ${
            toast.type === 'error' ? 'toast-error' : 'toast-success'
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="void-panel flex min-h-0 w-full flex-1 overflow-hidden">
        <div className="hidden shrink-0 lg:block">
          <Sidebar
            adminMode
            adminSections={ADMIN_SECTIONS}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            onLogout={handleLogout}
          />
        </div>

        <main className="custom-scrollbar flex-1 overflow-auto p-5 sm:p-8">
          <div className="mb-6 lg:hidden">
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-[#9CA38A]">
              Section
            </label>
            <select
              value={activeSection}
              onChange={(e) => setActiveSection(e.target.value)}
              className="input-field"
            >
              {ADMIN_SECTIONS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <button type="button" onClick={handleLogout} className="btn-ghost mt-3 w-full text-red-400">
              Logout
            </button>
          </div>

          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B7C2A]">
              Admin Dashboard
            </p>
            <h1 className="mt-1 text-2xl font-bold text-[#F5F5E8] sm:text-3xl">{activeLabel}</h1>
          </div>

          <GlassCard>
            {['department', 'course', 'faculty', 'fee', 'notice', 'student'].includes(
              activeSection
            ) && (
              <AdminForm
                section={activeSection}
                onSubmit={handleFormSubmit}
                loading={formLoading}
              />
            )}

            {activeSection === 'view' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#F5F5E8]">View Data</h2>
                  <p className="mt-1 text-sm text-[#9CA38A]">
                    Browse records from any college data table.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <select
                    value={selectedTable}
                    onChange={(e) => setSelectedTable(e.target.value)}
                    className="input-field sm:max-w-xs"
                  >
                    {TABLE_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={fetchTableData}
                    disabled={tableLoading}
                    className="btn-primary disabled:opacity-50"
                  >
                    {tableLoading ? 'Loading…' : 'Fetch Data'}
                  </button>
                </div>

                <p className="text-xs text-[#6B7C2A]">
                  Note: &quot;conversations&quot; may require a backend allow-list update.
                </p>

                {columns.length > 0 && (
                  <div className="table-shell custom-scrollbar max-h-[480px] overflow-auto">
                    <table className="w-full min-w-[600px] text-left text-sm">
                      <thead>
                        <tr>
                          {columns.map((col) => (
                            <th
                              key={col}
                              className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#D6FF3F]"
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.map((row, i) => (
                          <tr key={row.id ?? i} className="border-t border-[rgba(214,255,63,0.08)]">
                            {columns.map((col) => (
                              <td
                                key={col}
                                className="max-w-[220px] truncate px-4 py-3 text-[#9CA38A]"
                              >
                                {row[col] == null ? '—' : String(row[col])}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeSection === 'rebuild' && (
              <div className="space-y-6">
                <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#D6FF3F]/12 ring-1 ring-[#D6FF3F]/20">
                    <HiOutlineArrowPath className="text-2xl text-[#D6FF3F]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#F5F5E8]">Rebuild FAISS Index</h2>
                  <p className="mt-2 max-w-lg text-sm text-[#9CA38A]">
                    Re-embed all college data into the vector store after adding or updating records.
                    This ensures accurate retrieval for student queries.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRebuildIndex}
                  disabled={formLoading}
                  className="btn-primary disabled:opacity-50"
                >
                  {formLoading ? 'Rebuilding…' : 'Rebuild Index'}
                </button>
              </div>
            )}
          </GlassCard>
        </main>
      </div>
    </div>
  )
}
