import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

export default function CreateStory() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    creator_name: '',
    album_link: '',
    story_date: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const story = await api.createStory(form)
      navigate(`/s/${story.id}`, { state: { showUserLink: true, creatorName: form.creator_name } })
    } catch (error) {
      alert('Failed to create story. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Your Story</h1>
          <p className="text-gray-600">Share your memories in under 30 seconds</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Story Title
              </label>
              <input
                type="text"
                required
                placeholder="Summer Trip 2024"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={form.creator_name}
                onChange={(e) => setForm({ ...form, creator_name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
              <p className="text-sm text-gray-500 mt-2">
                💡 Use the same name for all your stories to see them together in your timeline
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Google Photos Album Link (Optional)
              </label>
              <input
                type="url"
                placeholder="https://photos.app.goo.gl/..."
                value={form.album_link}
                onChange={(e) => setForm({ ...form, album_link: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
              <p className="text-sm text-gray-500 mt-2">
                Make sure your album is set to public
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Story Date (Optional)
              </label>
              <input
                type="date"
                value={form.story_date}
                onChange={(e) => setForm({ ...form, story_date: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
              <p className="text-sm text-gray-500 mt-2">
                Leave empty to use today's date
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-full font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Story'}
            </button>
          </form>
        </div>

        <button
          onClick={() => navigate('/')}
          className="mt-6 text-gray-600 hover:text-gray-900 flex items-center justify-center w-full"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  )
}
