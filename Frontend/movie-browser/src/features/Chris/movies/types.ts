export type MovieItem = {
    id: string
    titleType: string
    primaryTitle: string
    originalTitle: string | null
    isAdult: boolean
    startYear: number | null
    endYear: number | null
    runtimeMinutes: number | null
    posterUrl: string | null
    plot: string | null
    url: string | null
    legacyId: string | null
}

export type PagedResult<T> = {
    items: T[]
    totalCount: number
    page: number
    pageSize: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
}
