import { useEffect, useSyncExternalStore } from "react";
import { useToast } from "@/hooks/use-toast";

// Simple external store to keep liked songs in sync across components
let likedSongsStore: string[] = [];

try {
  const saved = localStorage.getItem('likedSongs');
  likedSongsStore = saved ? JSON.parse(saved) : [];
} catch {
  likedSongsStore = [];
}

const listeners = new Set<() => void>();

const emitChange = () => {
  listeners.forEach((l) => l());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => likedSongsStore;

export const useLikedSongs = () => {
  const { toast } = useToast();
  const likedSongs = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  // Persist whenever store changes
  useEffect(() => {
    try {
      localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
    } catch {}
  }, [likedSongs]);

  const toggleLikeSong = (songId: string) => {
    const isLiked = likedSongs.includes(songId);
    likedSongsStore = isLiked
      ? likedSongsStore.filter((id) => id !== songId)
      : [...likedSongsStore, songId];

    try {
      localStorage.setItem('likedSongs', JSON.stringify(likedSongsStore));
    } catch {}

    emitChange();

    toast({
      title: isLiked ? "Removed from liked songs" : "Added to liked songs",
      duration: 2000,
    });
  };

  const isLiked = (songId: string) => likedSongs.includes(songId);

  return { likedSongs, toggleLikeSong, isLiked };
};