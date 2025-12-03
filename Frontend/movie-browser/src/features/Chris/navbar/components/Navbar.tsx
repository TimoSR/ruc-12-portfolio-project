import styled from 'styled-components'
import { Link } from '@tanstack/react-router'
import { SearchInput } from '../../search'

export interface NavbarProps {
    className?: string
    isMobileMenuOpen: boolean
    onToggleMobileMenu: () => void
    onCloseMobileMenu: () => void
    searchQuery: string
    onSearchChange: (query: string) => void
    onSearch?: (query: string) => void
}

export const Navbar = ({
    className = '',
    isMobileMenuOpen,
    onToggleMobileMenu,
    onCloseMobileMenu,
    searchQuery,
    onSearchChange,
    onSearch
}: NavbarProps) => {
    return (
        <Nav className={className}>
            <Container>
                <Brand to="/">
                    <BrandIcon>🎬</BrandIcon>
                    <BrandText>MovieBrowser</BrandText>
                </Brand>

                <SearchBarWrapper>
                    <SearchInput
                        value={searchQuery}
                        onChange={onSearchChange}
                        onSearch={onSearch}
                        placeholder="Search movies, people..."
                    />
                </SearchBarWrapper>

                <DesktopLinks>
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/search">Search</NavLink>
                    <NavLink to="/profile">Profile</NavLink>
                </DesktopLinks>

                <MobileMenuButton onClick={onToggleMobileMenu}>
                    {isMobileMenuOpen ? '✕' : '☰'}
                </MobileMenuButton>

                <UserSection>
                    <LoginButton>Login</LoginButton>
                </UserSection>
            </Container>

            {isMobileMenuOpen && (
                <MobileMenu>
                    <MobileSearchWrapper>
                        <SearchInput
                            value={searchQuery}
                            onChange={onSearchChange}
                            onSearch={onSearch}
                            placeholder="Search movies, people..."
                        />
                    </MobileSearchWrapper>
                    <MobileNavLink to="/" onClick={onCloseMobileMenu}>Home</MobileNavLink>
                    <MobileNavLink to="/search" onClick={onCloseMobileMenu}>Search</MobileNavLink>
                    <MobileNavLink to="/profile" onClick={onCloseMobileMenu}>Profile</MobileNavLink>
                </MobileMenu>
            )}
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

const SearchBarWrapper = styled.div`
    flex: 1;
    max-width: 600px;
    display: flex;

    @media (max-width: 1024px) {
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

const MobileMenuButton = styled.button`
    display: none;
    background: none;
    border: none;
    color: var(--color-text);
    font-size: 1.5rem;
    cursor: pointer;
    flex-shrink: 0;

    @media (max-width: 1024px) {
        display: block;
    }
`

const MobileMenu = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem;
    background: var(--color-surface);
    border-top: 1px solid var(--color-border);
    gap: 0.5rem;
    
    @media (min-width: 769px) {
        display: none;
    }
`

const MobileSearchWrapper = styled.div`
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--color-border);
    margin-bottom: 0.5rem;
`

const MobileNavLink = styled(Link)`
    padding: 1rem;
    color: var(--color-text);
    text-decoration: none;
    font-weight: 500;
    border-radius: var(--radius-md);

    &:hover {
        background: var(--color-surface-hover, rgba(255,255,255,0.05));
    }

    &.active {
        color: var(--color-primary);
        background: var(--color-primary-muted, rgba(59, 130, 246, 0.1));
    }
`
