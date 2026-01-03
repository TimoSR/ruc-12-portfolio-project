import { useState, useEffect } from "react";
import styled from "styled-components";
import { LargeImage } from "../features/Tim/Images/LargeImageModules";
import { UpNextModule, type UpNextItem } from "../features/Tim/Movies/UpNextModule";
import LegacyWidget from "../features/Tim/js-in-ts/LegacyWidget";
import { fetchTmdbMovieImage } from "../api/tmdbService";

// Hardcoded list of popular movies to feature on Home
// In a real app, this could come from a "Trending" endpoint
const FEATURED_MOVIES = [
  {
    id: "tt0816692", // Interstellar
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    href: "/movies/tt0816692"
  },
  {
    id: "tt0468569", // The Dark Knight
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    href: "/movies/tt0468569"
  },
  {
    id: "tt1375666", // Inception
    title: "Inception",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    href: "/movies/tt1375666"
  },
  {
    id: "tt1160419", // Dune (2021)
    title: "Dune",
    description: "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset while its heir becomes troubled by visions of a dark future.",
    href: "/movies/tt1160419"
  }
];

export const HomePage = () => {
  const [mainMovie, setMainMovie] = useState<any>(null);
  const [upNextItems, setUpNextItems] = useState<UpNextItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      setIsLoading(true);
      try {
        // Fetch images for all featured movies
        const moviesWithImages = await Promise.all(
          FEATURED_MOVIES.map(async (movie) => {
            const imageSrc = await fetchTmdbMovieImage(movie.id);
            return {
              ...movie,
              imageSrc: imageSrc || "/images/demo-light.png", // Fallback
              imageAlt: `Poster for ${movie.title}`
            };
          })
        );

        if (moviesWithImages.length > 0) {
          setMainMovie(moviesWithImages[0]);
          setUpNextItems(moviesWithImages.slice(1));
        }
      } catch (error) {
        console.error("Failed to load home page images", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, []);

  if (isLoading) {
    return (
      <Page>
        <div style={{ color: 'white', textAlign: 'center', marginTop: '4rem' }}>Loading...</div>
      </Page>
    )
  }

  return (
    <Page>
      <MainModule>
        <MainImageWrapper>
          {mainMovie && (
            <LargeImage
              src={mainMovie.imageSrc}
              alt={mainMovie.imageAlt}
              rounded
              cover
              maxWidth="100%"
            />
          )}
        </MainImageWrapper>

        <UpNextWrapper>
          <UpNextModule items={upNextItems} />
        </UpNextWrapper>
      </MainModule>
      <LegacyWidget title={"Hello from JS! Using JSDOC for type checking! Find me at the HomePage.tsx ;)"} />
    </Page>
  );
};

const Page = styled.main`
  max-width: 1300px;
  margin: 0 auto;
  padding: 1rem 1.5rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

/**
 * Main layout row: image (left) + sidebar (right) on desktop,
 * stacked with image on top on mobile.
 */
const MainModule = styled.section`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 2rem;
  width: 100%;

  @media (max-width: 900px) {
    flex-direction: column; /* image first, UpNext below */
  }
`;

/**
 * Image container – lets the image grow/shrink nicely.
 */
const MainImageWrapper = styled.div`
  flex: 2;
  min-width: 0;
  max-width: 66.6%;
  display: flex;
  align-items: stretch;
`;

/**
 * Sidebar container – no hard min-width on mobile,
 * constrained width only on larger screens.
 */
const UpNextWrapper = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: stretch;


`;
