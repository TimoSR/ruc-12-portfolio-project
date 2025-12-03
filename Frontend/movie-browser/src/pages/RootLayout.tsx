import { Outlet } from "@tanstack/react-router";
import styled, { createGlobalStyle } from "styled-components";
import { Navigation } from "../features/Tim/navigation";
import { SearchStore, type ISearchStore } from "../features/Tim/search/store/SearchStore";
import { SearchResults } from "../features/Tim/search/components/SearchResults";
import { useLocalObservable } from "mobx-react";

export function RootLayout() {

  const searchStore = useLocalObservable<ISearchStore>(() => new SearchStore())

  return (
    <>
        <GlobalScrollbarFix />
        <Navigation searchStore={searchStore} />

        <SearchResultsOverlay>
          <SearchResultsContainer>
            <SearchResults searchStore={searchStore} />
          </SearchResultsContainer> 
        </SearchResultsOverlay>
        
        <Outlet />
    </>
  )
}

const SearchResultsOverlay = styled.div`
  position: fixed;
  top: 90px;              /* adjust to match your Navigation height */
  left: 0;
  right: 0;

  z-index: 40;

  display: flex;
  justify-content: center;

  pointer-events: none;   /* so clicks pass through where there are no results */
`;

const SearchResultsContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  pointer-events: auto;   /* re-enable clicks on the actual results */
`;


const GlobalScrollbarFix = createGlobalStyle`
  html {
    /* This forces the scrollbar UI to be visible 100% of the time */
    overflow-y: auto;
  }
`