// @ts-nocheck
/**
 * @fileoverview TMDB API service for fetching person images
 * Implements requirement 3-D.2
 */

// NOTE: Using import.meta.env for Vite environment variables
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

/**
 * Fetches a person's profile image from TMDB using their IMDB nconst.
 * 
 * Process (per requirement 3-D.2):
 * 1. Use nconst to find TMDB ID via /find endpoint
 * 2. Use TMDB ID to fetch profile images
 * 
 * @param {string} nconst - IMDB person ID (e.g., "nm0000229" for Spielberg)
 * @returns {Promise<string|null>} Full image URL or null if not found
 */
export async function fetchTmdbPersonImage(nconst) {
    // Check for missing or placeholder key
    if (!API_KEY || API_KEY.includes('your_api_key') || API_KEY === 'placeholder_api_key') {
        console.warn('TMDB API Key missing or placeholder. Returning placeholder image.');
        return 'https://placehold.co/400x600?text=No+TMDB+Key';
    }

    try {
        // Step 1: Convert IMDB nconst -> TMDB ID
        const findUrl = `${TMDB_BASE}/find/${nconst}?external_source=imdb_id&api_key=${API_KEY}`;
        const findRes = await fetch(findUrl);

        if (!findRes.ok) {
            console.warn(`TMDB Find Error: ${findRes.status}. Returning placeholder.`);
            return 'https://placehold.co/400x600?text=TMDB+Error';
        }

        const findData = await findRes.json();
        const tmdbId = findData.person_results?.[0]?.id;

        if (!tmdbId) {
            console.warn('Person not found in TMDB. Returning placeholder.');
            return 'https://placehold.co/400x600?text=Not+Found';
        }

        // Step 2: Fetch person images using TMDB ID
        const imgUrl = `${TMDB_BASE}/person/${tmdbId}/images?api_key=${API_KEY}`;
        const imgRes = await fetch(imgUrl);

        if (!imgRes.ok) {
            console.warn(`TMDB Image Error: ${imgRes.status}. Returning placeholder.`);
            return 'https://placehold.co/400x600?text=Image+Error';
        }

        const imgData = await imgRes.json();
        const filePath = imgData.profiles?.[0]?.file_path;

        return filePath ? `${IMAGE_BASE}${filePath}` : 'https://placehold.co/400x600?text=No+Image';
    } catch (error) {
        console.error('TMDB fetch error:', error);
        return 'https://placehold.co/400x600?text=Network+Error';
    }
}

/**
 * Fetches a movie's poster image from TMDB using its IMDB const (tt...).
 * @param {string} imdbId - IMDB movie ID (e.g., "tt0110912")
 * @returns {Promise<string|null>} Full image URL or placeholder
 */
export async function fetchTmdbMovieImage(imdbId) {
    if (!API_KEY || API_KEY.includes('your_api_key')) {
        return 'https://placehold.co/400x600?text=No+TMDB+Key';
    }

    try {
        // Step 1: Find movie by IMDB ID
        const findUrl = `${TMDB_BASE}/find/${imdbId}?external_source=imdb_id&api_key=${API_KEY}`;
        const findRes = await fetch(findUrl);

        if (!findRes.ok) return 'https://placehold.co/400x600?text=Error';

        const findData = await findRes.json();
        const posterPath = findData.movie_results?.[0]?.poster_path;

        return posterPath ? `${IMAGE_BASE}${posterPath}` : 'https://placehold.co/400x600?text=No+Image';
    } catch (error) {
        console.error('TMDB fetch error:', error);
        return 'https://placehold.co/400x600?text=Network+Error';
    }
}
