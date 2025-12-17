import { useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useAuthStore } from '../../../auth/store/AuthStore'

interface BookmarkButtonProps {
    titleId?: string
    personId?: string
    className?: string
}

export const BookmarkButton = observer(({ titleId, personId, className = '' }: BookmarkButtonProps) => {
    const authStore = useAuthStore()
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const checkBookmark = async () => {
            if (!authStore.token || !authStore.accountId) return

            try {
                const queryParams = new URLSearchParams()
                if (titleId) queryParams.append('titleId', titleId)
                if (personId) queryParams.append('personId', personId)

                const res = await fetch(`/api/v1/accounts/${authStore.accountId}/bookmarks/check?${queryParams.toString()}`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })

                if (res.ok) {
                    const data = await res.json()
                    setIsBookmarked(data)
                }
            } catch (e) {
                console.error("Failed to check bookmark status", e)
            }
        }

        checkBookmark()
    }, [titleId, personId, authStore.token, authStore.accountId])

    const handleToggle = async () => {
        if (!authStore.token || !authStore.accountId) return
        setIsLoading(true)

        try {
            const res = await fetch(`/api/v1/accounts/${authStore.accountId}/bookmarks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authStore.token}`
                },
                body: JSON.stringify({
                    titleId: titleId || null,
                    personId: personId || null,
                    notes: null
                })
            })

            if (res.ok) {
                // If 204 No Content, it was removed. If 200 OK, it was created.
                // But our controller returns 204 for remove, 200 for create.
                // Actually, let's check the status code.
                if (res.status === 204) {
                    setIsBookmarked(false)
                } else {
                    setIsBookmarked(true)
                }
            }
        } catch (e) {
            console.error("Failed to toggle bookmark", e)
        } finally {
            setIsLoading(false)
        }
    }

    if (!authStore.isAuthenticated) return null

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isBookmarked
                    ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                } ${className}`}
        >
            <span className="text-xl">{isBookmarked ? '★' : '☆'}</span>
            <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
        </button>
    )
})
