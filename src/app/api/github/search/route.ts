
import { NextResponse } from 'next/server';
import type { SearchResult } from '@/lib/types';

const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export async function GET(request: Request) {
  if (!GITHUB_TOKEN) {
    return NextResponse.json({ message: 'GitHub token not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const page = searchParams.get('page') || '1';
  const perPage = searchParams.get('per_page') || '9';

  if (!query) {
    return NextResponse.json({ total_count: 0, incomplete_results: false, items: [] });
  }

  const url = `${GITHUB_API_URL}/search/repositories?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('GitHub API Error:', errorData);
        return NextResponse.json({ message: 'Failed to fetch from GitHub API' }, { status: response.status });
    }

    const data: SearchResult = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Internal Server Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
