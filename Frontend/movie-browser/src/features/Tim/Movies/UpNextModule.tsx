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
const Section = styled.section`
  width: 100%;
  height: 100%;


  padding: 1.25rem 1.25rem;
  border-radius: 12px;

  border: 1px solid rgba(148, 163, 184, 0.6);
  background: rgba(15, 23, 42, 0.96);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.8);

  display: flex;
  flex-direction: column;
  gap: 0.9rem;
`;

const Header = styled.header`
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
const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

/**
 * Clickable row card
 */
const Card = styled.a`
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

const Image = styled.img`
  flex-shrink: 0;
  width: 80px;
  height: 120px;
  border-radius: 12px;
  object-fit: cover;
  background-color: #020617;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
`;

const Title = styled.h3`
  margin: 0 0 0.2rem 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #f9fafb;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Description = styled.p`
  margin: 0;
  font-size: 0.78rem;
  line-height: 1.35;
  color: #9ca3af;
  height: 5.3rem;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;



/**
 * Public component
 */
export const UpNextModule: React.FC<UpNextModuleProps> = ({ items }) => {
  const visibleItems = items.slice(0, 3);

  return (
    <>
      <Section aria-label="Up next">
        <Header>
          <UpNextTitle>Up Next</UpNextTitle>
        </Header>

        <List>
          {visibleItems.map((item) => (
            <Card key={item.id} href={item.href}>
              <Image
                src={item.imageSrc}
                alt={item.imageAlt}
                loading="lazy"
              />
              <Content>
                <div>
                  <Title>{item.title}</Title>
                  <Description>
                    {item.description}
                  </Description>
                </div>
              </Content>
            </Card>
          ))}
        </List>
      </Section>
    </>
  );
};
