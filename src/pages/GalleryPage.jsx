import { useCallback, useEffect, useState } from 'react'
import {
  API_BASE_URL,
  LIST_ENDPOINT,
  formatTimestamp,
  normalizePhotoList,
} from '../utils'

export default function GalleryPage() {
  const [photos, setPhotos] = useState([])
  const [isFetching, setIsFetching] = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)
  const [hasFetched, setHasFetched] = useState(false)
  const [lightbox, setLightbox] = useState(null)

  const fetchPhotos = useCallback(async () => {
    setIsFetching(true)
    setFetchError('')
    try {
      const response = await fetch(LIST_ENDPOINT)
      if (!response.ok) {
        throw new Error('Unable to fetch photos')
      }
      const payload = await response.json().catch(() => null)
      const normalized = normalizePhotoList(payload, API_BASE_URL)
      setPhotos(normalized)
      setLastUpdated(new Date())
    } catch {
      setFetchError('We could not load the gallery. Please try again soon.')
    } finally {
      setIsFetching(false)
      setHasFetched(true)
    }
  }, [])

  useEffect(() => {
    if (!hasFetched) {
      fetchPhotos()
    }
  }, [fetchPhotos, hasFetched])

  useEffect(() => {
    if (lightbox === null) return
    const handleKey = (e) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight') setLightbox((i) => (i + 1) % photos.length)
      if (e.key === 'ArrowLeft') setLightbox((i) => (i - 1 + photos.length) % photos.length)
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [lightbox, photos.length])

  return (
    <section className="panel gallery-panel" id="gallery">
      <header className="panel__header">
        <div>
          <span className="section-label">Shared Memories</span>
          <h2>Guest Gallery</h2>
          <p>Every shared moment shows up here for the whole celebration.</p>
        </div>
        <div className="panel__actions">
          <button
            className="btn ghost"
            type="button"
            onClick={fetchPhotos}
            disabled={isFetching}
          >
            {isFetching ? 'Refreshing...' : 'Refresh'}
          </button>
          <span className="sync-meta">
            {lastUpdated
              ? `Synced ${formatTimestamp(lastUpdated)}`
              : 'Not synced yet'}
          </span>
        </div>
      </header>

      {fetchError && <div className="status status--error">{fetchError}</div>}

      <div className="gallery-grid">
        {isFetching && !photos.length
          ? Array.from({ length: 8 }).map((_, index) => (
              <div className="photo-card skeleton" key={`skeleton-${index}`}>
                <div className="photo-card__media" />
              </div>
            ))
          : null}
        {!isFetching && !photos.length ? (
          <div className="empty-state">
            No photos yet. Be the first to share a moment.
          </div>
        ) : null}
        {photos.map((photo, index) => (
          <figure
            className="photo-card"
            key={photo.id}
            style={{ animationDelay: `${index * 0.06}s` }}
            onClick={() => setLightbox(index)}
          >
            <div className="photo-card__media">
              <img src={photo.url} alt={photo.title} loading="lazy" />
            </div>
            {photo.uploadedAt && (
              <figcaption>
                <span>{formatTimestamp(photo.uploadedAt)}</span>
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {lightbox !== null && photos[lightbox] && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button
            className="lightbox__close"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            &times;
          </button>

          {photos.length > 1 && (
            <>
              <button
                className="lightbox__nav lightbox__nav--prev"
                onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i - 1 + photos.length) % photos.length) }}
                aria-label="Previous photo"
              >
                &#8249;
              </button>
              <button
                className="lightbox__nav lightbox__nav--next"
                onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i + 1) % photos.length) }}
                aria-label="Next photo"
              >
                &#8250;
              </button>
            </>
          )}

          <div className="lightbox__content" onClick={(e) => e.stopPropagation()}>
            <img
              src={photos[lightbox].url}
              alt={photos[lightbox].title}
              className="lightbox__img"
            />
            {photos[lightbox].uploadedAt && (
              <div className="lightbox__caption">
                {formatTimestamp(photos[lightbox].uploadedAt)}
              </div>
            )}
            <div className="lightbox__counter">
              {lightbox + 1} / {photos.length}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
