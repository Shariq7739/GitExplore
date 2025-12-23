
"use client";

import { formatDistanceToNow } from 'date-fns';
import { Star, GitFork, ExternalLink, Bookmark, StickyNote, Code } from 'lucide-react';
import type { Repository } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface RepositoryCardProps {
  repo: Repository;
  isBookmarked: boolean;
  note?: string;
  onBookmarkToggle: () => void;
  onOpenNote: () => void;
}

const languageColorMapping: { [key: string]: string } = {
  JavaScript: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30',
  TypeScript: 'bg-blue-400/20 text-blue-300 border-blue-400/30',
  Python: 'bg-green-400/20 text-green-300 border-green-400/30',
  Java: 'bg-red-400/20 text-red-300 border-red-400/30',
  Go: 'bg-sky-400/20 text-sky-300 border-sky-400/30',
  Rust: 'bg-orange-400/20 text-orange-300 border-orange-400/30',
  'C++': 'bg-pink-400/20 text-pink-300 border-pink-400/30',
};
const defaultColor = 'bg-gray-400/20 text-gray-300 border-gray-400/30';

const NotePreview = ({ content, onOpenNote }: { content: string, onOpenNote: () => void }) => {
    // A simple regex to strip HTML tags for a plain text preview
    const plainText = content.replace(/<[^>]*>?/gm, ' ');
    const isLong = plainText.length > 100;
    const previewText = isLong ? `${plainText.substring(0, 100)}...` : plainText;

    return (
        <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2 mb-2">
                <StickyNote className="w-4 h-4 text-accent" />
                <h4 className="text-sm font-semibold text-foreground">My Note</h4>
            </div>
            <div className="text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
                <p className="line-clamp-3">{previewText}</p>
            </div>
            {isLong && (
                 <Button variant="link" size="sm" className="px-0 h-auto" onClick={onOpenNote}>
                    Read more
                </Button>
            )}
        </div>
    );
};


export const RepositoryCard = ({ repo, isBookmarked, note, onBookmarkToggle, onOpenNote }: RepositoryCardProps) => {
  const timeAgo = formatDistanceToNow(new Date(repo.updated_at), { addSuffix: true });
  const langColor = repo.language ? languageColorMapping[repo.language] || defaultColor : defaultColor;
  
  return (
    <Card className="flex flex-col bg-card/60 backdrop-blur-xl border-border/30 shadow-lg hover:shadow-primary/20 hover:border-primary/50 transition-all duration-300 h-full">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={repo.owner.avatar_url} alt={`${repo.owner.login}'s avatar`} />
            <AvatarFallback>{repo.owner.login.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg leading-tight">{repo.name}</CardTitle>
            <CardDescription className="text-sm">{repo.owner.login}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm min-h-[40px] line-clamp-2">
          {repo.description}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Star className="w-4 h-4 text-yellow-400" />
            <span>{repo.stargazers_count.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <GitFork className="w-4 h-4 text-green-400" />
            <span>{repo.forks_count.toLocaleString()}</span>
          </div>
          {repo.language && (
            <Badge variant="outline" className={`font-mono ${langColor}`}>
              <Code className="w-3 h-3 mr-1.5" />
              {repo.language}
            </Badge>
          )}
        </div>
        {note && <NotePreview content={note} onOpenNote={onOpenNote} />}
      </CardContent>
      <CardFooter className="flex justify-between items-center text-xs text-muted-foreground">
        <span>Updated {timeAgo}</span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onOpenNote}>
            <StickyNote className={`h-4 w-4 ${note ? 'text-accent' : ''}`} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBookmarkToggle}>
            <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-primary text-primary' : ''}`} />
          </Button>
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </CardFooter>
    </Card>
  );
};
