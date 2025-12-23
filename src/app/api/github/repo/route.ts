
import { NextResponse } from 'next/server';
import type { Repository } from '@/lib/types';

const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export async function GET(request: Request) {
  if (!GITHUB_TOKEN) {
    return NextResponse.json({ message: 'GitHub token not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const owner = searchParams.get('owner');
  const repo = searchParams.get('repo');

  if (!owner || !repo) {
    return NextResponse.json({ message: 'Owner and repo are required' }, { status: 400 });
  }

  const url = `${GITHUB_API_URL}/repos/${owner}/${repo}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ message: 'Repository not found' }, { status: 404 });
      }
      const errorData = await response.json();
      console.error('GitHub API Error:', errorData);
      return NextResponse.json({ message: 'Failed to fetch from GitHub API' }, { status: response.status });
    }

    const data: Repository = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Internal Server Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
