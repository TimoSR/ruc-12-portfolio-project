

import { api } from './client';
import type { PersonDto, TitleDto, PagedResult } from '../types/api';

export interface SearchPersonsParams {
  query: string;
  page?: number;
  pageSize?: number;
}

export async function searchPersons(
  params: SearchPersonsParams
): Promise<PagedResult<PersonDto>> {
  const { query, page = 1, pageSize = 20 } = params;

  const searchParams = new URLSearchParams();
  searchParams.append('query', query);
  searchParams.append('page', page.toString());
  searchParams.append('pageSize', pageSize.toString());

  const endpoint = `/persons?${searchParams.toString()}`;
  return api.get<PagedResult<PersonDto>>(endpoint);
}

export async function getPersonById(id: string): Promise<PersonDto> {
  return api.get<PersonDto>(`/persons/${id}`);
}

export async function getPersonKnownFor(id: string): Promise<TitleDto[]> {
  return api.get<TitleDto[]>(`/persons/${id}/known-for`);
}

export async function getPersonCoActors(name: string): Promise<PersonDto[]> {
  return api.get<PersonDto[]>(`/persons/${name}/co-actors`);
}

export async function getPersonPopularCoActors(name: string): Promise<PersonDto[]> {
  return api.get<PersonDto[]>(`/persons/${name}/popular-co-actors`);
}

export async function getPersonWords(name: string, limit: number = 10): Promise<Array<{ word: string; count: number }>> {
  const searchParams = new URLSearchParams();
  searchParams.append('limit', limit.toString());
  return api.get<Array<{ word: string; count: number }>>(`/persons/${name}/words?${searchParams.toString()}`);
}

export async function getPersonProfessions(id: string): Promise<string[]> {
  return api.get<string[]>(`/persons/${id}/professions`);
}

