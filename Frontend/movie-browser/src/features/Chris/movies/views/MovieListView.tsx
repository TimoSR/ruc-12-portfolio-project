import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import styled from 'styled-components'
import { MovieCard } from '../components/MovieCard'
import { Pagination } from '../components/Pagination'
import { movieListQueryOptions } from '../../../../api/queries/movieQueries'
import { movieListRoute, movieDetailsRoute } from '../../../../routes/movies'

type MovieListViewProps = {
  onMovieClick?: (movieId: string) => void
  className?: string
}

export function MovieListView({ onMovieClick, className = '' }: MovieListViewProps) {
  const queryClient = useQueryClient()
  const navigate = useNavigate({ from: movieListRoute.fullPath })

  const search = movieListRoute.useSearch()
  const page = search.page ?? 1
  const query = search.query ?? ''
  const pageSize = search.pageSize ?? 24

  const {
    data,
    isLoading,
    isError,
    error,
    isPlaceholderData,
  } = useQuery({
    ...movieListQueryOptions({ query, page, pageSize }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  })



  const movies = data?.items ?? []
  const totalItems = data?.totalItems ?? 0
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  if (!isPlaceholderData && page < totalPages) {
    queryClient.prefetchQuery({
      ...movieListQueryOptions({
        query,
        page: page + 1,
        pageSize,
      }),
      staleTime: 1000 * 60 * 5,
    })
  }

  const handleNext = () => {
    if (!isPlaceholderData && page < totalPages) {
      navigate({
        search: (old) => ({ ...old, page: (old.page ?? 1) + 1 }),
      })
    }
  }

  const handlePrevious = () => {
    navigate({
      search: (old) => ({ ...old, page: Math.max((old.page ?? 1) - 1, 1) }),
    })
  }

  const handleMovieClick = (movieId: string) => {
    onMovieClick?.(movieId)

    // Preserve list state in the URL so Back restores page/query/pageSize
    navigate({
      to: movieDetailsRoute.fullPath,
      params: { movieId },
      search: (old) => ({
        ...old,
        page,
        pageSize,
        query,
      }),
    })
  }

  return (
    <Container className={className}>
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
          <Grid>
            {movies.map((movie: any) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => handleMovieClick(movie.id)}
              />
            ))}
          </Grid>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPrevious={handlePrevious}
            onNext={handleNext}
            isLoading={isPlaceholderData}
          />
        </>
      )}
    </Container>
  )
}

/* ===========================
   styled-components (same as persons)
   =========================== */

const Container = styled.section`
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem 1.5rem 4rem;
`

/** ✅ 6 per row (with sane fallbacks) */
const Grid = styled.div`
  display: grid;
  gap: 1.5rem;
  margin-bottom: 2rem;

  grid-template-columns: repeat(6, minmax(0, 1fr));

  @media (max-width: 1400px) {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  @media (max-width: 1200px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 650px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 420px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
`

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  color: #fca5a5;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
`

const LoadingMessage = styled.div`
  text-align: center;
  color: #9ca3af;
  padding: 3rem;
`

const EmptyMessage = styled.div`
  text-align: center;
  color: #9ca3af;
  padding: 3rem;
`
