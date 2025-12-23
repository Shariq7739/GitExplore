
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Repository } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

const BOOKMARKS_KEY = 'gitexplore-bookmarks';

export const useBookmarks = () => {
  const [bookmarkedRepos, setBookmarkedRepos] = useState<Repository[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(BOOKMARKS_KEY);
      if (item) {
        setBookmarkedRepos(JSON.parse(item));
      }
    } catch (error) {
      console.error('Failed to load bookmarks from localStorage', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const updateLocalStorage = (repos: Repository[]) => {
    try {
      window.localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(repos));
    } catch (error) {
      console.error('Failed to save bookmarks to localStorage', error);
      toast({
        title: "Error",
        description: "Could not save bookmarks. Your browser storage might be full.",
        variant: "destructive",
      });
    }
  };

  const addBookmark = useCallback((repo: Repository) => {
    const newRepos = [...bookmarkedRepos, repo];
    setBookmarkedRepos(newRepos);
    updateLocalStorage(newRepos);
    toast({ title: "Bookmarked!", description: `Saved "${repo.name}" to your bookmarks.` });
  }, [bookmarkedRepos, toast]);

  const removeBookmark = useCallback((repoId: number) => {
    const repo = bookmarkedRepos.find(r => r.id === repoId);
    const newRepos = bookmarkedRepos.filter(r => r.id !== repoId);
    setBookmarkedRepos(newRepos);
    updateLocalStorage(newRepos);
    if (repo) {
        toast({ title: "Bookmark removed", description: `Removed "${repo.name}" from your bookmarks.` });
    }
  }, [bookmarkedRepos, toast]);

  const isBookmarked = useCallback((repoId: number) => {
    return bookmarkedRepos.some(repo => repo.id === repoId);
  }, [bookmarkedRepos]);

  return { bookmarkedRepos, addBookmark, removeBookmark, isBookmarked, isLoaded };
};
