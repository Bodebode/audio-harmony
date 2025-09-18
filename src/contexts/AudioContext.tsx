import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import { songs, Song } from "@/data/songs";
import { usePremium } from "@/hooks/usePremium";

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
  
  // Shuffle and repeat
  isShuffleOn: boolean;
  setIsShuffleOn: (shuffle: boolean) => void;
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
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("none");
  const [duration, setDuration] = useState(0);
  const { checkFeatureAccess } = usePremium();
  
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

  const formatDuration = (seconds: number): string => {
    if (isNaN(seconds) || seconds === 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

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
      setCurrentSongIndex(songIndex);
      setIsPlaying(true);
    }
  }, [checkFeatureAccess]);

  const getNextSongIndex = useCallback((): number => {
    if (!currentPlaylist) return currentSongIndex;
    
    if (isShuffleOn) {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * currentPlaylist.length);
      } while (nextIndex === currentSongIndex && currentPlaylist.length > 1);
      return songs.findIndex(song => song.id === currentPlaylist[nextIndex]);
    }
    
    const currentPlaylistIndex = currentPlaylist.findIndex(id => id === currentSong.id);
    const nextPlaylistIndex = (currentPlaylistIndex + 1) % currentPlaylist.length;
    return songs.findIndex(song => song.id === currentPlaylist[nextPlaylistIndex]);
  }, [currentPlaylist, isShuffleOn, currentSongIndex, currentSong]);

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
    isShuffleOn,
    setIsShuffleOn,
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