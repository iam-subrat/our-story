import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth";
import PhotoUploadModal from "../components/PhotoUploadModal";
import HeartbeatLoader from "../components/HeartbeatLoader";
import Timeline from "../components/Timeline";
import ShareButtons from "../components/ShareButtons";

export default function StoryPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [story, setStory] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(false);
  const [albumLink, setAlbumLink] = useState("");

  const isOwner = user && story && user.id === story.user_id;

  useEffect(() => {
    Promise.all([
      api.getStory(id).then((data) => {
        setStory(data);
        setAlbumLink(data.album_link || "");
      }),
      api.getPhotos(id).then(setPhotos),
    ]).finally(() => setLoading(false));
  }, [id]);

  const handlePhotoUploaded = () => {
    api.getPhotos(id).then(setPhotos);
    setShowUpload(false);
  };

  const handleUpdateAlbum = async () => {
    try {
      const updated = await api.updateStory(id, { album_link: albumLink });
      setStory(updated);
      setEditingAlbum(false);
    } catch {
      alert("Failed to update album link");
    }
  };

  if (loading) return <HeartbeatLoader />;
  if (!story)
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-lg font-semibold text-ink-700">
          Story not found
        </div>
      </div>
    );

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6 sm:mb-8">
        <div className="kicker">Story</div>
        <h1 className="h2 mt-1">{story.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-ink-600">
          {isOwner ? (
            <Link
              to={`/user/${encodeURIComponent(user.username)}`}
              className="font-semibold text-ink-800 hover:text-primary-800"
            >
              by {story.creator_name}
            </Link>
          ) : (
            <span className="font-semibold text-ink-800">
              by {story.creator_name}
            </span>
          )}
          {story.story_date && (
            <span className="pill">
              {new Date(story.story_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-5">
        {/* Album section — edit only for owner */}
        {isOwner && editingAlbum ? (
          <div className="card p-6">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-semibold text-ink-950">Memory album</h3>
              <span className="pill">Edit</span>
            </div>
            <div className="mt-4">
              <input
                type="url"
                placeholder="https://photos.app.goo.gl/..."
                value={albumLink}
                onChange={(e) => setAlbumLink(e.target.value)}
                className="input"
              />
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleUpdateAlbum}
                  className="btn-primary flex-1"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingAlbum(false);
                    setAlbumLink(story.album_link || "");
                  }}
                  className="btn-soft flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : story.album_link ? (
          <div className="card p-6">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-semibold text-ink-950">Memory album</h3>
              {isOwner && (
                <button
                  onClick={() => setEditingAlbum(true)}
                  className="btn-soft px-5 py-2.5"
                >
                  Edit
                </button>
              )}
            </div>
            <a
              href={story.album_link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex btn-soft px-6 py-3"
            >
              View on Google Photos →
            </a>
          </div>
        ) : isOwner ? (
          <div className="card p-6">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-semibold text-ink-950">Memory album</h3>
              <span className="pill">Optional</span>
            </div>
            <button
              onClick={() => setEditingAlbum(true)}
              className="mt-3 btn-soft px-6 py-3"
            >
              + Add album link
            </button>
          </div>
        ) : null}

        <ShareButtons storyId={id} title={story.title} />

        <div className="card p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-semibold text-ink-950">Add a memory</div>
              <div className="text-sm text-ink-600">
                Upload a photo and leave a caption.
              </div>
            </div>
            <button
              onClick={() => setShowUpload(true)}
              className="btn-primary px-8 py-3.5"
            >
              + Add your photo
            </button>
          </div>
        </div>

        <Timeline photos={photos} />
      </div>

      {showUpload && (
        <PhotoUploadModal
          storyId={id}
          onClose={() => setShowUpload(false)}
          onSuccess={handlePhotoUploaded}
        />
      )}
    </div>
  );
}
