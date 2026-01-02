import { useState, useEffect } from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import type { MovieItem } from '../types'
import { fetchTmdbMovieImage } from '../../../../api/tmdbService'

import { BookmarkButton } from '../../bookmarks/components/BookmarkButton'

export const MovieCard = observer(MovieCardBase)

type MovieCardProps = {
  movie: MovieItem
  onClick: () => void
  className?: string
}

function MovieCardBase({ movie, onClick, className = '' }: MovieCardProps) {
  const [posterSrc, setPosterSrc] = useState<string | null>(null)
  const [hasError, setHasError] = useState(false)
  const [isRetrying, setIsRetrying] = useState(false)

  // Initialize/Reset when movie changes
  useEffect(() => {
    // Reset state for new movie
    setHasError(false)
    setIsRetrying(false)

    if (movie.posterUrl && movie.posterUrl !== 'N/A') {
      setPosterSrc(movie.posterUrl)
    } else {
      // No valid initial URL, try TMDB immediately
      setPosterSrc(null)
      tryRecoverImage()
    }
  }, [movie.id, movie.posterUrl])

  const tryRecoverImage = async () => {
    // Prevent infinite loops or retrying without ID
    if (!movie.legacyId) {
      setHasError(true)
      return
    }

    setIsRetrying(true)
    try {
      const newUrl = await fetchTmdbMovieImage(movie.legacyId)
      // TMDB service returns a placeholder URL if it fails, so we check for that too
      if (newUrl && !newUrl.includes('placehold.co')) {
        setPosterSrc(newUrl)
        setHasError(false)
      } else {
        setHasError(true)
      }
    } catch {
      setHasError(true)
    }
    // Note: We don't unset isRetrying here to prevent re-triggering loop in some edge cases,
    // but effectively once we try to recover, we stick with the result.
  }

  return (
    <Card onClick={onClick} className={className}>
      <PosterPlaceholder>
        {posterSrc && !hasError ? (
          <img
            src={posterSrc}
            alt={movie.primaryTitle}
            referrerPolicy="no-referrer"
            onError={() => {
              // If we haven't retried yet, try to recover
              if (!isRetrying) {
                tryRecoverImage()
              } else {
                setHasError(true)
              }
            }}
          />
        ) : (
          <PlaceholderIcon>🎬</PlaceholderIcon>
        )}
        <BookmarkOverlay onClick={(e) => e.stopPropagation()}>
          <BookmarkButton
            targetId={movie.legacyId || movie.id}
            targetType="movie"
            displayName={movie.primaryTitle}
          />
        </BookmarkOverlay>
      </PosterPlaceholder>

      <Info>
        <Title>{movie.primaryTitle}</Title>
        <Meta>
          {movie.startYear && <Year>{movie.startYear}</Year>}
          {movie.runtimeMinutes && <Runtime>{movie.runtimeMinutes} min</Runtime>}
        </Meta>
      </Info>
    </Card>
  )
}

const Card = styled.div`
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(55, 65, 81, 0.6);
  border-radius: 0.75rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(168, 85, 247, 0.6);
    box-shadow: 0 20px 40px rgba(168, 85, 247, 0.3);
  }
`

const PosterPlaceholder = styled.div`
  position: relative;
  aspect-ratio: 2/3;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2));
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const PlaceholderIcon = styled.span`
  font-size: 3rem;
  opacity: 0.5;
`

const Info = styled.div`
  padding: 1rem;
`

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #f9fafb;
  margin: 0 0 0.5rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`

const Meta = styled.div`
  display: flex;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #9ca3af;
`

const Year = styled.span``
const Runtime = styled.span``

const BookmarkOverlay = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
`
