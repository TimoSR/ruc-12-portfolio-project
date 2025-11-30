import { useMemo, useState, useRef, useEffect } from 'react'
import styled from 'styled-components'

type SearchCategory = 'all' | 'titles' | 'people'

type Suggestion = {
  id: string
  label: string
}

type Result = {
  id: string
  title: string
  subtitle: string
  thumb: string
  duration?: string
  type: 'title' | 'person'
}

const popularSuggestions: Suggestion[] = [
  { id: 's1', label: 'stranger things' },
  { id: 's2', label: 'the hunger games' },
  { id: 's3', label: 'landman' },
  { id: 's4', label: 'wicked hidden gems' },
  { id: 's5', label: 'wake up dead man' },
  { id: 's6', label: 'everybody loves raymond' },
]

const mockResults: Result[] = [
  {
    id: 'tt001',
    title: "Catherine Laga'aia",
    subtitle: 'Actress • Moana (2026)',
    thumb:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    duration: '0:59',
    type: 'person',
  },
  {
    id: 'tt002',
    title: 'Catherine Missal',
    subtitle: 'Official Trailer – Season 2',
    thumb:
      'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=400&q=80',
    duration: '2:03',
    type: 'title',
  },
  {
    id: 'tt003',
    title: 'Catherine Cohen',
    subtitle: 'Actress • The Lovebirds (2020)',
    thumb:
      'https://images.unsplash.com/photo-1479708231026-71fd2b83cf04?auto=format&fit=crop&w=400&q=80',
    duration: '2:02',
    type: 'person',
  },
]

export const SearchPanel = () => {
  const [category, setCategory] = useState<SearchCategory>('all')
  const [query, setQuery] = useState<string>('')
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filteredSuggestions = useMemo(() => {
    if (!query.trim()) return popularSuggestions
    return popularSuggestions.filter((suggestion) =>
      suggestion.label.toLowerCase().includes(query.toLowerCase()),
    )
  }, [query])

  const filteredResults = useMemo(() => {
    if (!query.trim()) return mockResults
    return mockResults.filter((result) =>
      result.title.toLowerCase().includes(query.toLowerCase()),
    )
  }, [query])

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isDropdownOpen])

  return (
    <Panel>
      <SearchContainer ref={dropdownRef}>
        <SearchBox>
          <UnifiedSelect
            aria-label="Search filter"
            value={category}
            onChange={(event) => {
              setCategory(event.target.value as SearchCategory)
            }}
          >
            <option value="all">All</option>
            <option value="titles">Titles</option>
            <option value="people">People</option>
          </UnifiedSelect>

          <UnifiedInput
            type="text"
            placeholder="Search IMDb (e.g. 'cat')"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value as string)
            }}
            onFocus={() => {
              if (query.trim()) {
                setIsDropdownOpen(true)
              }
            }}
            onInput={(event) => {
              const value = (event.target as HTMLInputElement).value
              if (value.trim()) {
                setIsDropdownOpen(true)
              } else {
                setIsDropdownOpen(false)
              }
            }}
          />
          <SearchIcon aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M11 3a8 8 0 015.916 13.263l3.41 3.411-1.414 1.414-3.41-3.41A8 8 0 1111 3zm0 2a6 6 0 100 12 6 6 0 000-12z"
              />
            </svg>
          </SearchIcon>
        </SearchBox>

        {isDropdownOpen && (
          <Content>
            {!query.trim() && (
              <SuggestionColumn>
                <SuggestionList>
                  {filteredSuggestions.map((suggestion) => (
                    <SuggestionItem
                      key={suggestion.id}
                      onClick={() => {
                        setQuery(suggestion.label)
                      }}
                    >
                      <SuggestionIcon aria-hidden="true">↻</SuggestionIcon>
                      <SuggestionLabel>{suggestion.label}</SuggestionLabel>
                    </SuggestionItem>
                  ))}
                </SuggestionList>
              </SuggestionColumn>
            )}

            {query.trim() && (
              <ResultsColumn>
                {filteredResults.map((result) => (
                  <ResultCard key={result.id}>
                    <Thumbnail style={{ backgroundImage: `url(${result.thumb})` }}>
                      {result.duration ? <Badge>{result.duration}</Badge> : null}
                    </Thumbnail>
                    <ResultText>
                      <ResultTitle>{result.title}</ResultTitle>
                      <ResultMeta>{result.subtitle}</ResultMeta>
                    </ResultText>
                    <Chevron aria-hidden="true">›</Chevron>
                  </ResultCard>
                ))}
              </ResultsColumn>
            )}
          </Content>
        )}
      </SearchContainer>
    </Panel>
  )
}

const Panel = styled.section`
  width: min(1200px, 100%);
  margin: 2rem auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
`

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
`

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 0.5rem;
  box-shadow: var(--shadow-lg);
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: var(--color-primary);
  }
`

const UnifiedSelect = styled.select`
  background: transparent;
  border: none;
  color: var(--color-text);
  padding: 0.5rem 0.75rem;
  border-right: 1px solid var(--color-border);
  outline: none;
  cursor: pointer;
  font-size: 0.95rem;
  font-family: var(--font-sans);

  option {
    background: var(--color-surface);
    color: var(--color-text);
  }
`

const SearchIcon = styled.span`
  display: inline-flex;
  color: var(--color-primary);
  margin-left: 0.5rem;
  margin-right: 0.5rem;
`

const UnifiedInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: var(--color-text);
  font-size: 1rem;
  font-family: inherit;
  padding: 0.5rem;
  outline: none;

  &::placeholder {
    color: var(--color-text-muted);
  }
`

const Content = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1rem;
  box-shadow: var(--shadow-lg);
  max-height: 70vh;
  overflow-y: auto;
`

const SuggestionColumn = styled.div`
  flex: 1 1 320px;
`

const SuggestionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const SuggestionItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  background: var(--color-bg);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-primary);
    transform: translateX(4px);
  }
`

const SuggestionIcon = styled.span`
  font-size: 0.9rem;
  color: var(--color-primary);
`

const SuggestionLabel = styled.span`
  font-size: 0.95rem;
  color: var(--color-text);
  text-transform: capitalize;
`

const ResultsColumn = styled.div`
  flex: 2 1 420px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const ResultCard = styled.article`
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  display: grid;
  grid-template-columns: 160px 1fr auto;
  gap: 0.75rem;
  padding: 0.5rem;
  align-items: center;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: var(--color-primary);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const Thumbnail = styled.div`
  width: 160px;
  height: 100px;
  border-radius: 4px;
  background-size: cover;
  background-position: center;
  position: relative;

  @media (max-width: 640px) {
    width: 100%;
  }
`

const Badge = styled.span`
  position: absolute;
  bottom: 8px;
  right: 8px;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.8);
  color: var(--color-text);
  font-size: 0.75rem;
`

const ResultText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`

const ResultTitle = styled.span`
  font-weight: 600;
  font-size: 1.05rem;
`

const ResultMeta = styled.span`
  color: var(--color-text-muted);
  font-size: 0.9rem;
`

const Chevron = styled.span`
  font-size: 1.4rem;
  color: var(--color-text-muted);
  padding-right: 0.75rem;

  @media (max-width: 640px) {
    display: none;
  }
`
