import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth";
import PhotoUploadModal from "../components/PhotoUploadModal";
import HeartbeatLoader from "../components/HeartbeatLoader";
import Timeline from "../components/Timeline";
import ShareButtons from "../components/ShareButtons";

import Spinner from "../components/Spinner";

export default function StoryPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [story, setStory] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  // album editing
  const [editingAlbum, setEditingAlbum] = useState(false);
  const [albumLink, setAlbumLink] = useState("");
  const [savingAlbum, setSavingAlbum] = useState(false);

  // title rename
  const [renamingTitle, setRenamingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const [savingTitle, setSavingTitle] = useState(false);

  // story delete
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const handlePhotoDeleted = async (photoId) => {
    await api.deletePhoto(photoId);
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  const handleUpdateAlbum = async () => {
    setSavingAlbum(true);
    try {
      const updated = await api.updateStory(id, { album_link: albumLink });
      setStory(updated);
      setEditingAlbum(false);
    } catch {
      alert("Failed to update album link");
    } finally {
      setSavingAlbum(false);
    }
  };

  const handleRenameTitle = async () => {
    const trimmed = titleDraft.trim();
    if (!trimmed) return;
    setSavingTitle(true);
    try {
      const updated = await api.renameStory(id, trimmed);
      setStory(updated);
      setRenamingTitle(false);
    } catch {
      alert("Failed to rename story");
    } finally {
      setSavingTitle(false);
    }
  };

  const handleDeleteStory = async () => {
    setDeleting(true);
    try {
      await api.deleteStory(id);
      navigate(`/user/${encodeURIComponent(user.username)}`);
    } catch {
      alert("Failed to delete story");
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  if (loading) return <HeartbeatLoader />;
  if (!story)
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-lg font-semibold text-ink-700">Story not found</div>
      </div>
    );

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6 sm:mb-8">
        <div className="kicker">Story</div>

        {/* ── Title row ── */}
        {renamingTitle ? (
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              id="story-title-input"
              type="text"
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRenameTitle();
                if (e.key === "Escape" && !savingTitle) setRenamingTitle(false);
              }}
              disabled={savingTitle}
              autoFocus
              className="input text-xl font-semibold flex-1 disabled:opacity-60"
            />
            <div className="flex gap-2">
              <button
                onClick={handleRenameTitle}
                disabled={savingTitle || !titleDraft.trim()}
                className="btn-primary px-5 py-2.5 min-w-[5rem] disabled:opacity-60"
              >
                {savingTitle ? (
                  <span className="flex items-center gap-2">
                    <Spinner /> Saving…
                  </span>
                ) : (
                  "Save"
                )}
              </button>
              <button
                onClick={() => setRenamingTitle(false)}
                disabled={savingTitle}
                className="btn-soft px-5 py-2.5 disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-1 flex items-center gap-3">
            <h1 className="h2">{story.title}</h1>
            {isOwner && (
              <>
                {/* Pencil / rename */}
                <button
                  id="rename-story-btn"
                  title="Rename story"
                  onClick={() => {
                    setTitleDraft(story.title);
                    setRenamingTitle(true);
                    setConfirmDelete(false);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-paper-100 text-ink-500 ring-1 ring-black/5 hover:bg-primary-50 hover:text-primary-700 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                  </svg>
                </button>
                {/* Trash / delete */}
                <button
                  id="delete-story-btn"
                  title="Delete story"
                  onClick={() => { setConfirmDelete(true); setRenamingTitle(false); }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-paper-100 text-ink-500 ring-1 ring-black/5 hover:bg-red-50 hover:text-red-600 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                  </svg>
                </button>
              </>
            )}
          </div>
        )}

        {/* ── Delete confirmation ── */}
        {confirmDelete && (
          <div className="mt-3 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-red-800">
              Delete &ldquo;{story.title}&rdquo;? All photos will be permanently removed.
            </p>
            <div className="flex gap-2 flex-shrink-0">
              <button
                id="confirm-delete-story-btn"
                onClick={handleDeleteStory}
                disabled={deleting}
                className="btn bg-red-600 text-white hover:bg-red-700 px-5 py-2 text-sm min-w-[7rem] disabled:opacity-70"
              >
                {deleting ? (
                  <span className="flex items-center gap-2">
                    <Spinner /> Deleting…
                  </span>
                ) : (
                  "Yes, delete"
                )}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                disabled={deleting}
                className="btn-soft px-5 py-2 text-sm disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ── By-line & date ── */}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-ink-600">
          {isOwner ? (
            <Link
              to={`/user/${encodeURIComponent(user.username)}`}
              className="font-semibold text-ink-800 hover:text-primary-800"
            >
              by {story.creator_name}
            </Link>
          ) : (
            <span className="font-semibold text-ink-800">by {story.creator_name}</span>
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
        {/* ── Album section ── */}
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
                disabled={savingAlbum}
                className="input disabled:opacity-60"
              />
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleUpdateAlbum}
                  disabled={savingAlbum}
                  className="btn-primary flex-1 disabled:opacity-60"
                >
                  {savingAlbum ? (
                    <span className="flex items-center justify-center gap-2">
                      <Spinner /> Saving…
                    </span>
                  ) : (
                    "Save"
                  )}
                </button>
                <button
                  onClick={() => { setEditingAlbum(false); setAlbumLink(story.album_link || ""); }}
                  disabled={savingAlbum}
                  className="btn-soft flex-1 disabled:opacity-60"
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
                <button onClick={() => setEditingAlbum(true)} className="btn-soft px-5 py-2.5">
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
            <button onClick={() => setEditingAlbum(true)} className="mt-3 btn-soft px-6 py-3">
              + Add album link
            </button>
          </div>
        ) : null}

        <ShareButtons storyId={id} title={story.title} />

        <div className="card p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-semibold text-ink-950">Add a memory</div>
              <div className="text-sm text-ink-600">Upload a photo and leave a caption.</div>
            </div>
            <button onClick={() => setShowUpload(true)} className="btn-primary px-8 py-3.5">
              + Add your photo
            </button>
          </div>
        </div>

        <Timeline photos={photos} isOwner={isOwner} onDelete={handlePhotoDeleted} />
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
