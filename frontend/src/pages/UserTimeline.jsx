import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api'

export default function UserTimeline() {
  const { creatorName } = useParams()
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStories()
  }, [creatorName])

  const loadStories = async () => {
    try {
      const data = await api.getStoriesByCreator(creatorName)
      setStories(data)
    } catch (error) {
      console.error('Failed to load stories')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Stories by {creatorName}
            </h1>
            <p className="text-gray-600">{stories.length} {stories.length === 1 ? 'story' : 'stories'}</p>
          </div>
          <Link
            to="/create"
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            + Create Story
          </Link>
        </div>

        {stories.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📖</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No stories yet</h3>
            <p className="text-gray-500">Create your first story to get started!</p>
            <Link
              to="/create"
              className="inline-block mt-6 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Create Story
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {stories.map((story) => (
              <Link
                key={story.id}
                to={`/s/${story.id}`}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">{story.title}</h3>
                {story.story_date && (
                  <p className="text-gray-500 text-sm mb-3">
                    {new Date(story.story_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                )}
                {story.album_link && (
                  <span className="inline-flex items-center text-sm text-primary">
                    📷 Has album
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}

        <Link
          to="/"
          className="inline-block mt-8 text-gray-600 hover:text-gray-900"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
