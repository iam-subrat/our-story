import { useState } from 'react'
import { api } from '../api'
import Spinner from './Spinner'

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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/50 p-4 md:items-center">
      <div className="w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white/85 shadow-lift backdrop-blur-xl md:rounded-3xl max-h-[90vh] ring-1 ring-white/50">
        <div className="sticky top-0 flex items-center justify-between border-b border-black/5 bg-white/60 px-6 py-4 backdrop-blur-xl">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-950">
            Add a memory
          </h2>
          <button onClick={onClose} className="btn-soft px-5 py-2.5">
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-ink-800 mb-2">Photo</label>
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
                className="mt-4 w-full h-64 object-cover rounded-2xl ring-1 ring-black/10"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-800 mb-2">
              Caption <span className="text-ink-500">(optional)</span>
            </label>
            <textarea
              placeholder="Add a caption..."
              value={form.caption}
              onChange={(e) => setForm({ ...form, caption: e.target.value })}
              className="textarea"
              rows="3"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-800 mb-2">Your name</label>
            <input
              type="text"
              required
              placeholder="John Doe"
              value={form.uploaded_by}
              onChange={(e) => setForm({ ...form, uploaded_by: e.target.value })}
              className="input"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !form.file}
            className="btn-primary w-full px-8 py-4 text-base disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner /> Uploading…
              </span>
            ) : (
              'Add to Story'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
