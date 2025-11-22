

export interface LinkDto {
  href: string;
  rel: string;
  method?: string;
}

export interface TitleDto {
  id: string;
  titleType: string;
  primaryTitle: string;
  originalTitle?: string | null;
  isAdult: boolean;
  startYear?: number | null;
  endYear?: number | null;
  runtimeMinutes?: number | null;
  posterUrl?: string | null;
  plot?: string | null;
  url?: string | null;
}

export interface TitleLegacyDto {
  id: string;
  legacyId: string;
  titleType: string;
  primaryTitle: string;
  originalTitle?: string | null;
  isAdult: boolean;
  startYear?: number | null;
  endYear?: number | null;
  runtimeMinutes?: number | null;
  posterUrl?: string | null;
  plot?: string | null;
  url?: string | null;
}

export interface PersonDto {
  id: string;
  legacyId: string;
  primaryName: string;
  birthYear?: number | null;
  deathYear?: number | null;
  url?: string | null;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  links: Record<string, LinkDto>;
}

