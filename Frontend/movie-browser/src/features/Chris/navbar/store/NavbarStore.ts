import { makeAutoObservable } from 'mobx'

export class NavbarStore {
    isMobileMenuOpen: boolean = false
    searchQuery: string = ''

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    toggleMobileMenu() {
        this.isMobileMenuOpen = !this.isMobileMenuOpen
    }

    closeMobileMenu() {
        this.isMobileMenuOpen = false
    }

    setSearchQuery(query: string) {
        this.searchQuery = query
    }

    handleSearch(query: string) {
        // This will be called when user submits search
        // The navigation is handled in NavbarSearchInput
        console.log('Search submitted:', query)
    }
}
