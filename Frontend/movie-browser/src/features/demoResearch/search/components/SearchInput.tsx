import { useId, type ChangeEvent, type KeyboardEvent, type ReactNode } from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import type { ISearchStore } from '../store/SearchStore'

type SearchInputProps = {
    searchStore: ISearchStore
    placeholder?: string
    icon?: ReactNode
    autoFocus?: boolean
    className?: string
}

function SearchInputBase ({
    searchStore,
    placeholder = 'Search...',
    icon,
    autoFocus = false,
    className = ''
 }: SearchInputProps) {

    const inputId = useId();
    const hasQuery = searchStore.query.trim().length > 0;

    const effectiveIcon = icon ?? (
        <DefaultIcon>
            🔍
        </DefaultIcon>
    )

    function handleChange (event: ChangeEvent<HTMLInputElement>): void {
        searchStore.setQuery(event.target.value)
        searchStore.searchDebounced(350)
    }

    function handleKeyDown (event: KeyboardEvent<HTMLInputElement>): void {
        if (event.key === 'Enter') {
            event.preventDefault()
            searchStore.searchNow()
            return
        }

        if (event.key === 'Escape') {
            event.preventDefault()
            if (hasQuery) {
                searchStore.clear()
            }
        }
    }

    function handleClear (): void {
        searchStore.clear()
    }

    function handleSearch (): void {
        void searchStore.searchNow()
    }

    return (
        <Root className={className}>
            <FieldWrapper $isLoading={searchStore.isSearching}>
                <FieldGlow />

                <FieldInner>
                    <IconSlot>
                        {effectiveIcon}
                    </IconSlot>

                    <InputElement
                        id={inputId}
                        type="search"
                        value={searchStore.query}
                        placeholder={placeholder}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        autoFocus={autoFocus}
                        autoComplete="off"
                    />
                    
                    { hasQuery ? (
                        <ClearButton type="button" onClick={handleClear}>×</ClearButton>
                    ) : null}
                    
                    <SearchButton type="button" onClick={handleSearch} disabled={searchStore.isSearching}>
                        {searchStore.isSearching ? 'Searching...' : 'Search'}
                    </SearchButton>

                </FieldInner>
            </FieldWrapper>
        </Root>
    )
}

export const SearchInput = observer(SearchInputBase)

/* ===========================
   styled-components
   =========================== */

const Root = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
    min-width: 0;
`

const FieldWrapper = styled.div<{ $isLoading: boolean }>`
    position: relative;
    border-radius: 9999px;
    background: radial-gradient(circle at top left, rgba(168, 85, 247, 0.15), transparent);
    opacity: ${props => (props.$isLoading ? 0.9 : 1)};
    transition: opacity 0.2s ease;
    width: 100%;
    min-width: 0;
`

const FieldGlow = styled.div`
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    opacity: 0;
    background: radial-gradient(circle at top left, rgba(168, 85, 247, 0.3), transparent);
    transition: opacity 0.3s ease;

    ${FieldWrapper}:focus-within & {
        opacity: 1;
    }
`

const FieldInner = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 0.75rem 0.75rem 1rem;
    border-radius: inherit;
    border: 1px solid rgba(148, 163, 184, 0.4);
    background: radial-gradient(circle at top left, rgba(15, 23, 42, 0.98), rgba(15, 23, 42, 0.92));
    box-shadow:
            0 10px 40px rgba(15, 23, 42, 0.7),
            inset 0 0 0 1px rgba(15, 23, 42, 0.9);
    transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            transform 0.15s ease;
    overflow: hidden;
    width: 100%;
    min-width: 0;

    &:hover {
        border-color: rgba(168, 85, 247, 0.5);
    }

    ${FieldWrapper}:focus-within & {
        border-color: rgba(168, 85, 247, 0.8);
        box-shadow:
                0 20px 50px rgba(88, 28, 135, 0.55),
                inset 0 0 0 1px rgba(15, 23, 42, 0.9);
        transform: translateY(-1px);
    }
`

const IconSlot = styled.div`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2rem;
    width: 2rem;
    border-radius: 9999px;
    background: radial-gradient(circle at top left, rgba(168, 85, 247, 0.3), rgba(88, 28, 135, 0.8));
    box-shadow:
            0 8px 16px rgba(88, 28, 135, 0.5),
            0 0 0 1px rgba(15, 23, 42, 0.8);
`

const DefaultIcon = styled.span`
    font-size: 1.125rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
`

const InputElement = styled.input`
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    color: #e5e7eb;
    font-size: 0.95rem;
    line-height: 1.5;
    min-width: 0;

    &::placeholder {
        color: #6b7280;
    }

    &::-webkit-search-decoration,
    &::-webkit-search-cancel-button,
    &::-webkit-search-results-button,
    &::-webkit-search-results-decoration {
        -webkit-appearance: none;
    }
`

const ClearButton = styled.button`
    flex-shrink: 0;
    margin-right: 0.25rem;
    border: none;
    outline: none;
    border-radius: 9999px;
    height: 1.75rem;
    width: 1.75rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(15, 23, 42, 0.9);
    color: #9ca3af;
    font-size: 1.1rem;
    cursor: pointer;
    transition:
            background 0.15s ease,
            color 0.15s ease,
            transform 0.1s ease;

    &:hover {
        background: rgba(31, 41, 55, 1);
        color: #e5e7eb;
        transform: scale(1.05);
    }

    &:active {
        transform: scale(0.98);
    }
`

const SearchButton = styled.button`
    flex-shrink: 0;
    border: none;
    outline: none;
    border-radius: 9999px;
    padding: 0.4rem 0.9rem;
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    cursor: pointer;

    background: linear-gradient(
            to right,
            rgba(168, 85, 247, 0.95),
            rgba(236, 72, 153, 0.95)
    );
    color: white;
    box-shadow:
            0 10px 20px rgba(168, 85, 247, 0.4),
            0 0 0 1px rgba(15, 23, 42, 0.9);
    transition:
            transform 0.15s ease,
            box-shadow 0.15s ease,
            filter 0.15s ease,
            opacity 0.15s ease;

    &:hover:enabled {
        filter: brightness(1.05);
        transform: translateY(-0.5px);
        box-shadow:
                0 16px 30px rgba(168, 85, 247, 0.5),
                0 0 0 1px rgba(15, 23, 42, 0.9);
    }

    &:active:enabled {
        transform: translateY(0);
        box-shadow:
                0 8px 16px rgba(88, 28, 135, 0.6),
                0 0 0 1px rgba(15, 23, 42, 0.9);
    }

    &:disabled {
        opacity: 0.7;
        cursor: default;
    }
`