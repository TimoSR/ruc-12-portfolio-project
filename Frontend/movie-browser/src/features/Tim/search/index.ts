import styled from "styled-components"
import { SearchSection } from "./views/SearchSection"
import { SearchForm } from "./components/SearchForm";

// === Export individual components ===
export { SearchSection } from "./views/SearchSection"

// Search

export const WideSearchInput = styled(SearchForm)`
  width: 100%;
`;

// === layout variants of the *view* SearchSection ===

export const RightAlignedSearchSection = styled(SearchSection)`
    margin-left: auto;
    max-width: 420px;
    width: 100%;
`

export const FullWidthSearchSection = styled(SearchSection)`
    width: 100%;
`

// === layout variants of the *view* x... ===