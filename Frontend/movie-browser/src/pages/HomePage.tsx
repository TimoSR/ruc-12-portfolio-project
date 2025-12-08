// src/pages/HomePage.tsx
import styled from "styled-components";
import { LargeImage } from "../features/Tim/Images/LargeImageModules";
import { UpNextModule, type UpNextItem } from "../features/Tim/Movies/UpNextModule";
import { SearchSection } from "../features/Tim/search";

export const HomePage = () => {
  return (
    <Page>
      <MainModule>
        <MainImageWrapper>
          <LargeImage
            src="/images/demo-light.png"
            alt="Space mining ship"
            rounded
            cover
            maxWidth="100%"
          />
        </MainImageWrapper>

        <UpNextWrapper>
          <UpNextModule items={upNextItems} />
        </UpNextWrapper>
      </MainModule>
    </Page>
  );
};

const upNextItems: UpNextItem[] = [
  {
    id: "1",
    title: "The Expanse: New Horizons",
    description:
      "A rogue mining crew uncovers an ancient signal that threatens to destabilize the entire solar system.",
    imageSrc: "/images/demo-light.png",
    imageAlt: "Spaceship flying near a blue nebula",
    href: "/movies/the-expanse-new-horizons",
  },
  {
    id: "2",
    title: "Signal in the Void",
    description:
      "A lone operator on a deep space relay station starts receiving messages from a future that shouldn't exist.",
    imageSrc: "/images/demo-light.png",
    imageAlt: "A relay station above a planet with a glowing signal",
    href: "/movies/signal-in-the-void",
  },
  {
    id: "3",
    title: "Orbital Factor",
    description:
      "Engineers on a failing ringworld race to patch its crumbling infrastructure before gravity fails.",
    imageSrc: "/images/demo-light.png",
    imageAlt: "A massive ringworld structure lit by a distant star",
    href: "/movies/orbital-factor",
  },
];

const Page = styled.main`
  max-width: 55%;
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
