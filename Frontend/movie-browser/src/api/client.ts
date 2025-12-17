// 1. Access the variable
const baseUrl = import.meta.env.VITE_MOVIE_BROWSER_API_URL;

// 2. Fallback (Good practice)
const BASE_URL = baseUrl || 'http://localhost:5175/api/v1';

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  // Handle empty responses (like 204 No Content) gracefully
  if (response.status === 204) {
    return null;
  }

  return response.json();
};