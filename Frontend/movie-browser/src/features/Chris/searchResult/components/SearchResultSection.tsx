import { useState } from 'react'
import styled from 'styled-components'
import type { SearchResultItem as SearchResultItemType } from '../store/SearchResultStore'
import { SearchResultItem } from './SearchResultItem'

interface SearchResultSectionProps {
    title: string
    items: SearchResultItemType[]
    className?: string
}

export const SearchResultSection = ({ title, items, className = '' }: SearchResultSectionProps) => {
    const [isExpanded, setIsExpanded] = useState(false)

    if (items.length === 0) return null

    const displayedItems = isExpanded ? items : items.slice(0, 5)
    const hasMore = items.length > 5

    return (
        <SectionWrapper className={className}>
            <SectionHeader>
                <SectionTitle>{title}</SectionTitle>
                <ResultCount>{items.length} results</ResultCount>
            </SectionHeader>

            <ItemsList>
                {displayedItems.map(item => (
                    <SearchResultItem key={item.id} item={item} />
                ))}
            </ItemsList>

            {hasMore && !isExpanded && (
                <ShowMoreButton onClick={() => setIsExpanded(true)}>
                    Show more popular matches <ChevronDown>▼</ChevronDown>
                </ShowMoreButton>
            )}
        </SectionWrapper>
    )
}

const SectionWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
`

const SectionHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 0.5rem;
    border-left: 4px solid var(--color-primary);
    padding-left: 1rem;
`

const SectionTitle = styled.h2`
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--color-text);
    margin: 0;
`

const ResultCount = styled.span`
    font-size: 0.9rem;
    color: var(--color-text-muted);
`

const ItemsList = styled.div`
    display: flex;
    flex-direction: column;
`

const ShowMoreButton = styled.button`
    background: none;
    border: none;
    color: var(--color-primary);
    font-weight: 600;
    font-size: 0.9rem;
    padding: 0.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
    transition: opacity 0.2s ease;

    &:hover {
        opacity: 0.8;
    }
`

const ChevronDown = styled.span`
    font-size: 0.7rem;
`
