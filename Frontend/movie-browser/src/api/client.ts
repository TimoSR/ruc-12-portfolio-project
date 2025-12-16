// 1. Access the variable
const baseUrl = import.meta.env.VITE_MOVIE_BROWSER_API_URL;

// 2. Fallback (Good practice)
const BASE_URL = baseUrl || 'http://localhost:5175/api/v1';

export const apiClient = async (endpoint: string) => {
  const response = await fetch(`${BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
};