import { useEffect } from 'react'
import { observer, useLocalObservable } from 'mobx-react'
import { useNavigate } from '@tanstack/react-router'
import styled from 'styled-components'
import { MovieStore, type IMovieStore } from '../features/movies/store/MovieStore'
import { MovieCard } from '../features/movies/components/MovieCard'
import { Pagination } from '../features/movies/components/Pagination'

export const MovieListPage = observer(MovieListPageBase)

function MovieListPageBase() {
  const navigate = useNavigate()
  const store = useLocalObservable<IMovieStore>(() => new MovieStore())

  useEffect(() => {
    void store.loadMovies(1)
  }, [])

  const handleMovieClick = (movieId: string) => {
    navigate({ to: '/movies/$movieId', params: { movieId } })
  }

  return (
    <Page>
      <Header>
        <Title>Movies</Title>
        <Subtitle>Browse our collection of movies</Subtitle>
      </Header>

      {store.error && <ErrorMessage>{store.error}</ErrorMessage>}

      {store.isLoading && <LoadingMessage>Loading movies...</LoadingMessage>}

      {!store.isLoading && store.movies.length === 0 && (
        <EmptyMessage>No movies found</EmptyMessage>
      )}

      {!store.isLoading && store.movies.length > 0 && (
        <>
          <MovieGrid>
            {store.movies.map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => handleMovieClick(movie.id)}
              />
            ))}
          </MovieGrid>

          <Pagination
            currentPage={store.currentPage}
            totalPages={store.totalPages}
            onPrevious={() => void store.previousPage()}
            onNext={() => void store.nextPage()}
            isLoading={store.isLoading}
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
