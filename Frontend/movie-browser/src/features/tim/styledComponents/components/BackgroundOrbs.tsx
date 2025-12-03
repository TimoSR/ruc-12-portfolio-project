import styled, { keyframes } from 'styled-components'

export const BackgroundOrbs = () => {
    return (
        <>
            <Orb1 />
            <Orb2 />
            <Orb3 />
        </>
    )
}

const blob = keyframes`
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
`

const Orb1 = styled.div`
    position: absolute;
    top: 0;
    left: -5rem;
    width: 24rem;
    height: 24rem;
    background: linear-gradient(to right, #a855f7, #ec4899);
    border-radius: 9999px;
    mix-blend-mode: screen;
    filter: blur(64px);
    opacity: 0.3;
    animation: ${blob} 7s infinite;
`

const Orb2 = styled.div`
    position: absolute;
    top: 5rem;
    right: -5rem;
    width: 24rem;
    height: 24rem;
    background: linear-gradient(to right, #9333ea, #db2777);
    border-radius: 9999px;
    mix-blend-mode: screen;
    filter: blur(64px);
    opacity: 0.3;
    animation: ${blob} 7s infinite;
    animation-delay: 2s;
`

const Orb3 = styled.div`
    position: absolute;
    bottom: -5rem;
    left: 33%;
    width: 24rem;
    height: 24rem;
    background: linear-gradient(to right, #c026d3, #a855f7);
    border-radius: 9999px;
    mix-blend-mode: screen;
    filter: blur(64px);
    opacity: 0.3;
    animation: ${blob} 7s infinite;
    animation-delay: 4s;
`