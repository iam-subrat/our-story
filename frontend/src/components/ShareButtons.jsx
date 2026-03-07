export default function ShareButtons({ storyId, title }) {
  const url = window.location.href
  const text = `Check out my story: ${title}`

  const copyLink = () => {
    navigator.clipboard.writeText(url)
    alert('Link copied to clipboard!')
  }

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank')
  }

  const shareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
      <h3 className="font-semibold text-lg mb-4">Share this story</h3>
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={copyLink}
          className="flex flex-col items-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span className="text-2xl">🔗</span>
          <span className="text-sm font-medium">Copy Link</span>
        </button>
        <button
          onClick={shareWhatsApp}
          className="flex flex-col items-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span className="text-2xl">💬</span>
          <span className="text-sm font-medium">WhatsApp</span>
        </button>
        <button
          onClick={shareTelegram}
          className="flex flex-col items-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span className="text-2xl">✈️</span>
          <span className="text-sm font-medium">Telegram</span>
        </button>
      </div>
    </div>
  )
}
