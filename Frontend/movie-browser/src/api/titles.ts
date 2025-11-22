

import { api } from './client';
import type { TitleDto, TitleLegacyDto, PagedResult } from '../types/api';

export interface SearchTitlesParams {
  query?: string;
  page?: number;
  pageSize?: number;
}

export async function searchTitles(
  params: SearchTitlesParams = {}
): Promise<PagedResult<TitleDto>> {
  const { query, page = 1, pageSize = 20 } = params;

  const searchParams = new URLSearchParams();
  if (query) {
    searchParams.append('query', query);
  }
  searchParams.append('page', page.toString());
  searchParams.append('pageSize', pageSize.toString());

  const endpoint = `/titles?${searchParams.toString()}`;
  return api.get<PagedResult<TitleDto>>(endpoint);
}

export async function getTitleById(id: string): Promise<TitleDto> {
  return api.get<TitleDto>(`/titles/${id}`);
}

export async function getTitleByLegacyId(legacyId: string): Promise<TitleLegacyDto> {
  return api.get<TitleLegacyDto>(`/titles/${legacyId}`);
}

