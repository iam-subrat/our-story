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

  async updateStory(id, data) {
    const res = await fetch(`${API_BASE}/api/stories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getPhotos(storyId) {
    const res = await fetch(`${API_BASE}/api/photos?story_id=${storyId}`);
    return res.json();
  },

  async addPhotoMetadata(storyId, imageUrl, caption, uploadedBy) {
    const res = await fetch(`${API_BASE}/api/photos/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        story_id: storyId,
        image_url: imageUrl,
        caption: caption,
        uploaded_by: uploadedBy
      })
    });
    return res.json();
  }
};
