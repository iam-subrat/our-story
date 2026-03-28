import { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || ''

/** Shimmer skeleton — no white background, frosted glass to match card */
function PhotoSkeleton() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        minHeight: '240px',
        background: 'linear-gradient(135deg, rgba(90,78,241,0.06) 0%, rgba(246,70,122,0.06) 100%)',
      }}
    >
      {/* Sweeping shimmer highlight */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.22) 50%, transparent 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.6s ease-in-out infinite',
        }}
      />
      {/* Camera icon */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary-700/15 to-accent-500/15 backdrop-blur">
          <svg
            width="28" height="28" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"
            className="text-primary-700/40"
          >
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </div>
        <span className="text-xs font-semibold tracking-wide text-ink-400">Loading…</span>
      </div>
    </div>
  )
}

/** Renders skeleton while image loads, then swaps cleanly — no overlap, no white flash */
function LazyPhoto({ src, alt }) {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  return (
    <div className="relative w-full">
      {/* Skeleton controls layout height while image is not ready */}
      {!loaded && !errored && <PhotoSkeleton />}

      {/* Broken image fallback */}
      {errored && (
        <div className="flex flex-col items-center justify-center gap-2 py-14"
          style={{ background: 'linear-gradient(135deg, rgba(90,78,241,0.05) 0%, rgba(246,70,122,0.05) 100%)' }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink-400">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <span className="text-xs font-semibold text-ink-400">Image unavailable</span>
        </div>
      )}

      {/*
        Image is absolutely positioned (off layout flow) while skeleton is showing.
        Once loaded → becomes static (enters flow), skeleton unmounts, fade-in completes.
      */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        className="w-full h-auto object-cover"
        style={{
          display: errored ? 'none' : 'block',
          position: loaded ? 'static' : 'absolute',
          inset: 0,
          opacity: loaded ? 1 : 0,
          transition: loaded ? 'opacity 0.45s ease' : 'none',
        }}
        loading="lazy"
      />
    </div>
  )
}

export default function Timeline({ photos, isOwner = false, onDelete }) {
  const [deletingId, setDeletingId] = useState(null)

  const handleDelete = async (photo) => {
    if (!window.confirm(`Delete this photo${photo.caption ? ` "${photo.caption}"` : ''}? This can't be undone.`)) return
    setDeletingId(photo.id)
    try {
      await onDelete(photo.id)
    } finally {
      setDeletingId(null)
    }
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📸</div>
        <h3 className="font-display text-2xl font-semibold tracking-tight text-ink-950 mb-2">
          No photos yet
        </h3>
        <p className="text-ink-700">Be the first to add a memory.</p>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div className="space-y-6">
        {photos.map((photo) => (
          <div key={photo.id} className="card-strong overflow-hidden" style={{ position: 'relative' }}>
            {/* Delete button — owner only */}
            {isOwner && (
              <button
                onClick={() => handleDelete(photo)}
                disabled={deletingId === photo.id}
                title="Delete photo"
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: 'none',
                  cursor: deletingId === photo.id ? 'not-allowed' : 'pointer',
                  background: 'rgba(20,0,0,0.55)',
                  backdropFilter: 'blur(6px)',
                  color: '#fff',
                  opacity: deletingId === photo.id ? 0.5 : 1,
                  transition: 'background 0.2s, transform 0.15s',
                }}
                onMouseEnter={e => { if (deletingId !== photo.id) e.currentTarget.style.background = 'rgba(200,30,30,0.85)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(20,0,0,0.55)' }}
              >
                {deletingId === photo.id ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 0.8s linear infinite' }}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                )}
              </button>
            )}

            <LazyPhoto src={`${API_BASE}${photo.image_url}`} alt={photo.caption} />

            <div className="p-5">
              {photo.caption && (
                <p className="text-ink-950 mb-2">{photo.caption}</p>
              )}
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-ink-600">
                <span className="pill">Added by {photo.uploaded_by}</span>
                <span>{new Date(photo.timestamp).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
