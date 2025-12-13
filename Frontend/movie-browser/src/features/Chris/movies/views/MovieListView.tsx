import { useState } from 'react'
import { observer } from 'mobx-react'
import { useNavigate } from '@tanstack/react-router'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import styled from 'styled-components'
import { movieListQueryOptions } from '../../../../api/queries/movieQueries'
import { MovieCard } from '../components/MovieCard'
import { Pagination } from '../components/Pagination'

export const MovieListView = observer(MovieListViewBase)

function MovieListViewBase() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const pageSize = 20
  const searchQuery = ''

  const {
    data,
    isLoading,
    isError,
    error,
    isPlaceholderData
  } = useQuery({
    ...movieListQueryOptions({ query: searchQuery, page, pageSize }),
    placeholderData: keepPreviousData,
  })

  const movies = data?.items || []
  const totalItems = data?.totalItems || 0
  const totalPages = Math.ceil(totalItems / pageSize)

  const handleNext = () => {
    if (!isPlaceholderData && page < totalPages) {
      setPage(old => old + 1)
    }
  }

  const handlePrevious = () => {
    setPage(old => Math.max(old - 1, 1))
  }

  const handleMovieClick = (movieId: string) => {
    navigate({ to: '/movies/$movieId', params: { movieId } })
  }

  return (
    <Page>
      <Header>
        <Title>Movies</Title>
        <Subtitle>Browse our collection of movies</Subtitle>
      </Header>

      {isError && (
        <ErrorMessage>
          Error: {error instanceof Error ? error.message : 'Unknown error'}
        </ErrorMessage>
      )}

      {isLoading && <LoadingMessage>Loading movies...</LoadingMessage>}

      {!isLoading && !isError && movies.length === 0 && (
        <EmptyMessage>No movies found</EmptyMessage>
      )}

      {!isLoading && !isError && movies.length > 0 && (
        <>
          <MovieGrid>
            {movies.map((movie: any) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => handleMovieClick(movie.id)}
              />
            ))}
          </MovieGrid>

          <Pagination
            currentPage={page}
            totalPages={totalPages || 1}
            onPrevious={handlePrevious}
            onNext={handleNext}
            isLoading={isPlaceholderData}
          />
        </>
      )}
    </Page>
  )
}

const Page = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
`

const Header = styled.div`
  margin-bottom: 2rem;
`

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: #f9fafb;
  margin: 0 0 0.5rem 0;
`

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: #9ca3af;
  margin: 0;
`

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
`

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fca5a5;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
`

const LoadingMessage = styled.div`
  text-align: center;
  color: #9ca3af;
  padding: 3rem;
  font-size: 1.125rem;
`

const EmptyMessage = styled.div`
  text-align: center;
  color: #9ca3af;
  padding: 3rem;
  font-size: 1.125rem;
`
