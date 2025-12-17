import styled from 'styled-components'

interface BookmarkButtonProps {
    isBookmarked: boolean
    isLoading?: boolean
    onClick: () => void
    className?: string
}

export const BookmarkButton = ({ isBookmarked, isLoading, onClick, className }: BookmarkButtonProps) => {
    return (
        <StyledButton
            onClick={onClick}
            $active={isBookmarked}
            disabled={isLoading}
            className={className}
        >
            {isBookmarked ? '★ Bookmarked' : '☆ Bookmark'}
        </StyledButton>
    )
}

const StyledButton = styled.button<{ $active: boolean }>`
    width: 100%;
    padding: 0.75rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    
    background: ${props => props.$active ? 'rgba(234, 179, 8, 0.2)' : 'rgba(31, 41, 55, 0.8)'};
    border: 1px solid ${props => props.$active ? 'rgba(234, 179, 8, 0.5)' : 'rgba(75, 85, 99, 0.5)'};
    color: ${props => props.$active ? '#facc15' : '#9ca3af'};

    &:hover {
        background: ${props => props.$active ? 'rgba(234, 179, 8, 0.3)' : 'rgba(55, 65, 81, 0.9)'};
        color: ${props => props.$active ? '#fde047' : '#f3f4f6'};
    }
    
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`
