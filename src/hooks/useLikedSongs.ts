import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const useLikedSongs = () => {
  const [likedSongs, setLikedSongs] = useState<number[]>([]);
  const { toast } = useToast();

  // Load liked songs from localStorage on mount
  useEffect(() => {
    const savedLikedSongs = localStorage.getItem('likedSongs');
    if (savedLikedSongs) {
      setLikedSongs(JSON.parse(savedLikedSongs));
    }
  }, []);

  // Save liked songs to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
  }, [likedSongs]);

  const toggleLikeSong = (songId: number) => {
    setLikedSongs(prev => {
      const isLiked = prev.includes(songId);
      const newLikedSongs = isLiked 
        ? prev.filter(id => id !== songId)
        : [...prev, songId];
      
      toast({
        title: isLiked ? "Removed from liked songs" : "Added to liked songs",
        duration: 2000,
      });
      
      return newLikedSongs;
    });
  };

  const isLiked = (songId: number) => likedSongs.includes(songId);

  return {
    likedSongs,
    toggleLikeSong,
    isLiked
  };
};