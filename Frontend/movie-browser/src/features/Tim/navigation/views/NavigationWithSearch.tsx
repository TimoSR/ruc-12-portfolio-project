import { observer, useLocalObservable } from "mobx-react"
import { SearchResults } from "../../search/components/SearchResults"
import { type ISearchStore, SearchStore } from "../../search/store/SearchStore"
import { Navigation } from "./Navigation"
import styled from "styled-components"

export const NavigationWithSearch = observer(() => {

  const searchStore = useLocalObservable<ISearchStore>(() => new SearchStore())

  return (
    <>
        <Navigation searchStore={searchStore} />
        <SearchResultsOverlay>
          <SearchResultsContainer>
            <SearchResults searchStore={searchStore} />
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
