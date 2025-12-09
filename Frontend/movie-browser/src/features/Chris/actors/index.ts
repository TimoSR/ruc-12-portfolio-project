// Stores
export { ActorStore, type IActorStore } from './store/ActorStore'
export { ActorDetailsStore, type IActorDetailsStore } from './store/ActorDetailsStore'

// Components
export { ActorCard } from './components/ActorCard'
export { Pagination } from './components/Pagination'

// Views
export { ActorDetailsView } from './views/ActorDetailsView'
export { ActorListView } from './views/ActorListView'

// Types
export interface ActorItem {
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
