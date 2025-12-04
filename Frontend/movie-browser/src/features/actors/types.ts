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
