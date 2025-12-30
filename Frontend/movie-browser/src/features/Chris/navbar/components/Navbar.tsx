import styled from 'styled-components'
import { Link } from '@tanstack/react-router'

export interface NavbarProps {
    className?: string
}

export const Navbar = ({
    className = '',
}: NavbarProps) => {
    return (
        <Nav className={className}>
            <Container>
                <Brand to="/">
                    <BrandIcon>🎬</BrandIcon>
                    <BrandText>MovieBrowser</BrandText>
                </Brand>

                <DesktopLinks>
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/movies">Movies</NavLink>
                    <NavLink to="/bookmarks">Bookmarks</NavLink>
                    <NavLink to="/profile">Profile</NavLink>
                </DesktopLinks>

                <UserSection>
                    <LoginButton>Login</LoginButton>
                </UserSection>
            </Container>
        </Nav>
    )
}

const Nav = styled.nav`
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(10px);
`

const Container = styled.div`
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1.5rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    height: 4rem;

    @media (max-width: 768px) {
        gap: 1rem;
    }
`

const Brand = styled(Link)`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    color: var(--color-text);
    font-weight: 700;
    font-size: 1.25rem;
    transition: opacity 0.2s ease;
    flex-shrink: 0;

    &:hover {
        opacity: 0.8;
    }
`

const BrandIcon = styled.span`
    font-size: 1.5rem;
`

const BrandText = styled.span`
    @media (max-width: 640px) {
        display: none;
    }
`



const DesktopLinks = styled.div`
    display: flex;
    align-items: center;
    gap: 1.5rem;

    @media (max-width: 1024px) {
        display: none;
    }
`

const NavLink = styled(Link)`
    color: var(--color-text-muted);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;
    white-space: nowrap;

    &:hover {
        color: var(--color-text);
    }

    &.active {
        color: var(--color-primary);
    }
`

const UserSection = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-shrink: 0;

    @media (max-width: 1024px) {
        display: none;
    }
`

const LoginButton = styled.button`
    background: var(--color-primary);
    color: white;
    border: none;
    padding: 0.5rem 1.25rem;
    border-radius: var(--radius-md);
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s ease;
    white-space: nowrap;

    &:hover {
        opacity: 0.9;
    }
`