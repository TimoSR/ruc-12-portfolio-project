// src/pages/HomePage.tsx
import styled, { createGlobalStyle } from 'styled-components'
import { FullWidthSearchSection } from '../features/Tim/search'

export const HomePage = () => {

    return (
        <Page>
            < GlobalScrollbarFix />
            
        </Page>
    )
}

const GlobalScrollbarFix = createGlobalStyle`
  html {
    /* This reserves space for the scrollbar always, preventing the shift */
    overflow-y: scroll;
  }
`

const Page = styled.main`
    max-width: 960px;
    margin: 0 auto;
    padding: 3rem 1.5rem 4rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
`

const HeroRow = styled.section`
    display: grid;
    grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
    gap: 2rem;
    align-items: stretch;

    @media (max-width: 768px) {
        grid-template-columns: minmax(0, 1fr);
    }
`

const HeroContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    justify-content: center;
`

const HeroTitle = styled.h1`
    font-size: 2.25rem;
    font-weight: 800;
    color: #f9fafb;
`

const HeroText = styled.p`
    font-size: 1rem;
    color: #9ca3af;
`

const Toolbar = styled.header`
    display: flex;
    align-items: center;
    gap: 1.5rem;
`

const ToolbarTitle = styled.h2`
    font-size: 1.25rem;
    font-weight: 600;
    color: #f9fafb;
`