import React from "react";
import styled from "styled-components";

export interface UpNextItem {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
}

interface UpNextModuleProps {
  items: UpNextItem[];
}

/**
 * Outer box – this is the "wrapped box around it"
 */
const UpNextSection = styled.section`
  width: 100%;
  height: 100%;


  padding: 1.25rem 1.25rem;
  border-radius: 16px;

  border: 1px solid rgba(148, 163, 184, 0.6);
  background: rgba(15, 23, 42, 0.96);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.8);

  display: flex;
  flex-direction: column;
  gap: 0.9rem;
`;

const UpNextHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const UpNextTitle = styled.h2`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #e5e7eb;
`;

/**
 * Vertical stack of cards
 */
const UpNextList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

/**
 * Clickable row card
 */
const UpNextCard = styled.a`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 0.75rem;

  padding: 2rem;
  border-radius: 12px;

  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(55, 65, 81, 0.9);

  text-decoration: none;
  color: inherit;
  cursor: pointer;

  transition:
    transform 120ms ease-out,
    box-shadow 120ms ease-out,
    border-color 120ms ease-out,
    background 120ms ease-out;

  &:hover {
    transform: translateY(-1px);
    background: rgba(30, 64, 175, 0.7);
    border-color: rgba(191, 219, 254, 0.9);
    box-shadow: 0 14px 26px rgba(15, 23, 42, 0.85);
  }

  &:focus-visible {
    outline: 2px solid #fbbf24;
    outline-offset: 3px;
  }
`;

const UpNextImage = styled.img`
  flex-shrink: 0;
  width: 72px;
  height: 72px;
  border-radius: 10px;
  object-fit: cover;
  background-color: #020617;
`;

const UpNextContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
`;

const UpNextMovieTitle = styled.h3`
  margin: 0 0 0.2rem 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #f9fafb;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UpNextMovieDescription = styled.p`
  margin: 0;
  font-size: 0.78rem;
  line-height: 1.35;
  color: #9ca3af;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const UpNextMeta = styled.div`
  margin-top: 0.3rem;
  font-size: 0.75rem;
  color: #c4b5fd;
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

const Dot = styled.span`
  display: inline-block;
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background-color: #22c55e;
`;

/**
 * Public component
 */
export const UpNextModule: React.FC<UpNextModuleProps> = ({ items }) => {
  const visibleItems = items.slice(0, 3);

  return (
    <>
      <UpNextSection aria-label="Up next">
        <UpNextHeader>
          <UpNextTitle>Up Next</UpNextTitle>
        </UpNextHeader>

        <UpNextList>
          {visibleItems.map((item) => (
            <UpNextCard key={item.id} href={item.href}>
              <UpNextImage
                src={item.imageSrc}
                alt={item.imageAlt}
                loading="lazy"
              />
              <UpNextContent>
                <div>
                  <UpNextMovieTitle>{item.title}</UpNextMovieTitle>
                  <UpNextMovieDescription>
                    {item.description}
                  </UpNextMovieDescription>
                </div>
                <UpNextMeta>
                  <Dot />
                  <span>Play now</span>
                </UpNextMeta>
              </UpNextContent>
            </UpNextCard>
          ))}
        </UpNextList>
      </UpNextSection>
    </>
  );
};
