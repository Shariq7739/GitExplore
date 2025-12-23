export interface Owner {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
}

export interface License {
  key: string;
  name: string;
  spdx_id: string;
  url: string;
  node_id: string;
}

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: Owner;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  license: License | null;
  size: number;
  topics: string[];
}

export interface SearchResult {
  total_count: number;
  incomplete_results: boolean;
  items: Repository[];
}

export interface Contributor {
  login: string;
  id: number;
  avatar_url: string;
  contributions: number;
}
