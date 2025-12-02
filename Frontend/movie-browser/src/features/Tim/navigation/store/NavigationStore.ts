import { makeAutoObservable } from 'mobx'

export interface INavigationStore {
    isMobileMenuOpen: boolean
    toggleMobileMenu(): void
    closeMobileMenu(): void
}

export class NavigationStore implements INavigationStore {
    
    isMobileMenuOpen: boolean = false

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    toggleMobileMenu(): void {
        this.isMobileMenuOpen = !this.isMobileMenuOpen
    }

    closeMobileMenu(): void {
        this.isMobileMenuOpen = false
    }
}
