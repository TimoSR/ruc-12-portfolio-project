import styled, { keyframes } from 'styled-components'

const shimmer = keyframes`
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
`;

const float = keyframes`
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    animation: ${float} 6s ease-in-out infinite;
`;

const Title = styled.h1`
    font-size: 3rem;
    font-weight: 900;
    line-height: 1.2;

    @media (min-width: 640px) {
        font-size: 3.75rem;
    }

    @media (min-width: 1024px) {
        font-size: 4.5rem;
    }
`;

const GradientWrapper = styled.span`
    position: relative;
    display: inline-block;
    overflow: hidden;
`;

const GradientText = styled.span`
    background: linear-gradient(to right, #a855f7, #ec4899, #f472b6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
`;

const ShimmerOverlay = styled.span`
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent);
    background-size: 200% 100%;
    animation: ${shimmer} 2.5s linear infinite;
`;

const Subtitle = styled.span`
    color: white;
`;

const Description = styled.p`
    font-size: 1.25rem;
    color: #e9d5ff;
    line-height: 1.6;
    max-width: 48rem;

    @media (min-width: 1024px) {
        font-size: 1.5rem;
    }
`;

export const HeroSection = () => {
    return (
        <Container>
            <Title>
                <GradientWrapper>
                    <GradientText>
                        Styled Magic
                    </GradientText>
                    <ShimmerOverlay />
                </GradientWrapper>
                <br />
                <Subtitle>Perfected 💎</Subtitle>
            </Title>
            <Description>
                Harness the power of CSS-in-JS with dynamic theming, scoped styles,
                and component-based architecture that makes styling a breeze.
            </Description>
        </Container>
    )
}