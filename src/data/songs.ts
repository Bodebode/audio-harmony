export interface Song {
  id: number;
  title: string;
  artist: string;
  artwork: string;
  audioUrl: string;
  duration?: string;
  isPremium?: boolean;
}

export const songs: Song[] = [
  {
    id: 1,
    title: "Love",
    artist: "Bode Nathaniel",
    artwork: "/lovable-uploads/74cb0a2d-58c7-4be3-a188-27a043b76a3d.png",
    audioUrl: "/songs/Love-2.mp3",
    duration: "0:00" // Will be updated by audio element
  },
  {
    id: 2,
    title: "Fire",
    artist: "Bode Nathaniel",
    artwork: "/lovable-uploads/fire-artwork-new.png",
    audioUrl: "/songs/Fire.mp3",
    duration: "0:00" // Will be updated by audio element
  },
];