import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../auth'
import DatePicker from '../components/DatePicker'

export default function CreateStory() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: '', album_link: '', story_date: '' })

  if (user === undefined) return null // auth loading
  if (!user) {
    return (
      <div className="mx-auto w-full max-w-md text-center py-24">
        <p className="text-ink-700 mb-6">You need to be logged in to create a story.</p>
        <Link to="/login" className="btn-primary px-8 py-4">Log in</Link>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const story = await api.createStory(form)
      navigate(`/s/${story.id}`, { state: { isOwner: true } })
    } catch {
      alert('Failed to create story. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-8">
        <div className="kicker">New story</div>
        <h1 className="h2 mt-1">Create a timeline for your memories.</h1>
        <p className="mt-2 text-ink-700">Takes under a minute. Share the link immediately after.</p>
      </div>

      <div className="card p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-ink-800 mb-2">Story title</label>
            <input
              type="text"
              required
              placeholder="Summer Trip 2024"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-800 mb-2">
              Google Photos album link <span className="text-ink-500">(optional)</span>
            </label>
            <input
              type="url"
              placeholder="https://photos.app.goo.gl/..."
              value={form.album_link}
              onChange={(e) => setForm({ ...form, album_link: e.target.value })}
              className="input"
            />
            <p className="mt-2 text-sm text-ink-600">Make sure your album is set to public.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-800 mb-2">
              Story date <span className="text-ink-500">(optional)</span>
            </label>
            <DatePicker
              value={form.story_date}
              onChange={(story_date) => setForm({ ...form, story_date })}
              placeholder="Select a date"
            />
            <p className="mt-2 text-sm text-ink-600">Leave empty to use today's date.</p>
          </div>

          <div className="pt-2">
            <button type="submit" disabled={loading} className="btn-primary w-full px-8 py-4 text-base">
              {loading ? 'Creating...' : 'Create story'}
            </button>
          </div>
        </form>
      </div>

      <button onClick={() => navigate('/')} className="mt-6 btn-ghost w-full px-6 py-3">
        ← Back to home
      </button>
    </div>
  )
}
