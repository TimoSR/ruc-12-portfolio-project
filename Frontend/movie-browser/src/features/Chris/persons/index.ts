// Stores
export { ActorStore, type IActorStore } from './store/ActorStore'
export { PersonDetailsStore, type IPersonDetailsStore } from './store/PersonDetailsStore'

// Components
export { PersonCard as ActorCard } from './components/PersonCard'
export { Pagination } from './components/Pagination'

// Views
export { PersonDetailsView } from './views/PersonDetailsView'
export { PersonListView } from './views/PersonListView'

// Types
export interface PersonItem {
    nconst: string
    primaryName: string
    birthYear?: number
    deathYear?: number
    primaryProfession?: string[]
    knownForTitles?: string[]
    averageRating?: number
}

export interface PagedResult<T> {
    items: T[]
    page: number
    pageSize: number
    totalPages: number
    totalCount: number
}
