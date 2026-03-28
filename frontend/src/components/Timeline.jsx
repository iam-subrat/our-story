import { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || ''

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

          <img
            src={`${API_BASE}${photo.image_url}`}
            alt={photo.caption}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
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

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
