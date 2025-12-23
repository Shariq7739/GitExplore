
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

const NOTES_KEY = 'gitexplore-notes';

type Notes = {
  [repoId: number]: string;
};

export const useNotes = () => {
  const [notes, setNotes] = useState<Notes>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(NOTES_KEY);
      if (item) {
        setNotes(JSON.parse(item));
      }
    } catch (error) {
      console.error('Failed to load notes from localStorage', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const updateLocalStorage = (newNotes: Notes) => {
    try {
      window.localStorage.setItem(NOTES_KEY, JSON.stringify(newNotes));
    } catch (error) {
      console.error('Failed to save notes to localStorage', error);
      toast({
        title: "Error",
        description: "Could not save notes. Your browser storage might be full.",
        variant: "destructive",
      });
    }
  };

  const saveNote = useCallback((repoId: number, content: string) => {
    const newNotes = { ...notes, [repoId]: content };
    setNotes(newNotes);
    updateLocalStorage(newNotes);
    toast({ title: "Note Saved", description: `Your note for the repository has been saved.` });
  }, [notes, toast]);

  const getNote = useCallback((repoId: number): string | undefined => {
    return notes[repoId];
  }, [notes]);
  
  const deleteNote = useCallback((repoId: number) => {
    const newNotes = { ...notes };
    delete newNotes[repoId];
    setNotes(newNotes);
    updateLocalStorage(newNotes);
    toast({ title: "Note Deleted", description: `Your note for the repository has been deleted.` });
  }, [notes, toast]);

  const hasNote = useCallback((repoId: number) => {
    return !!notes[repoId];
  }, [notes]);

  return { notes, saveNote, getNote, deleteNote, hasNote, isLoaded };
};
