
import type { Repository, SearchResult } from '@/lib/types';
import { mockRepositories } from '@/lib/mock-data';

// This function now fetches from the internal API route
export const fetchTrendingRepositories = async (page = 1, perPage = 9): Promise<Repository[]> => {
  try {
    const response = await fetch(`/api/github/trending?page=${page}&per_page=${perPage}`);
    if (!response.ok) {
        throw new Error('Failed to fetch trending repositories');
    }
    const data = await response.json();
    return data.items;
  } catch (error) {
      console.warn("API fetch failed. Falling back to mock data.", error);
      const start = (page - 1) * perPage;
      const end = start + perPage;
      return mockRepositories.slice(start, end);
  }
};

// This function now fetches from the internal API route
export const searchRepositories = async (query: string, page = 1, perPage = 9): Promise<SearchResult> => {
   if (!query) {
    return { total_count: 0, incomplete_results: false, items: [] };
  }
  try {
    const response = await fetch(`/api/github/search?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`);
    if (!response.ok) {
        throw new Error('Failed to search repositories');
    }
    return await response.json();
  } catch(error) {
    console.warn("API search failed. Falling back to mock data.", error);
    const lowercasedQuery = query.toLowerCase();
    const results = mockRepositories.filter(repo => 
      repo.name.toLowerCase().includes(lowercasedQuery) || 
      (repo.description && repo.description.toLowerCase().includes(lowercasedQuery))
    );
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return {
      total_count: results.length,
      incomplete_results: false,
      items: results.slice(start, end),
    };
  }
};

// This function now fetches from the internal API route
export const getRepositoryDetails = async (owner: string, repo: string): Promise<Repository | null> => {
  try {
    const response = await fetch(`/api/github/repo?owner=${owner}&repo=${repo}`);
    if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Failed to fetch repository details for ${owner}/${repo}`);
    }
    return await response.json();
  } catch (error) {
      console.warn("API repo details failed. Falling back to mock data.", error);
      const foundRepo = mockRepositories.find(r => r.full_name === `${owner}/${repo}`);
      return foundRepo || null;
  }
}

export const languages = ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust', 'C++', 'C#', 'PHP', 'HTML', 'CSS', 'Shell', 'C', 'Ruby', 'Scala', 'Kotlin', 'Swift'];
export const licenses = ['mit', 'apache-2.0', 'gpl-3.0', 'bsd-3-clause', 'unlicense', 'lgpl-3.0', 'agpl-3.0', 'mpl-2.0'];
