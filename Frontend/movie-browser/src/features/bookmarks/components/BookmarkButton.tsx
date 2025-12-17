import { observer } from 'mobx-react'
import styled from 'styled-components'
import type { IBookmarkStore } from '../store/BookmarkStore'
import type { BookmarkTargetType } from '../types'

export const BookmarkButton = observer(BookmarkButtonBase)

type BookmarkButtonProps = {
    targetId: string
    targetType: BookmarkTargetType
    title?: string
    store: IBookmarkStore
    className?: string
}

function BookmarkButtonBase({
    targetId,
    targetType,
    title,
    store,
    className = ''
}: BookmarkButtonProps) {
    const isBookmarked = store.isBookmarked(targetId, targetType)

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (isBookmarked) {
            void store.removeBookmark(targetId, targetType)
        } else {
            void store.addBookmark(targetId, targetType, title)
        }
    }

    return (
        <Button
            onClick={handleClick}
            className={className}
            $isBookmarked={isBookmarked}
            title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
            {isBookmarked ? '❤️' : '🤍'}
        </Button>
    )
}

const Button = styled.button<{ $isBookmarked: boolean }>`
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
    padding: 0.5rem;
    transition: transform 0.2s ease;
    
    &:hover {
        transform: scale(1.2);
    }
    
    &:active {
        transform: scale(0.95);
    }
`
