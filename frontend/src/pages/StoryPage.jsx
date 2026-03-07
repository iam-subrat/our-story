import { useState, useEffect } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { api } from '../api'
import PhotoUploadModal from '../components/PhotoUploadModal'
import Timeline from '../components/Timeline'
import ShareButtons from '../components/ShareButtons'

export default function StoryPage() {
  const { id } = useParams()
  const location = useLocation()
  const [story, setStory] = useState(null)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)
  const showUserLink = location.state?.showUserLink

  useEffect(() => {
    loadStory()
    loadPhotos()
  }, [id])

  const loadStory = async () => {
    try {
      const data = await api.getStory(id)
      setStory(data)
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
        {story.album_link && (
          <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
            <h3 className="font-semibold text-lg mb-3">Memory Album</h3>
            <a
              href={story.album_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-2"
            >
              View Full Album on Google Photos →
            </a>
          </div>
        )}

        {/* Share Buttons */}
        <ShareButtons storyId={id} title={story.title} />

        {/* Add Photo Button */}
        <button
          onClick={() => setShowUpload(true)}
          className="w-full bg-primary text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-colors mb-8 shadow-sm"
        >
          + Add Your Photo
        </button>

        {/* Timeline */}
        <Timeline photos={photos} />
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <PhotoUploadModal
          storyId={id}
          onClose={() => setShowUpload(false)}
          onSuccess={handlePhotoUploaded}
        />
      )}
    </div>
  )
}
