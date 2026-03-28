const API_BASE = import.meta.env.VITE_API_BASE || '';

const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // ---------- auth ----------
  async register(username, password, displayName) {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, display_name: displayName }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async login(username, password) {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async claim(username, password) {
    const res = await fetch(`${API_BASE}/api/auth/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async me() {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: authHeader(),
    });
    if (!res.ok) return null;
    return res.json();
  },

  async getUserByUsername(username) {
    const res = await fetch(`${API_BASE}/api/users/${encodeURIComponent(username)}`);
    if (!res.ok) return null;
    return res.json();
  },

  // ---------- stories ----------
  async createStory(data) {
    const res = await fetch(`${API_BASE}/api/stories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async getStory(id) {
    const res = await fetch(`${API_BASE}/api/stories/${id}`);
    return res.json();
  },

  async getMyStories(username) {
    const res = await fetch(`${API_BASE}/api/stories?username=${encodeURIComponent(username)}`, {
      headers: authHeader(),
    });
    if (!res.ok) return [];
    return res.json();
  },

  async updateStory(id, data) {
    const res = await fetch(`${API_BASE}/api/stories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // ---------- photos ----------
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
    const res = await fetch(`${API_BASE}/api/upload`, { method: 'POST', body: formData });
    return res.json();
  },

  async deletePhoto(photoId) {
    const res = await fetch(`${API_BASE}/api/photos/${photoId}`, {
      method: 'DELETE',
      headers: authHeader(),
    });
    if (!res.ok) throw new Error(await res.text());
  },
};
