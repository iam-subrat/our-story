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
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500"></div>
            
            <div className="space-y-8">
              {stories.sort((a, b) => new Date(b.story_date) - new Date(a.story_date)).map((story, index) => (
                <div key={story.id} className="relative flex items-start gap-6">
                  {/* Timeline dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                      {story.story_date ? new Date(story.story_date).getDate() : '?'}
                    </div>
                  </div>
                  
                  {/* Story card */}
                  <Link
                    to={`/s/${story.id}`}
                    className="flex-1 bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-indigo-400 hover:shadow-xl transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                          {story.title}
                        </h3>
                        {story.story_date && (
                          <p className="text-indigo-600 font-semibold text-sm mb-2">
                            {new Date(story.story_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        )}
                        {story.album_link && (
                          <span className="inline-flex items-center text-sm text-gray-600">
                            📷 Has album
                          </span>
                        )}
                      </div>
                      <div className="text-2xl">→</div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
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
