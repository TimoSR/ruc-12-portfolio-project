export type BookmarkTargetType = 'title' | 'person'

export interface Bookmark {
    id: string                      // UUID
    accountId: string               // User ID
    targetId: string                // UUID of movie/actor
    targetType: BookmarkTargetType
    note?: string                   // Simple string note
    title?: string                  // Movie/Actor name
    posterUrl?: string              // URL to image
    addedAt: string                 // ISO timestamp
}

export interface BookmarkWithDetails extends Bookmark {
    title?: string                  // Movie/Actor name
    imageUrl?: string
}
