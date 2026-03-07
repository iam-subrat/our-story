export default function Timeline({ photos }) {
  if (photos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📸</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No photos yet</h3>
        <p className="text-gray-500">Be the first to add a memory!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {photos.map((photo) => (
        <div key={photo.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
          <img
            src={photo.image_url}
            alt={photo.caption}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
          <div className="p-4">
            {photo.caption && (
              <p className="text-gray-900 mb-2">{photo.caption}</p>
            )}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Added by {photo.uploaded_by}</span>
              <span>{new Date(photo.timestamp).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
