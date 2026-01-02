import { observer } from "mobx-react"
import { SearchResults } from "../../search/components/SearchResults"
import { Navigation } from "./Navigation"
import styled from "styled-components"

import { useRef, useEffect } from "react"
import { searchStore } from "../../search/store/SearchStore"

export const NavigationWithSearch = observer(() => {
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      const form = document.getElementById('main-search-form')

      const clickedInsideResults = resultsRef.current?.contains(target)
      const clickedInsideForm = form?.contains(target)

      if (!clickedInsideResults && !clickedInsideForm) {
        searchStore.setResultsVisible(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <>
      <Navigation />
      <SearchResultsOverlay>
        <SearchResultsContainer ref={resultsRef}>
          <SearchResults />
        </SearchResultsContainer>
      </SearchResultsOverlay>
    </>
  )
})

const SearchResultsOverlay = styled.div`
  position: fixed;
  top: 5.2rem;              /* adjust to match your Navigation height */
  left: 0;
  right: 0;

  z-index: 40;

  display: flex;
  justify-content: center;

  pointer-events: none;   /* so clicks pass through where there are no results */
`;

const SearchResultsContainer = styled.div`
  width: 100%;
  max-width: 600px;
  pointer-events: auto;   /* re-enable clicks on the actual results */
`;
