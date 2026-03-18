export default function Timeline({ photos }) {
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
        <div key={photo.id} className="card-strong overflow-hidden">
          <img
            src={photo.image_url}
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
    </div>
  )
}
