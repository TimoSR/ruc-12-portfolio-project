import { useState } from 'react'
import styled from 'styled-components'

interface RatingProps {
    initialRating?: number
    onRate: (rating: number) => void
    readonly?: boolean
}

export const Rating = ({ initialRating = 0, onRate, readonly = false }: RatingProps) => {
    const [hoverRating, setHoverRating] = useState(0)

    const handleMouseEnter = (star: number) => {
        if (!readonly) {
            setHoverRating(star)
        }
    }

    const handleMouseLeave = () => {
        if (!readonly) {
            setHoverRating(0)
        }
    }

    const handleClick = (star: number) => {
        if (!readonly) {
            onRate(star)
        }
    }

    return (
        <Container>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                <Star
                    key={star}
                    $filled={star <= (hoverRating || initialRating)}
                    $readonly={readonly}
                    onMouseEnter={() => handleMouseEnter(star)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(star)}
                >
                    ★
                </Star>
            ))}
            <RatingValue>
                {hoverRating > 0 ? hoverRating : initialRating > 0 ? initialRating : '-'} / 10
            </RatingValue>
        </Container>
    )
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

const Star = styled.span<{ $filled: boolean; $readonly: boolean }>`
  font-size: 1.5rem;
  cursor: ${(props) => (props.$readonly ? 'default' : 'pointer')};
  color: ${(props) => (props.$filled ? '#fbbf24' : '#4b5563')};
  transition: color 0.1s ease, transform 0.1s ease;

  &:hover {
    transform: ${(props) => (props.$readonly ? 'none' : 'scale(1.2)')};
  }
`

const RatingValue = styled.span`
  margin-left: 0.5rem;
  color: #9ca3af;
  font-weight: 600;
  font-size: 1rem;
`
