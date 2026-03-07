export default function Timeline({ photos, albumLink }) {
    if (photos.length === 0 && !albumLink) {
        return (
            <div className="text-center py-16">
                <div className="text-6xl mb-4">📸</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No photos yet
                </h3>
                <p className="text-gray-500">
                    Add a Google Photos album link to get started!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {photos.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Photo Captions
                    </h3>
                    <div className="space-y-4">
                        {photos.map((photo) => (
                            <a
                                key={photo.id}
                                href={photo.image_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                            >
                                <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                                    <img
                                        src={photo.image_url}
                                        alt={photo.caption || "Photo"}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                            e.target.nextSibling.style.display =
                                                "flex";
                                        }}
                                    />
                                    <div className="hidden absolute inset-0 flex-col items-center justify-center text-gray-400">
                                        <span className="text-5xl mb-2">
                                            🖼️
                                        </span>
                                        <span className="text-sm">
                                            Click to view photo
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    {photo.caption && (
                                        <p className="text-gray-900 mb-2 font-medium">
                                            {photo.caption}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span>
                                            Added by {photo.uploaded_by}
                                        </span>
                                        <span>
                                            {new Date(
                                                photo.timestamp,
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
