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
    if (!API_KEY || API_KEY.includes('your_api_key')) {
        console.warn('TMDB API Key missing. Images will not load.');
        return null;
    }

    try {
        // Step 1: Convert IMDB nconst -> TMDB ID
        const findUrl = `${TMDB_BASE}/find/${nconst}?external_source=imdb_id&api_key=${API_KEY}`;
        const findRes = await fetch(findUrl);

        if (!findRes.ok) throw new Error(`TMDB Find Error: ${findRes.status}`);

        const findData = await findRes.json();
        const tmdbId = findData.person_results?.[0]?.id;

        if (!tmdbId) return null; // Person not in TMDB

        // Step 2: Fetch person images using TMDB ID
        const imgUrl = `${TMDB_BASE}/person/${tmdbId}/images?api_key=${API_KEY}`;
        const imgRes = await fetch(imgUrl);

        if (!imgRes.ok) throw new Error(`TMDB Image Error: ${imgRes.status}`);

        const imgData = await imgRes.json();
        const filePath = imgData.profiles?.[0]?.file_path;

        return filePath ? `${IMAGE_BASE}${filePath}` : null;
    } catch (error) {
        console.error('TMDB fetch error:', error);
        return null;
    }
}
