
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Github, Search, BarChart2, Bookmark, Loader2, AlertTriangle, Wind, TrendingUp } from 'lucide-react';
import Header from '@/components/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from '@/components/skeleton-card';
import { RepositoryCard } from '@/components/repository-card';
import { NoteEditorDialog } from '@/components/note-editor';
import { LanguagePieChart } from '@/components/analytics/language-pie-chart';
import { StarsBarChart } from '@/components/analytics/stars-bar-chart';
import { CreationsLineChart } from '@/components/analytics/creations-line-chart';
import { FilterPanel, type Filters } from '@/components/filter-panel';

import { useBookmarks } from '@/hooks/use-bookmarks';
import { useNotes } from '@/hooks/use-notes';
import { useDebounce } from '@/hooks/use-debounce';

import { fetchTrendingRepositories, searchRepositories } from '@/lib/github-api';
import type { Repository } from '@/lib/types';
import { Badge } from '@/components/ui/badge';


export default function GitExplorePage() {
  // State Management
  const [trendingRepos, setTrendingRepos] = useState<Repository[]>([]);
  const [searchedRepos, setSearchedRepos] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const [filters, setFilters] = useState<Filters>({
    sort: 'stars',
    sortOrder: 'desc',
    languages: [],
    license: '',
    sizeRange: [0, 1000000]
  });

  const [activeTab, setActiveTab] = useState("explore");

  // Hooks
  const { bookmarkedRepos, addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const { getNote, saveNote, deleteNote } = useNotes();
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Note dialog state
  const [noteRepo, setNoteRepo] = useState<Repository | null>(null);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);

  // Keyboard shortcut for search
   useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
        setActiveTab('search');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Data Fetching
  const loadTrendingRepos = useCallback(async (pageNum: number) => {
    if (pageNum === 1) setIsLoading(true);
    else setIsLoadingMore(true);
    setError(null);
    try {
      const newRepos = await fetchTrendingRepositories(pageNum, 9);
      if (newRepos.length === 0) {
        setHasMore(false);
      }
      setTrendingRepos(prev => pageNum === 1 ? newRepos : [...prev, ...newRepos]);
    } catch (err) {
      setError('Failed to fetch trending repositories.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadTrendingRepos(1);
  }, [loadTrendingRepos]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadTrendingRepos(nextPage);
  };

  // Search Logic
  useEffect(() => {
    if (debouncedSearchQuery) {
      setIsSearching(true);
      setError(null);
      searchRepositories(debouncedSearchQuery)
        .then(result => setSearchedRepos(result.items))
        .catch(() => setError('Failed to perform search.'))
        .finally(() => setIsSearching(false));
    } else {
      setSearchedRepos([]);
    }
  }, [debouncedSearchQuery]);

  // Filtering & Sorting Logic
  const filteredAndSortedRepos = useMemo(() => {
    let reposToFilter = activeTab === 'explore' ? trendingRepos : (activeTab === 'search' ? searchedRepos : bookmarkedRepos);
    
    // Apply filters
    reposToFilter = reposToFilter.filter(repo => {
      const langMatch = filters.languages.length === 0 || (repo.language && filters.languages.includes(repo.language));
      const licenseMatch = !filters.license || repo.license?.key === filters.license;
      const sizeMatch = repo.size >= filters.sizeRange[0] && repo.size <= filters.sizeRange[1];
      return langMatch && licenseMatch && sizeMatch;
    });

    // Apply sort
    const sortedRepos = [...reposToFilter].sort((a, b) => {
        let valA, valB;
        switch (filters.sort) {
            case 'forks':
                valA = a.forks_count; valB = b.forks_count; break;
            case 'updated':
                valA = new Date(a.updated_at).getTime(); valB = new Date(b.updated_at).getTime(); break;
            case 'created':
                valA = new Date(a.created_at).getTime(); valB = new Date(b.created_at).getTime(); break;
            case 'size':
                valA = a.size; valB = b.size; break;
            case 'issues':
                valA = a.open_issues_count; valB = b.open_issues_count; break;
            default: // stars
                valA = a.stargazers_count; valB = b.stargazers_count; break;
        }
        if (filters.sortOrder === 'asc') {
            return valA - valB;
        } else {
            return valB - valA;
        }
    });

    return sortedRepos;
  }, [trendingRepos, searchedRepos, bookmarkedRepos, filters, activeTab]);

  // Note Dialog Handlers
  const handleOpenNote = (repo: Repository) => {
    setNoteRepo(repo);
    setIsNoteDialogOpen(true);
  };

  const handleSaveNote = (content: string) => {
    if (noteRepo) {
      saveNote(noteRepo.id, content);
    }
  };
  
  const handleDeleteNote = () => {
    if (noteRepo) {
      deleteNote(noteRepo.id);
    }
  };
  
  const allReposForAnalytics = useMemo(() => [...trendingRepos, ...searchedRepos, ...bookmarkedRepos].filter(
    (repo, index, self) => index === self.findIndex((r) => r.id === repo.id)
  ), [trendingRepos, searchedRepos, bookmarkedRepos]);

  // Render Logic
  const renderRepoGrid = (repos: Repository[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {repos.map(repo => (
        <RepositoryCard
          key={repo.id}
          repo={repo}
          isBookmarked={isBookmarked(repo.id)}
          note={getNote(repo.id)}
          onBookmarkToggle={() => isBookmarked(repo.id) ? removeBookmark(repo.id) : addBookmark(repo)}
          onOpenNote={() => handleOpenNote(repo)}
        />
      ))}
    </div>
  );

  const renderLoading = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
  
  const renderEmptyState = (title: string, message: string) => (
    <div className="text-center py-16 bg-card/30 rounded-lg">
        <Wind className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
    </div>
  );

  const renderAnalyticsEmptyState = () => (
    <div className="text-center py-16 bg-card/30 rounded-lg">
      <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">Not Enough Data</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Explore, search, or bookmark some repositories to see analytics.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <Header />
      <main className="container mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 md:w-[480px] bg-card/60 backdrop-blur-xl border-border/30 mb-6">
            <TabsTrigger value="explore"><Github className="w-4 h-4 mr-2" />Explore</TabsTrigger>
            <TabsTrigger value="search"><Search className="w-4 h-4 mr-2" />Search</TabsTrigger>
            <TabsTrigger value="analytics"><BarChart2 className="w-4 h-4 mr-2" />Analytics</TabsTrigger>
            <TabsTrigger value="bookmarks" className="relative">
              <Bookmark className="w-4 h-4 mr-2" />
              Bookmarks
              {bookmarkedRepos.length > 0 && (
                <Badge variant="secondary" className="ml-2 rounded-full h-5 w-5 p-0 flex items-center justify-center">
                  {bookmarkedRepos.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          {activeTab !== 'analytics' && <FilterPanel filters={filters} onFilterChange={setFilters} />}

          {/* Explore Tab */}
          <TabsContent value="explore">
            {isLoading ? renderLoading() : (filteredAndSortedRepos.length > 0 ? renderRepoGrid(filteredAndSortedRepos) : renderEmptyState('No Repositories Found', 'Try adjusting your filters.'))}
            {hasMore && !isLoading && !isLoadingMore && (
              <div className="mt-8 text-center">
                <Button onClick={handleLoadMore}>Load More</Button>
              </div>
            )}
            {isLoadingMore && (
              <div className="mt-8 text-center">
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Search Tab */}
          <TabsContent value="search">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="search-input"
                type="text"
                placeholder="Search repositories by name or description... (Ctrl+K)"
                className="pl-10 h-12 text-lg bg-card/80 focus:shadow-lg focus:shadow-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {isSearching ? renderLoading() : 
              (filteredAndSortedRepos.length > 0 ? renderRepoGrid(filteredAndSortedRepos) :
              (debouncedSearchQuery ? renderEmptyState('No Results Found', 'Try a different search query.') : renderEmptyState('Search for GitHub Repositories', 'Find interesting projects by name, topic, or description.')))
            }
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            {allReposForAnalytics.length > 0 ? (
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                    <div className="lg:col-span-2">
                        <CreationsLineChart repos={allReposForAnalytics} />
                    </div>
                    <StarsBarChart repos={allReposForAnalytics} />
                    <LanguagePieChart repos={allReposForAnalytics} />
                </div>
            ) : renderAnalyticsEmptyState()}
          </TabsContent>

          {/* Bookmarks Tab */}
          <TabsContent value="bookmarks">
            {filteredAndSortedRepos.length > 0 ? 
              renderRepoGrid(filteredAndSortedRepos) :
              renderEmptyState('No Bookmarks Yet', 'Start bookmarking repositories to see them here.')
            }
          </TabsContent>

        </Tabs>
        
        {error && (
            <div className="fixed bottom-5 right-5 bg-destructive text-destructive-foreground p-4 rounded-lg shadow-lg flex items-center gap-3">
                <AlertTriangle />
                <span>{error}</span>
                <Button variant="ghost" size="sm" onClick={() => loadTrendingRepos(1)}>Retry</Button>
            </div>
        )}
      </main>
      
      <NoteEditorDialog
        isOpen={isNoteDialogOpen}
        onOpenChange={setIsNoteDialogOpen}
        repo={noteRepo}
        note={noteRepo ? getNote(noteRepo.id) || '' : ''}
        onSave={handleSaveNote}
        onDelete={handleDeleteNote}
      />
    </div>
  );
}
