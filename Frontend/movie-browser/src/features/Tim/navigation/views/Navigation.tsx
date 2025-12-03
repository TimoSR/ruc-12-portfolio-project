import { observer, useLocalObservable } from 'mobx-react'
import styled from 'styled-components'
import { Link } from '@tanstack/react-router'
import { type INavigationStore, NavigationStore } from '../store/NavigationStore'

export const Navigation = observer(NavigationBase)

type NavigationProps = {
    className?: string
}

function NavigationBase({ className = '' }: NavigationProps) {
    const store = useLocalObservable<INavigationStore>(() => new NavigationStore())

    return (
        <NavContainer className={className}>
            <ContentWrapper>
                <Logo to="/">
                    Movie Browser
                </Logo>

                <DesktopLinks>
                    <StyledLink to="/" activeProps={{ className: 'active' }}>
                        Home
                    </StyledLink>
                    <StyledLink to="/styled" activeProps={{ className: 'active' }}>
                        Styled Demo
                    </StyledLink>
                </DesktopLinks>

                {/* Mobile menu toggle could go here using store.toggleMobileMenu */}
            </ContentWrapper>
        </NavContainer>
    )
}

// === Styled Components ===

const NavContainer = styled.nav`
    position: sticky;
    top: 0;
    z-index: 50;
    width: 100%; // Full viewport width fixes alignment issues
    overflow-x: hidden;
    background: rgba(15, 23, 42, 0.8);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(55, 65, 81, 0.4);
`

const ContentWrapper = styled.div`
    max-width: 1280px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const Logo = styled(Link)`
    font-size: 1.5rem;
    font-weight: 800;
    text-decoration: none;
    background: linear-gradient(to right, #a855f7, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: opacity 0.2s;

    &:hover {
        opacity: 0.9;
    }
`

const DesktopLinks = styled.div`
    display: flex;
    gap: 2rem;
    align-items: center;
`

const StyledLink = styled(Link)`
    color: #9ca3af;
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 500;
    transition: all 0.2s ease;
    position: relative;

    &:hover {
        color: #e5e7eb;
    }

    &.active {
        color: #f9fafb;
        font-weight: 600;
    }

    &.active::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(to right, #a855f7, #ec4899);
        border-radius: 2px;
    }
`
