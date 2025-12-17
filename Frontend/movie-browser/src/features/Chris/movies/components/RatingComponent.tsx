import { observer } from 'mobx-react'
import styled from 'styled-components'
import { useState } from 'react'

interface RatingComponentProps {
    initialRating?: number | null
    onRate: (rating: number) => void
    isLoading?: boolean
}

export const RatingComponent = observer(({ initialRating = 0, onRate, isLoading }: RatingComponentProps) => {
    const [hoverRating, setHoverRating] = useState<number | null>(null)
    const currentRating = initialRating || 0

    const handleMouseEnter = (rating: number) => {
        if (!isLoading) setHoverRating(rating)
    }

    const handleMouseLeave = () => {
        setHoverRating(null)
    }

    const handleClick = (rating: number) => {
        if (!isLoading) onRate(rating)
    }

    return (
        <Container>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                <Star
                    key={star}
                    $filled={star <= (hoverRating ?? currentRating)}
                    onMouseEnter={() => handleMouseEnter(star)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(star)}
                    disabled={isLoading}
                >
                    ★
                </Star>
            ))}
            <RatingValue>{hoverRating ?? currentRating}/10</RatingValue>
        </Container>
    )
})

const Container = styled.div`
    display: flex;
    align-items: center;
    gap: 0.25rem;
`

const Star = styled.button<{ $filled: boolean; disabled?: boolean }>`
    background: none;
    border: none;
    cursor: ${props => props.disabled ? 'wait' : 'pointer'};
    font-size: 1.5rem;
    color: ${props => props.$filled ? '#fbbf24' : '#4b5563'};
    transition: color 0.1s;
    padding: 0;
    line-height: 1;

    &:hover {
        transform: ${props => props.disabled ? 'none' : 'scale(1.1)'};
    }
`

const RatingValue = styled.span`
    margin-left: 0.5rem;
    color: #9ca3af;
    font-size: 0.9rem;
    font-weight: 500;
`
