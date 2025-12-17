import { useState } from 'react'
import { observer } from 'mobx-react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import styled from 'styled-components'
import { movieDetailsQueryOptions } from '../../../../api/queries/movieQueries'

import { RatingComponent } from '../components/RatingComponent'

export const MovieDetailsView = observer(MovieDetailsViewBase)

function MovieDetailsViewBase() {
  const navigate = useNavigate()
  const { movieId } = useParams({ strict: false })
  const [imageError, setImageError] = useState(false)

  const { data: movie, isLoading, error } = useQuery(movieDetailsQueryOptions(movieId || ''))

  const handleBack = () => {
    navigate({ to: '/movies', search: { page: 1, pageSize: 20, query: '' } })
  }

  if (isLoading) {
    return (
      <Page>
        <LoadingMessage>Loading movie details...</LoadingMessage>
      </Page>
    )
  }

  if (error || !movie) {
    return (
      <Page>
        <ErrorMessage>{error instanceof Error ? error.message : 'Movie not found'}</ErrorMessage>
        <BackButton onClick={handleBack}>← Back to Movies</BackButton>
      </Page>
    )
  }

  return (
    <Page>
      <BackButton onClick={handleBack}>← Back to Movies</BackButton>

      <Content>
        <PosterSection>
          {movie.posterUrl && !imageError ? (
            <Poster
              src={movie.posterUrl}
              alt={movie.primaryTitle}
              onError={() => setImageError(true)}
            />
          ) : (
            <PosterPlaceholder>
              <PlaceholderIcon>🎬</PlaceholderIcon>
            </PosterPlaceholder>
          )}
        </PosterSection>

        <InfoSection>
          <Title>{movie.primaryTitle}</Title>

          {movie.originalTitle && movie.originalTitle !== movie.primaryTitle && (
            <OriginalTitle>Original: {movie.originalTitle}</OriginalTitle>
          )}

          <MetaRow>
            {movie.startYear && <MetaItem>{movie.startYear}</MetaItem>}
            {movie.runtimeMinutes && <MetaItem>{movie.runtimeMinutes} min</MetaItem>}
            {movie.titleType && <MetaItem>{movie.titleType}</MetaItem>}
          </MetaRow>

          <RatingSection>
            <SectionTitle>Rate this movie</SectionTitle>
            {movie.averageRating && (
              <div className="mb-2 text-yellow-400 text-lg font-bold">
                ★ {movie.averageRating.toFixed(1)} <span className="text-gray-500 text-sm font-normal">({movie.numVotes} votes)</span>
              </div>
            )}
            <RatingComponent titleId={movieId || ''} />
          </RatingSection>

          {movie.plot && (
            <PlotSection>
              <SectionTitle>Plot</SectionTitle>
              <Plot>{movie.plot}</Plot>
            </PlotSection>
          )}
        </InfoSection>
      </Content>
    </Page>
  )
}

const RatingSection = styled.div`
  margin-bottom: 2rem;
`

const Page = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
`

const BackButton = styled.button`
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(55, 65, 81, 0.6);
  color: #9ca3af;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 2rem;

  &:hover {
    color: #f9fafb;
    border-color: rgba(168, 85, 247, 0.6);
  }
`

const Content = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const PosterSection = styled.div``

const Poster = styled.img`
  width: 100%;
  border-radius: 0.75rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
`

const PosterPlaceholder = styled.div`
  aspect-ratio: 2/3;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2));
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
`

const PlaceholderIcon = styled.span`
  font-size: 5rem;
  opacity: 0.5;
`

const InfoSection = styled.div``

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: #f9fafb;
  margin: 0 0 0.5rem 0;
`

const OriginalTitle = styled.p`
  font-size: 1.125rem;
  color: #9ca3af;
  margin: 0 0 1rem 0;
  font-style: italic;
`

const MetaRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`

const MetaItem = styled.span`
  background: rgba(168, 85, 247, 0.2);
  color: #e9d5ff;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
`

const PlotSection = styled.div`
  margin-top: 2rem;
`

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #f9fafb;
  margin: 0 0 1rem 0;
`

const Plot = styled.p`
  font-size: 1.125rem;
  line-height: 1.75;
  color: #d1d5db;
  margin: 0;
`

const LoadingMessage = styled.div`
  text-align: center;
  color: #9ca3af;
  padding: 3rem;
  font-size: 1.125rem;
`

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fca5a5;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  text-align: center;
`
