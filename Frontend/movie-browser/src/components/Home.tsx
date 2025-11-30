import { observer } from 'mobx-react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import { Link } from '@tanstack/react-router'
import styled, { keyframes } from 'styled-components'
import { counterStore } from '../stores/CounterStore'
import { SearchPanel } from './search-panel'

export const Home = observer(() => {
    return (
        <Container>
            <SearchPanel />
            <Hero>
                <Logos>
                    <a href="https://vite.dev" target="_blank">
                        <Logo src={viteLogo} alt="Vite logo" />
                    </a>
                    <a href="https://react.dev" target="_blank">
                        <Logo src={reactLogo} className="react" alt="React logo" />
                    </a>
                </Logos>
                <Title>Vite + React + MobX</Title>
                <Description>
                    A premium starting point for your next big idea.
                    Powered by Class-based MobX logic and Code-based Routing.
                </Description>

                <Grid>
                    <DemoCard to="/styled" $hoverColor="rgba(234, 179, 8, 0.2)">
                        <Glow $color="#eab308" />
                        <CardTitle>Styled Components 💅</CardTitle>
                        <CardDescription>Dynamic CSS-in-JS with props and theming.</CardDescription>
                    </DemoCard>
                </Grid>
            </Hero>

            <Card>
                <Button onClick={counterStore.increment}>
                    Count is {counterStore.count}
                </Button>
                <Text>
                    Double count: {counterStore.doubleCount}
                </Text>
                <Text style={{ marginTop: '1rem' }}>
                    Edit <CodeText>src/components/Home.tsx</CodeText> to update this page
                </Text>
            </Card>
        </Container>
    )
})

const logoSpin = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`

const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`

const Container = styled.div`
    max-width: 1280px;
    margin: 0 auto;
    padding: 6rem 2rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    @media (min-width: 1024px) {
        padding: 8rem 3rem;
    }
`

const Hero = styled.div`
    text-align: center;
    margin-bottom: 6rem;
    animation: ${fadeIn} 0.8s ease-out;
`

const Logos = styled.div`
    display: flex;
    gap: 3rem;
    justify-content: center;
    margin-bottom: 3rem;
`

const Logo = styled.img`
    height: 6rem;
    padding: 1rem;
    will-change: filter;
    transition: filter 300ms;

    &:hover {
        filter: drop-shadow(0 0 2em #646cffaa);
    }

    &.react {
        animation: ${logoSpin} infinite 20s linear;

        &:hover {
            filter: drop-shadow(0 0 2em #61dafbaa);
        }
    }
`

const Title = styled.h1`
    font-size: 4rem;
    margin-bottom: 2rem;
    background: linear-gradient(to right, #60a5fa, #a855f7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
`

const Description = styled.p`
    font-size: 1.25rem;
    color: var(--color-text-muted);
    max-width: 700px;
    margin: 0 auto;
    line-height: 1.8;
`

const Grid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    max-width: 64rem;
    width: 100%;
    margin-top: 3rem;

    @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
    }
`

const DemoCard = styled(Link) <{ $hoverColor: string }>`
    position: relative;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1.5rem;
    transition: all 0.3s ease;
    text-decoration: none;
    cursor: pointer;

    &:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: scale(1.05);
        box-shadow: 0 20px 25px -5px ${props => props.$hoverColor};
    }
`

const Glow = styled.div<{ $color: string }>`
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom right, ${props => props.$color}00, ${props => props.$color}1a);
    border-radius: 1.5rem;
    opacity: 0;
    transition: opacity 0.5s;

    ${DemoCard}:hover & {
        opacity: 1;
    }
`

const CardTitle = styled.h2`
    position: relative;
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
    margin-bottom: 0.5rem;
`

const CardDescription = styled.p`
    position: relative;
    color: #94a3b8;
`

const Card = styled.div`
    background-color: var(--color-surface);
    padding: 3rem;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--color-border);
    text-align: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    margin-top: 2rem;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
        border-color: var(--color-primary);
    }
`

const Button = styled.button`
    background-color: var(--color-primary);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius-md);
    font-weight: 600;
    transition: background-color 0.2s ease;
    font-size: 1rem;
    border: none;
    cursor: pointer;

    &:hover {
        background-color: var(--color-primary-hover);
    }
`

const Text = styled.p`
    margin-top: 0.5rem;
    color: var(--color-text-muted);
`

const CodeText = styled.code`
    background: rgba(255, 255, 255, 0.1);
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
`