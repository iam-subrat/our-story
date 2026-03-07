import { useState } from 'react'
import { api } from '../api'

export default function PhotoUploadModal({ storyId, albumLink, onClose, onSuccess }) {
  if (!albumLink) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-4">
        <div className="bg-white rounded-t-3xl md:rounded-2xl w-full max-w-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Add Photo</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
          </div>
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📷</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Album Link Set</h3>
            <p className="text-gray-600 mb-6">Please add a Google Photos album link first to enable photo uploads.</p>
            <button
              onClick={onClose}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-t-3xl md:rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Add Photo to Album</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">📸 How to Add Photos</h3>
            <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
              <li>Click the button below to open the Google Photos album</li>
              <li>Sign in to your Google account if needed</li>
              <li>Click "Add photos" or "+" button in the album</li>
              <li>Upload your photo(s) from your device</li>
            </ol>
          </div>

          <a
            href={albumLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-primary text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors text-center"
          >
            Open Google Photos Album →
          </a>

          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
