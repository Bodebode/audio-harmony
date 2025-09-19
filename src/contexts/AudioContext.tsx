import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import { songs, Song } from "@/data/songs";
import { usePremium } from "@/hooks/usePremium";
import { useSongDurations } from "@/hooks/useSongDurations";
import { formatDuration } from "@/utils/formatDuration";

type RepeatMode = "none" | "all" | "one";

interface AudioContextType {
  // Playback state
  isPlaying: boolean;
  currentSongIndex: number;
  currentSong: Song;
  duration: number;
  songProgress: number;
  
  // Playlist state
  currentPlaylist: number[] | null;
  
  // Audio controls
  togglePlay: () => void;
  playPlaylist: (songIds: number[]) => void;
  playSong: (songId: number) => void;
  nextSong: () => void;
  previousSong: () => void;
  
  // Volume and progress
  volume: number[];
  setVolume: (volume: number[]) => void;
  handleProgressChange: (value: number[]) => void;
  
  // Repeat mode
  repeatMode: RepeatMode;
  setRepeatMode: (mode: RepeatMode) => void;
  
  // Audio element ref
  audioRef: React.RefObject<HTMLAudioElement>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [songProgress, setSongProgress] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentPlaylist, setCurrentPlaylist] = useState<number[] | null>(null);
  
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("none");
  const [duration, setDuration] = useState(0);
  const { checkFeatureAccess } = usePremium();
  const { preloadSongDurations } = useSongDurations();
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentSong = songs[currentSongIndex];

  // Initialize audio element events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const currentTime = audio.currentTime;
      const audioDuration = audio.duration;
      if (audioDuration > 0) {
        const progressPercent = (currentTime / audioDuration) * 100;
        setSongProgress(progressPercent);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      // Update the song duration in the songs array
      const songIndex = songs.findIndex(s => s.id === currentSong.id);
      if (songIndex !== -1) {
        songs[songIndex].duration = formatDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      if (repeatMode === "one") {
        audio.currentTime = 0;
        audio.play();
      } else {
        nextSong();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSongIndex, repeatMode]);

  // Reset audio to beginning when song changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = 0;
    setSongProgress(0);
  }, [currentSongIndex]);

  // Handle play/pause state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Handle volume changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume[0] / 100;
    }
  }, [volume]);


  const togglePlay = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const playPlaylist = useCallback((songIds: number[]) => {
    const firstSongIndex = songs.findIndex(song => song.id === songIds[0]);
    if (firstSongIndex !== -1) {
      setCurrentSongIndex(firstSongIndex);
      setCurrentPlaylist(songIds);
      setIsPlaying(true);
    }
  }, []);

  const playSong = useCallback((songId: number) => {
    const song = songs.find(s => s.id === songId);
    
    // Check if it's a premium song and user doesn't have access
    if (song?.isPremium && !checkFeatureAccess('premiumContent')) {
      const event = new CustomEvent('show-toast', {
        detail: { message: 'Premium users only', type: 'error' }
      });
      window.dispatchEvent(event);
      return;
    }
    
    const songIndex = songs.findIndex(s => s.id === songId);
    if (songIndex !== -1) {
      // Pause current audio first to prevent race conditions
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
      }
      setIsPlaying(false);
      
      setCurrentSongIndex(songIndex);
      setCurrentPlaylist(songs.map(s => s.id)); // Set album as current playlist
      
      // Wait for the next tick to ensure audio src has changed, then play
      setTimeout(() => {
        setIsPlaying(true);
      }, 50);
    }
  }, [checkFeatureAccess]);

  const getNextSongIndex = useCallback((): number => {
    if (!currentPlaylist) return currentSongIndex;
    
    const currentPlaylistIndex = currentPlaylist.findIndex(id => id === currentSong.id);
    const nextPlaylistIndex = (currentPlaylistIndex + 1) % currentPlaylist.length;
    return songs.findIndex(song => song.id === currentPlaylist[nextPlaylistIndex]);
  }, [currentPlaylist, currentSongIndex, currentSong]);

  const nextSong = useCallback(() => {
    const nextIndex = getNextSongIndex();
    if (nextIndex !== -1) {
      setCurrentSongIndex(nextIndex);
    }
  }, [getNextSongIndex]);

  const previousSong = useCallback(() => {
    if (!currentPlaylist) return;
    
    const currentPlaylistIndex = currentPlaylist.findIndex(id => id === currentSong.id);
    const prevPlaylistIndex = currentPlaylistIndex > 0 ? currentPlaylistIndex - 1 : currentPlaylist.length - 1;
    const prevIndex = songs.findIndex(song => song.id === currentPlaylist[prevPlaylistIndex]);
    
    if (prevIndex !== -1) {
      setCurrentSongIndex(prevIndex);
    }
  }, [currentPlaylist, currentSong]);

  const handleProgressChange = useCallback((value: number[]) => {
    const audio = audioRef.current;
    if (audio && duration > 0) {
      const newTime = (value[0] / 100) * duration;
      audio.currentTime = newTime;
      setSongProgress(value[0]);
    }
  }, [duration]);

  // Expose controls globally
  useEffect(() => {
    (window as any).musicPlayerControls = {
      playPlaylist,
      playSong,
      togglePlay,
      nextSong,
      previousSong
    };
  }, [playPlaylist, playSong, togglePlay, nextSong, previousSong]);

  const value: AudioContextType = {
    isPlaying,
    currentSongIndex,
    currentSong,
    duration,
    songProgress,
    currentPlaylist,
    togglePlay,
    playPlaylist,
    playSong,
    nextSong,
    previousSong,
    volume,
    setVolume,
    handleProgressChange,
    repeatMode,
    setRepeatMode,
    audioRef
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        src={currentSong?.audioUrl}
        preload="metadata"
      />
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};