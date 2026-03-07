const API_BASE = import.meta.env.VITE_API_BASE || '';

export const api = {
  async createStory(data) {
    const res = await fetch(`${API_BASE}/api/stories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getStory(id) {
    const res = await fetch(`${API_BASE}/api/stories/${id}`);
    return res.json();
  },

  async getStoriesByCreator(creatorName) {
    const res = await fetch(`${API_BASE}/api/stories?creator_name=${encodeURIComponent(creatorName)}`);
    return res.json();
  },

  async getPhotos(storyId) {
    const res = await fetch(`${API_BASE}/api/photos?story_id=${storyId}`);
    return res.json();
  },

  async uploadPhoto(storyId, file, caption, uploadedBy) {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('story_id', storyId);
    formData.append('caption', caption);
    formData.append('uploaded_by', uploadedBy);

    const res = await fetch(`${API_BASE}/api/upload`, {
      method: 'POST',
      body: formData
    });
    return res.json();
  }
};
