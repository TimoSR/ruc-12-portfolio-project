import { observer, useLocalObservable } from 'mobx-react'
import { NavbarStore } from '../store/NavbarStore'
import { Navbar } from '../components/Navbar'

export interface NavbarSectionProps {
    className?: string
}

const NavbarSectionBase = ({ className = '' }: NavbarSectionProps) => {
    const store = useLocalObservable(() => new NavbarStore())

    return (
        <Navbar
            className={className}
            isMobileMenuOpen={store.isMobileMenuOpen}
            onToggleMobileMenu={store.toggleMobileMenu}
            onCloseMobileMenu={store.closeMobileMenu}
            searchQuery={store.searchQuery}
            onSearchChange={store.setSearchQuery}
            onSearch={store.handleSearch}
        />
    )
}

export const NavbarSection = observer(NavbarSectionBase)
