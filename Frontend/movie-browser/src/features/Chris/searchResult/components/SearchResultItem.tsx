import styled from 'styled-components'
import type { SearchResultItem as SearchResultItemType } from '../store/SearchResultStore'

interface SearchResultItemProps {
    item: SearchResultItemType
    className?: string
}

export const SearchResultItem = ({ item, className = '' }: SearchResultItemProps) => {
    return (
        <ItemWrapper className={className}>
            <ImageWrapper>
                {item.image ? (
                    <Image src={item.image} alt={item.title} />
                ) : (
                    <Placeholder>{item.title[0]}</Placeholder>
                )}
            </ImageWrapper>
            <Content>
                <Title>{item.title}</Title>
                {item.description && <Description>{item.description}</Description>}
            </Content>
            <Action>
                <PlusIcon>+</PlusIcon>
            </Action>
        </ItemWrapper>
    )
}

const ItemWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--color-border);
    background: transparent;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: rgba(255, 255, 255, 0.03);
    }
    
    &:last-child {
        border-bottom: none;
    }
`

const ImageWrapper = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    background: var(--color-surface-variant);
    display: flex;
    align-items: center;
    justify-content: center;
`

const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`

const Placeholder = styled.span`
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text-muted);
    text-transform: uppercase;
`

const Content = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
`

const Title = styled.h3`
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text);
`

const Description = styled.p`
    margin: 0;
    font-size: 0.875rem;
    color: var(--color-text-muted);
`

const Action = styled.div`
    padding: 0 0.5rem;
`

const PlusIcon = styled.button`
    background: none;
    border: none;
    color: var(--color-primary);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease;

    &:hover {
        transform: scale(1.1);
    }
`
