'use client'

import { useState } from 'react'

import type { Film } from '@/lib/video'

/**
 * A film in a newsprint frame. It shows a still with a play button, and only
 * loads the video (and its third-party player) when someone presses play.
 */
export function VideoFrame({
  film,
  posterUrl,
  title,
  playLabel,
}: {
  film: Film | { kind: 'file'; fileUrl: string }
  posterUrl?: string | null
  title: string
  playLabel: string
}) {
  const [playing, setPlaying] = useState(false)
  const poster = posterUrl || (film.kind === 'embed' ? film.posterUrl : undefined)

  if (playing) {
    return (
      <div className="film frame">
        {film.kind === 'embed' ? (
          <iframe
            src={film.embedUrl}
            title={title}
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
          />
        ) : (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video src={film.fileUrl} poster={poster} controls autoPlay playsInline />
        )}
      </div>
    )
  }

  return (
    <div className="frame">
      <div className="film halftone ratio-16x9">
        <button type="button" className="film__button" onClick={() => setPlaying(true)} aria-label={`${playLabel}: ${title}`}>
          {poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={poster} alt="" style={{ aspectRatio: '16 / 9', objectFit: 'cover', width: '100%' }} />
          ) : (
            <span style={{ display: 'block', aspectRatio: '16 / 9' }} />
          )}
          <span className="film__play">
            <svg viewBox="0 0 20 24" fill="currentColor" aria-hidden="true">
              <path d="M2 1.5v21L19 12 2 1.5Z" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  )
}
