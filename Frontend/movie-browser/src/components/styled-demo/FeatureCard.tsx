import { type ReactNode } from 'react'
import styled from 'styled-components'

export const FeatureCard = ({ title, description, icon, color, className = '' }: FeatureCardProps) => {
    return (
        <Card $color={color} className={className}>
            <Glow />
            <Content>
                <IconContainer $color={color}>
                    {icon}
                </IconContainer>
                <TextContainer>
                    <Title>{title}</Title>
                    <Description>
                        {description}
                    </Description>
                </TextContainer>
            </Content>
        </Card>
    )
}

export const CardColor = {
    Purple: 'purple',
    Pink: 'pink',
    Fuchsia: 'fuchsia',
    Orange: 'orange'
} as const

export type CardColor = typeof CardColor[keyof typeof CardColor]

interface FeatureCardProps {
    title: string
    description: string
    icon: ReactNode
    color: CardColor
    className?: string
}

const Card = styled.div<{ $color: CardColor }>`
    position: relative;
    padding: 2.5rem;
    background: ${props => {
        if (props.$color === CardColor.Purple) return 'linear-gradient(to bottom right, rgba(168, 85, 247, 0.4), rgba(168, 85, 247, 0.1))'
        if (props.$color === CardColor.Pink) return 'linear-gradient(to bottom right, rgba(236, 72, 153, 0.4), rgba(236, 72, 153, 0.1))'
        return 'linear-gradient(to bottom right, rgba(192, 38, 211, 0.4), rgba(192, 38, 211, 0.1))'
    }};
    overflow: hidden;
    border-radius: 1.5rem;
    border: 1px solid ${props => {
        if (props.$color === CardColor.Purple) return 'rgba(168, 85, 247, 0.2)'
        if (props.$color === CardColor.Pink) return 'rgba(236, 72, 153, 0.2)'
        if (props.$color === CardColor.Orange) return 'rgba(239, 80, 18, 0.2)'
        return 'rgba(192, 38, 211, 0.2)'
    }};
    transition: all 0.5s;
    cursor: default;

    &:hover {
        transform: scale(1.05);
        box-shadow: ${props => {
        if (props.$color === CardColor.Purple) return '0 20px 25px -5px rgba(168, 85, 247, 0.2)'
        if (props.$color === CardColor.Pink) return '0 20px 25px -5px rgba(236, 72, 153, 0.2)'
        return '0 20px 25px -5px rgba(192, 38, 211, 0.2)'
    }};
        border-color: ${props => {
        if (props.$color === CardColor.Purple) return 'rgba(168, 85, 247, 0.4)'
        if (props.$color === CardColor.Pink) return 'rgba(236, 72, 153, 0.4)'
        return 'rgba(192, 38, 211, 0.4)'
    }};
    }
`;

const Glow = styled.div`
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom right, rgba(168, 85, 247, 0), rgba(168, 85, 247, 0.1));
    border-radius: 1.5rem;
    opacity: 0;
    transition: opacity 0.5s;

    ${Card}:hover & {
        opacity: 1;
    }
`;

const Content = styled.div`
    position: relative;
    display: flex;
    align-items: start;
    gap: 1.5rem;
`;

const IconContainer = styled.div<{ $color: CardColor }>`
    flex-shrink: 0;
    height: 4rem;
    width: 4rem;
    background: ${props => {
        if (props.$color === CardColor.Purple) return 'linear-gradient(to bottom right, #a855f7, #9333ea)'
        if (props.$color === CardColor.Pink) return 'linear-gradient(to bottom right, #ec4899, #db2777)'
        return 'linear-gradient(to bottom right, #c026d3, #a855f7)'
    }};
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    box-shadow: ${props => {
        if (props.$color === CardColor.Purple) return '0 10px 15px -3px rgba(168, 85, 247, 0.3)'
        if (props.$color === CardColor.Pink) return '0 10px 15px -3px rgba(236, 72, 153, 0.3)'
        return '0 10px 15px -3px rgba(192, 38, 211, 0.3)'
    }};
    transition: transform 0.3s;

    &:hover {
        transform: scale(1.1);
    }
`;

const TextContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
`;

const Title = styled.h3`
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
`;

const Description = styled.p`
    line-height: 1.6;
    color: #e9d5ff;
`;