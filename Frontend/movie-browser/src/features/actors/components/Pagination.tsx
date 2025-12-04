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
    return (
        <Container className={className}>
            <Button
                onClick={onPrevious}
                disabled={currentPage <= 1 || isLoading}
            >
                ← Previous
            </Button>
            <PageInfo>
                Page {currentPage} of {totalPages}
            </PageInfo>
            <Button
                onClick={onNext}
                disabled={currentPage >= totalPages || isLoading}
            >
                Next →
            </Button>
        </Container>
    )
}

// === Styled Components ===

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem 0;
`

const Button = styled.button`
  background: linear-gradient(145deg, #3b3b5c, #2a2a3e);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #f9fafb;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: linear-gradient(145deg, #4b4b6c, #3a3a4e);
    border-color: rgba(139, 92, 246, 0.5);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const PageInfo = styled.span`
  color: #9ca3af;
  font-size: 0.875rem;
`
