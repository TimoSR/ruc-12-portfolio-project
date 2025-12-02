import styled from "styled-components"
import { SearchSection } from "./views/SearchSection"
import { SearchInput } from "./components/SearchInput"

// === Export individual components ===
export { SearchInput }

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