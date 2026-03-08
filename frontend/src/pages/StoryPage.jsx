import { useState, useEffect } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { api } from '../api'
import PhotoUploadModal from '../components/PhotoUploadModal'
import AddCaptionModal from '../components/AddCaptionModal'
import Timeline from '../components/Timeline'
import ShareButtons from '../components/ShareButtons'

export default function StoryPage() {
  const { id } = useParams()
  const location = useLocation()
  const [story, setStory] = useState(null)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)
  const [showCaption, setShowCaption] = useState(false)
  const [editingAlbum, setEditingAlbum] = useState(false)
  const [albumLink, setAlbumLink] = useState('')
  const showUserLink = location.state?.showUserLink

  useEffect(() => {
    loadStory()
    loadPhotos()
  }, [id])

  const loadStory = async () => {
    try {
      const data = await api.getStory(id)
      setStory(data)
      setAlbumLink(data.album_link || '')
    } catch (error) {
      alert('Story not found')
    } finally {
      setLoading(false)
    }
  }

  const loadPhotos = async () => {
    try {
      const data = await api.getPhotos(id)
      setPhotos(data)
    } catch (error) {
      console.error('Failed to load photos')
    }
  }

  const handlePhotoUploaded = () => {
    loadPhotos()
    setShowUpload(false)
  }

  const handleUpdateAlbum = async () => {
    try {
      const updated = await api.updateStory(id, { album_link: albumLink })
      setStory(updated)
      setEditingAlbum(false)
    } catch (error) {
      alert('Failed to update album link')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Story not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{story.title}</h1>
          <Link
            to={`/user/${encodeURIComponent(story.creator_name)}`}
            className="text-gray-600 hover:text-primary hover:underline"
          >
            by {story.creator_name}
          </Link>
          {story.story_date && (
            <p className="text-gray-500 text-sm mt-1">
              {new Date(story.story_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* User Timeline Link */}
        {showUserLink && story && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-green-800 mb-2">✅ Story created successfully!</p>
            <Link
              to={`/user/${encodeURIComponent(story.creator_name)}`}
              className="text-primary hover:underline font-semibold"
            >
              View all stories by {story.creator_name} →
            </Link>
          </div>
        )}

        {/* Album Preview */}
        {editingAlbum ? (
          <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
            <h3 className="font-semibold text-lg mb-3">Edit Album Link</h3>
            <input
              type="url"
              placeholder="https://photos.app.goo.gl/..."
              value={albumLink}
              onChange={(e) => setAlbumLink(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none mb-3"
            />
            <div className="flex gap-3">
              <button
                onClick={handleUpdateAlbum}
                className="flex-1 bg-primary text-white py-2 rounded-full font-semibold hover:bg-indigo-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditingAlbum(false)
                  setAlbumLink(story.album_link || '')
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-full font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          story.album_link ? (
            <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">Memory Album</h3>
                <button
                  onClick={() => setEditingAlbum(true)}
                  className="text-sm text-primary hover:underline"
                >
                  Edit
                </button>
              </div>
              <a
                href={story.album_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-2"
              >
                View Full Album on Google Photos →
              </a>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
              <h3 className="font-semibold text-lg mb-3">Memory Album</h3>
              <button
                onClick={() => setEditingAlbum(true)}
                className="text-primary hover:underline font-semibold"
              >
                + Add Google Photos Album Link
              </button>
            </div>
          )
        )}

        {/* Share Buttons */}
        <ShareButtons storyId={id} title={story.title} />

        {/* Add Photo Button */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setShowUpload(true)}
            className="flex-1 bg-primary text-white py-4 rounded-full font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            + Upload to Album
          </button>
          <button
            onClick={() => setShowCaption(true)}
            className="flex-1 bg-green-600 text-white py-4 rounded-full font-semibold hover:bg-green-700 transition-colors shadow-sm"
          >
            + Add Caption
          </button>
        </div>

        {/* Timeline */}
        <Timeline photos={photos} albumLink={story.album_link} />
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <PhotoUploadModal
          storyId={id}
          albumLink={story.album_link}
          onClose={() => setShowUpload(false)}
          onSuccess={() => setShowUpload(false)}
        />
      )}

      {/* Add Caption Modal */}
      {showCaption && (
        <AddCaptionModal
          storyId={id}
          onClose={() => setShowCaption(false)}
          onSuccess={() => {
            loadPhotos()
            setShowCaption(false)
          }}
        />
      )}
    </div>
  )
}
