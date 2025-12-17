import { observer, useLocalObservable } from 'mobx-react-lite'
import { AuthStore } from '../../auth/store/AuthStore'
import type { IAuthStore } from '../../auth/store/AuthStore'
import { useState, useEffect } from 'react'

interface RatingComponentProps {
    titleId: string
}

export const RatingComponent = observer(({ titleId }: RatingComponentProps) => {
    const authStore = useLocalObservable<IAuthStore>(() => new AuthStore())
    const [hoverRating, setHoverRating] = useState(0)
    const [selectedRating, setSelectedRating] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        const fetchRating = async () => {
            if (!authStore.token || !authStore.accountId) return

            try {
                const res = await fetch(`/api/v1/accounts/${authStore.accountId}/ratings?titleId=${titleId}`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })

                if (res.ok) {
                    const data = await res.json()
                    setSelectedRating(data.score)
                }
            } catch (e) {
                // Ignore errors (e.g. 404 if not rated)
            }
        }

        fetchRating()
    }, [titleId, authStore.token, authStore.accountId])

    const handleRate = async (rating: number) => {
        if (!authStore.token || !authStore.accountId) return

        setIsSubmitting(true)
        setSelectedRating(rating)

        try {
            const res = await fetch(`/api/v1/accounts/${authStore.accountId}/ratings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authStore.token}`
                },
                body: JSON.stringify({
                    titleId: titleId,
                    score: rating,
                    comment: ''
                })
            })

            if (!res.ok) {
                console.error('Failed to rate')
                // Handle error
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!authStore.token) {
        return <div className="text-gray-400 text-sm">Log in to rate</div>
    }

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                <button
                    key={star}
                    className={`text-xl transition-colors ${star <= (hoverRating || selectedRating)
                        ? 'text-yellow-400'
                        : 'text-gray-600'
                        }`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleRate(star)}
                    disabled={isSubmitting}
                    title={`Rate ${star}/10`}
                >
                    ★
                </button>
            ))}
            <span className="ml-2 text-sm text-gray-400">
                {hoverRating > 0 ? hoverRating : selectedRating > 0 ? selectedRating : ''}
            </span>
        </div>
    )
})
