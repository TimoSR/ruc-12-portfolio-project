import React from "react";
import styled from "styled-components";

export const LargeImage: React.FC<LargeImageComponentProps> = ({
  rounded,
  cover,
  maxWidth,
  aspectRatio,
  ...imgProps
}) => {
  return (
    <LargeImageModule
      {...imgProps}
      $rounded={rounded}
      $cover={cover}
      $maxWidth={maxWidth}
      $aspectRatio={aspectRatio}
    />
  );
};

/**
 * Props that control visual variants of the image.
 * We prefix with $ so they don't end up as HTML attributes.
 */
interface LargeImageProps {
  /** Rounded corners? */
  $rounded?: boolean;
  /** Make image fill and crop instead of fitting */
  $cover?: boolean;
  /** Optional max width (e.g. "600px" or "100%") */
  $maxWidth?: string;
  /** Optional fixed aspect ratio; e.g. 16/9, 4/3, 1 */
  $aspectRatio?: number;
}

/**
 * Base styled <img> with variants driven by props.
 */
export const LargeImageModule = styled.img<LargeImageProps>`
  display: block;
  width: 100%;
  max-width: ${({ $maxWidth }) => $maxWidth ?? "960px"};
  height: 100%;

  /* When aspectRatio is used, we let the container handle height. */
  ${({ $aspectRatio }) =>
    $aspectRatio &&
    `
      height: auto;
      aspect-ratio: ${$aspectRatio};
    `}

  object-fit: ${({ $cover }) => ($cover ? "cover" : "contain")};

  border-radius: ${({ $rounded }) => ($rounded ? "16px" : "0px")};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);

  /* Optional: prevent image selection and drag-ghosts in UI-heavy apps */
  user-select: none;
  -webkit-user-drag: none;

  /* Responsive tweak example */
  @media (max-width: 3000px) {
    max-width: 100%;
    border-radius: ${({ $rounded }) => ($rounded ? "12px" : "0px")};
  }
`;

/**
 * Optional wrapper component if you want stricter typing
 * for `src` / `alt` and to hide the $-props.
 */
type LargeImageComponentProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  rounded?: boolean;
  cover?: boolean;
  maxWidth?: string;
  aspectRatio?: number;
};


