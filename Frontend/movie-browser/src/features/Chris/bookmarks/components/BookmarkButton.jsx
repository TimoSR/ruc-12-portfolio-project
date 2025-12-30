// @ts-nocheck
import { observer } from "mobx-react"; // Import simply from mobx-react
import { Button } from "react-bootstrap";
import { bookmarksStore } from "../store/BookmarksStore";
import { useEffect, useState } from "react";

/**
 * @fileoverview Reusable Bookmark Button component.
 * @component
 * @param {object} props
 * @param {string} props.targetId - ID of the movie or person
 * @param {'movie'|'person'} props.targetType - Type of item
 * @param {string} [props.displayName] - Name to save in history/list
 */
const BookmarkButtonBase = ({ targetId, targetType, displayName }) => {
    // We need userId from somewhere. For now, let's grab from localStorage safely
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                setUserId(parsed.id || parsed.userId);
            } catch (e) {
                console.error("Failed to parse user from localstorage");
            }
        }
    }, []);

    if (!userId) return null; // Don't show if not logged in

    const isBookmarked = bookmarksStore.isBookmarked(targetId, targetType);

    const handleClick = (e) => {
        e.preventDefault(); // Prevent bubbling if in a card
        e.stopPropagation();
        bookmarksStore.toggleBookmark(userId, targetId, targetType, displayName);
    };

    return (
        <Button
            variant={isBookmarked ? "warning" : "outline-secondary"}
            size="sm"
            onClick={handleClick}
            title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
        >
            {isBookmarked ? "★" : "☆"}
        </Button>
    );
};

export const BookmarkButton = observer(BookmarkButtonBase);
