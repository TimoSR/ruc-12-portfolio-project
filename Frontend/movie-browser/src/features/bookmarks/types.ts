export type BookmarkTargetType = 'title' | 'person'

export interface Bookmark {
    id: string                      // UUID
    targetId: string                // UUID of movie/actor
    targetType: BookmarkTargetType
    note?: Record<string, unknown>  // JSONB from DB
    addedAt: string                 // ISO timestamp
}

export interface BookmarkWithDetails extends Bookmark {
    title?: string                  // Movie/Actor name
    imageUrl?: string
}
