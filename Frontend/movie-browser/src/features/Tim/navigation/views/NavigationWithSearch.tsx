import { observer } from "mobx-react"
import { SearchResults } from "../../search/components/SearchResults"
import { Navigation } from "./Navigation"
import styled from "styled-components"

export const NavigationWithSearch = observer(() => {

  return (
    <>
      <Navigation />
      <SearchResultsOverlay>
        <SearchResultsContainer>
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
