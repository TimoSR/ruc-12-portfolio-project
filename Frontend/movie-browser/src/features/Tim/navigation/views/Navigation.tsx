// Navigation.tsx
import { observer, useLocalObservable } from 'mobx-react'
import styled from 'styled-components'
import { Link } from '@tanstack/react-router'

import { WideSearchInput } from '../../search'
import { AuthStore, type IAuthStore } from '../../../Chris/auth/store/AuthStore'

export const Navigation = observer(NavigationBase)

type NavigationProps = {
    className?: string
}

function NavigationBase({ className = '' }: NavigationProps) {
    const authStore = useLocalObservable<IAuthStore>(() => new AuthStore())

    return (
        <NavContainer className={className}>
            <ContentWrapper>
                <Logo to="/">
                    Movie Browser
                </Logo>

                <SearchContainer>
                    <WideSearchInput />
                </SearchContainer>

                <DesktopLinks>
                    <StyledLink to="/" activeProps={{ className: 'active' }}>
                        Home
                    </StyledLink>
                    <StyledLink to="/movies" activeProps={{ className: 'active' }}>
                        Movies
                    </StyledLink>
                    <StyledLink to="/persons" activeProps={{ className: 'active' }}>
                        Persons
                    </StyledLink>

                    {authStore.token ? (
                        <NavButton onClick={authStore.logout}>
                            Logout
                        </NavButton>
                    ) : (
                        <StyledLink to="/login" activeProps={{ className: 'active' }}>
                            Login
                        </StyledLink>
                    )}
                </DesktopLinks>
            </ContentWrapper>
        </NavContainer>
    )
}

// === Styled Components ===

const NavContainer = styled.nav`
    position: sticky;
    top: 0;
    width: 100%;
    overflow-x: hidden;
    z-index: 40;
    background: rgba(15, 23, 42, 0.8);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(55, 65, 81, 0.4);
`

const ContentWrapper = styled.div`
    max-width: 1280px;
    margin: 0 auto;
    padding: 2.3rem 2rem;

    display: flex;
    align-items: center;
    justify-content: space-between;

    position: relative;  /* anchor for absolute search */
`

const Logo = styled(Link)`
    flex-shrink: 0;
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

/**
 * This is the magic:
 *  - absolutely centered in the wrapper
 *  - has a fixed/max width so it can grow
 *  - does NOT care about how wide logo/links are
 */
const SearchContainer = styled.div`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    width: min(600px, 100% - 4rem);  /* bigger input + some side padding */

    display: flex;
    align-items: center;
    justify-content: center;

    & > * {
        width: 100%;  /* WideSearchInput fills this area */
    }
`

const DesktopLinks = styled.div`
    flex-shrink: 0;
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

const NavButton = styled.button`
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    color: #9ca3af;
    font-size: 0.95rem;
    font-weight: 500;
    transition: all 0.2s ease;
    position: relative;

    &:hover {
        color: #e5e7eb;
    }
`
