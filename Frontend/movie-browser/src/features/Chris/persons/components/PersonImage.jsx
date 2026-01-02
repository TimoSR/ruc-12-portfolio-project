// @ts-nocheck
import { useState, useEffect } from "react";
import { Image, Spinner } from "react-bootstrap";
// Correct import path: go up 4 levels to src/
import { fetchTmdbPersonImage } from "../../../../api/tmdbService";

/**
 * @fileoverview Displays a person's image from TMDB.
 * Implements requirement 3-D.2.
 * @param {object} props
 * @param {string} props.nconst - IMDB ID
 * @param {string} [props.alt] - Alt text
 * @param {string} [props.className] - CSS class
 */
export const PersonImage = ({ nconst, alt = "Person", className }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let mounted = true;

        const loadImage = async () => {
            if (!nconst) return;
            setLoading(true);
            try {
                const url = await fetchTmdbPersonImage(nconst);
                if (mounted && url) setImageUrl(url);
                else if (mounted) setError(true);
            } catch (err) {
                if (mounted) setError(true);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        loadImage();

        return () => { mounted = false; };
    }, [nconst]);

    if (loading) {
        return (
            <div className={`d-flex align-items-center justify-content-center bg-dark rounded ${className}`} style={{ minHeight: '100px', opacity: 0.5 }}>
                <Spinner animation="border" size="sm" variant="secondary" />
            </div>
        );
    }

    if (error || !imageUrl) {
        return (
            <div className={`d-flex align-items-center justify-content-center bg-secondary text-white rounded ${className}`} style={{ minHeight: '100px' }}>
                <span className="h1 m-0 opacity-50">👤</span>
            </div>
        );
    }

    return (
        <Image
            src={imageUrl}
            referrerPolicy="no-referrer"
            alt={alt}
            fluid
            className={`rounded shadow-sm ${className}`}
            onError={() => setError(true)}
        />
    );
};
