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
    <div className="card p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-semibold text-ink-950">Share this story</h3>
        <span className="pill">Link</span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <button
          onClick={copyLink}
          className="btn-soft flex flex-col items-center gap-2 rounded-3xl px-4 py-4"
        >
          <span className="text-2xl">🔗</span>
          <span className="text-sm font-medium">Copy Link</span>
        </button>
        <button
          onClick={shareWhatsApp}
          className="btn-soft flex flex-col items-center gap-2 rounded-3xl px-4 py-4"
        >
          <img src="/whatsapp.png" alt="WhatsApp" className="w-8 h-8" />
          <span className="text-sm font-medium">WhatsApp</span>
        </button>
        <button
          onClick={shareTelegram}
          className="btn-soft flex flex-col items-center gap-2 rounded-3xl px-4 py-4"
        >
          <img src="/telegram.png" alt="Telegram" className="w-8 h-8" />
          <span className="text-sm font-medium">Telegram</span>
        </button>
      </div>
    </div>
  )
}
