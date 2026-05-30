// Field configs match FastAPI Pydantic models on the backend
const FORM_CONFIGS = {
  department: {
    title: 'Add Department',
    subtitle: 'Register a new department in the college database.',
    endpoint: '/api/admin/add/department',
    fields: [
      { name: 'name', label: 'Department Name', type: 'text', required: true },
      { name: 'hod_name', label: 'HOD Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
    ],
  },
  course: {
    title: 'Add Course',
    subtitle: 'Add a course linked to a department.',
    endpoint: '/api/admin/add/course',
    fields: [
      { name: 'dept_id', label: 'Department ID', type: 'number', required: true },
      { name: 'course_name', label: 'Course Name', type: 'text', required: true },
      { name: 'course_code', label: 'Course Code', type: 'text', required: true },
      { name: 'credits', label: 'Credits', type: 'number', required: true },
      { name: 'semester', label: 'Semester', type: 'number', required: true },
    ],
  },
  faculty: {
    title: 'Add Faculty',
    subtitle: 'Add faculty member details.',
    endpoint: '/api/admin/add/faculty',
    fields: [
      { name: 'dept_id', label: 'Department ID', type: 'number', required: true },
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'designation', label: 'Designation', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'specialization', label: 'Specialization', type: 'text', required: true },
    ],
  },
  fee: {
    title: 'Add Fee',
    subtitle: 'Record fee structure for a department.',
    endpoint: '/api/admin/add/fee',
    fields: [
      { name: 'dept_id', label: 'Department ID', type: 'number', required: true },
      { name: 'year', label: 'Year', type: 'number', required: true },
      { name: 'amount', label: 'Amount', type: 'number', step: '0.01', required: true },
      { name: 'due_date', label: 'Due Date', type: 'date', required: true },
    ],
  },
  notice: {
    title: 'Add Notice',
    subtitle: 'Publish a new college notice.',
    endpoint: '/api/admin/add/notice',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'content', label: 'Content', type: 'textarea', required: true },
      {
        name: 'category',
        label: 'Category',
        type: 'select',
        options: ['exam', 'event', 'holiday'],
        required: true,
      },
      { name: 'posted_on', label: 'Posted On', type: 'date', required: true },
    ],
  },
  student: {
    title: 'Add Student',
    subtitle: 'Enroll a new student record.',
    endpoint: '/api/admin/add/student',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'roll_number', label: 'Roll Number', type: 'text', required: true },
      { name: 'dept_id', label: 'Department ID', type: 'number', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'year', label: 'Year', type: 'number', required: true },
    ],
  },
}

export default function AdminForm({ section, onSubmit, loading }) {
  const config = FORM_CONFIGS[section]
  if (!config) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const payload = {}

    config.fields.forEach((field) => {
      let value = formData.get(field.name)
      if (field.type === 'number') {
        value = value === '' ? '' : Number(value)
      }
      payload[field.name] = value
    })

    onSubmit(config.endpoint, payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#F5F5E8]">{config.title}</h2>
        <p className="mt-1 text-sm text-[#9CA38A]">{config.subtitle}</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {config.fields.map((field) => (
          <div key={field.name} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-[#9CA38A]">
              {field.label}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                name={field.name}
                required={field.required}
                rows={4}
                className="input-textarea resize-y"
              />
            ) : field.type === 'select' ? (
              <select name={field.name} required={field.required} className="input-field">
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name}
                step={field.step}
                required={field.required}
                className="input-field"
              />
            )}
          </div>
        ))}
      </div>

      <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
        {loading ? 'Saving…' : 'Submit'}
      </button>
    </form>
  )
}

export { FORM_CONFIGS }
