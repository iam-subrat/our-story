import { useState } from 'react'
import { api } from '../api'

export default function PhotoUploadModal({ storyId, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [form, setForm] = useState({
    file: null,
    caption: '',
    uploaded_by: ''
  })

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }
      setForm({ ...form, file })
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.file) return

    setLoading(true)
    try {
      await api.uploadPhoto(storyId, form.file, form.caption, form.uploaded_by)
      onSuccess()
    } catch (error) {
      alert('Failed to upload photo. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-t-3xl md:rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Add Photo</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Photo
            </label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={handleFileChange}
              className="w-full"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-4 w-full h-64 object-cover rounded-lg"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Caption (Optional)
            </label>
            <textarea
              placeholder="Add a caption..."
              value={form.caption}
              onChange={(e) => setForm({ ...form, caption: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
              rows="3"
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
              value={form.uploaded_by}
              onChange={(e) => setForm({ ...form, uploaded_by: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !form.file}
            className="w-full bg-primary text-white py-4 rounded-full font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Uploading...' : 'Add to Story'}
          </button>
        </form>
      </div>
    </div>
  )
}
