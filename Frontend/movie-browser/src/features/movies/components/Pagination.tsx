import { observer } from 'mobx-react'
import styled from 'styled-components'

export const Pagination = observer(PaginationBase)

type PaginationProps = {
    currentPage: number
    totalPages: number
    onPrevious: () => void
    onNext: () => void
    isLoading?: boolean
    className?: string
}

function PaginationBase({
    currentPage,
    totalPages,
    onPrevious,
    onNext,
    isLoading = false,
    className = ''
}: PaginationProps) {
    const hasPrevious = currentPage > 1
    const hasNext = currentPage < totalPages

    return (
        <Container className={className}>
            <Button
                onClick={onPrevious}
                disabled={!hasPrevious || isLoading}
            >
                ← Previous
            </Button>

            <PageInfo>
                Page {currentPage} of {totalPages}
            </PageInfo>

            <Button
                onClick={onNext}
                disabled={!hasNext || isLoading}
            >
                Next →
            </Button>
        </Container>
    )
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 2rem 0;
`

const Button = styled.button`
  background: linear-gradient(to right, rgba(168, 85, 247, 0.95), rgba(236, 72, 153, 0.95));
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:enabled {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(168, 85, 247, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const PageInfo = styled.span`
  color: #9ca3af;
  font-weight: 500;
`
