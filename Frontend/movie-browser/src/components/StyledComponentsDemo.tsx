import { Link } from '@tanstack/react-router'
import styled from 'styled-components'
import { BackgroundOrbs } from './styled-demo/BackgroundOrbs'
import { HeroSection } from './styled-demo/HeroSection'
import { FeatureCard, CardColor } from './styled-demo/FeatureCard'

export const StyledComponentsDemo = () => {
  return (
    <Container>
      <BackgroundOrbs />

      <Content>
        <Grid>
          {/* Left Column - Hero Content */}
          <LeftColumn>
            <HeroSection />
          </LeftColumn>

          {/* Right Column - Feature Cards */}
          <RightColumn>
            <FeatureCard
              title="Component-Based"
              description="Style your components directly. No more mapping class names to CSS files."
              icon="🎨"
              color={CardColor.Purple}
            />
            <FeatureCard
              title="Dynamic Theming"
              description="Adapt styles based on props. Pass data directly to your styles for powerful dynamic UIs."
              icon="🎭"
              color={CardColor.Pink}
            />
            <FeatureCard
              title="Scoped Styles"
              description="Automatically scoped styles prevent conflicts. Write CSS without worrying about global namespace pollution."
              icon="🔒"
              color={CardColor.Fuchsia}
            />
          </RightColumn>
        </Grid>

        <BackLink to="/">
          ← Back Home
        </BackLink>
      </Content>
    </Container>
  )
}

const Container = styled.div`
    min-height: 100vh;
    background: linear-gradient(to bottom right, #591c8773, #0c0313, #581c87);
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const Content = styled.div`
    position: relative;
    max-width: 80rem;
    margin-left: auto;
    margin-right: auto;
    padding: 6rem 2rem;

    @media (min-width: 1024px) {
        padding: 8rem 3rem;
    }
`

const Grid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;

    @media (min-width: 1024px) {
        grid-template-columns: repeat(12, 1fr);
        gap: 4rem;
    }
`

const LeftColumn = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 3.5rem;

    @media (min-width: 1024px) {
        grid-column: span 7;
    }
`

const RightColumn = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;

    @media (min-width: 640px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1024px) {
        grid-column: span 5;
        grid-template-columns: 1fr;
    }
`

const BackLink = styled(Link)`
    margin-top: 4rem;
    color: #e879f9;
    text-decoration: none;
    font-size: 1.125rem;
    font-weight: 600;
    text-align: center;
    display: block;

    &:hover {
        text-decoration: underline;
    }
`