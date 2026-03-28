import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../auth'
import HeartbeatLoader from '../components/HeartbeatLoader'

export default function UserTimeline() {
  const { username } = useParams()
  const { user } = useAuth()
  const [stories, setStories] = useState([])
  const [profileUser, setProfileUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const isOwner = user && user.username === username

  useEffect(() => {
    const loadData = async () => {
      try {
        const u = await api.getUserByUsername(username)
        setProfileUser(u)
        if (u && isOwner) {
          const data = await api.getMyStories(username)
          setStories(data)
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [username, isOwner])

  if (loading) return <HeartbeatLoader />

  // Not the owner — show a minimal public page
  if (!isOwner) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-8">
          <div className="kicker">Timeline</div>
          <h1 className="h2 mt-1">
            {profileUser ? `Stories by ${profileUser.display_name}` : 'Timeline not found'}
          </h1>
        </div>
        {profileUser ? (
          <div className="card p-10 text-center">
            <p className="text-ink-700">This timeline is private. Log in to view your own stories.</p>
            <Link to="/login" className="mt-6 inline-flex btn-primary px-8 py-3.5">Log in</Link>
          </div>
        ) : (
          <div className="card p-10 text-center">
            <p className="text-ink-700">User not found.</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="kicker">Timeline</div>
          <h1 className="h2 mt-1">Your stories</h1>
          <p className="mt-2 text-ink-700">
            {stories.length} {stories.length === 1 ? 'story' : 'stories'}
          </p>
        </div>
        <Link to="/create" className="btn-primary px-7 py-3">+ Create story</Link>
      </div>

      {stories.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-primary-700 to-accent-500 text-white shadow-soft">
            <span className="text-2xl">📖</span>
          </div>
          <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight text-ink-950">No stories yet</h3>
          <p className="mt-2 text-ink-700">Create your first story and start collecting moments.</p>
          <Link to="/create" className="mt-6 inline-flex btn-primary px-8 py-3.5">Create a story</Link>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-6 top-2 bottom-2 w-px bg-gradient-to-b from-primary-400 via-primary-600 to-accent-500/70" />
          <div className="space-y-5">
            {stories
              .slice()
              .sort((a, b) => new Date(b.story_date) - new Date(a.story_date))
              .map((story) => (
                <div key={story.id} className="relative flex gap-4 sm:gap-6">
                  <div className="relative z-10 mt-1 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-3xl bg-white/70 ring-1 ring-black/10 backdrop-blur">
                    <div className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-primary-700 to-accent-500 text-white shadow-soft">
                      <span className="text-sm font-bold">
                        {story.story_date ? new Date(story.story_date).getDate() : '—'}
                      </span>
                    </div>
                  </div>
                  <Link to={`/s/${story.id}`} className="card group flex-1 p-6 transition hover:shadow-lift">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-display text-xl font-semibold tracking-tight text-ink-950 group-hover:text-primary-800 transition-colors">
                            {story.title}
                          </h3>
                          {story.album_link && <span className="pill">📷 Album</span>}
                        </div>
                        {story.story_date && (
                          <div className="mt-2 text-sm font-semibold text-primary-800">
                            {new Date(story.story_date).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'long', day: 'numeric',
                            })}
                          </div>
                        )}
                      </div>
                      <div className="text-xl text-ink-400 group-hover:text-primary-700 transition-colors">→</div>
                    </div>
                  </Link>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
