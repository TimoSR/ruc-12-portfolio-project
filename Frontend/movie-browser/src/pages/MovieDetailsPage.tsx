import { useEffect } from 'react'
import { observer, useLocalObservable } from 'mobx-react'
import { useNavigate, useParams } from '@tanstack/react-router'
import styled from 'styled-components'
import { MovieDetailsStore, type IMovieDetailsStore } from '../features/movies/store/MovieDetailsStore'

export const MovieDetailsPage = observer(MovieDetailsPageBase)

function MovieDetailsPageBase() {
  const navigate = useNavigate()
  const { movieId } = useParams({ from: '/movies/$movieId' })
  const store = useLocalObservable<IMovieDetailsStore>(() => new MovieDetailsStore())

  useEffect(() => {
    void store.loadMovie(movieId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId])

  const handleBack = () => {
    navigate({ to: '/movies' })
  }

  if (store.isLoading) {
    return (
      <Page>
        <LoadingMessage>Loading movie details...</LoadingMessage>
      </Page>
    )
  }

  if (store.error || !store.movie) {
    return (
      <Page>
        <ErrorMessage>{store.error || 'Movie not found'}</ErrorMessage>
        <BackButton onClick={handleBack}>← Back to Movies</BackButton>
      </Page>
    )
  }

  const movie = store.movie

  return (
    <Page>
      <BackButton onClick={handleBack}>← Back to Movies</BackButton>

      <Content>
        <PosterSection>
          {movie.posterUrl ? (
            <Poster src={movie.posterUrl} alt={movie.primaryTitle} />
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
