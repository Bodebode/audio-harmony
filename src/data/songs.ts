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
    title: "Alkebulan",
    artist: "Bode Nathaniel",
    artwork: "/lovable-uploads/alkebulan-artwork-new.jpeg",
    audioUrl: "/songs/Alkebulan.mp3",
    duration: "0:00" // Will be updated by audio element
  },
  {
    id: 2,
    title: "Oyoyo",
    artist: "Bode Nathaniel",
    artwork: "/lovable-uploads/oyoyo-artwork-new.png",
    audioUrl: "/songs/Oyoyo.mp3",
    duration: "0:00" // Will be updated by audio element
  },
  {
    id: 3,
    title: "Love",
    artist: "Bode Nathaniel",
    artwork: "/lovable-uploads/74cb0a2d-58c7-4be3-a188-27a043b76a3d.png",
    audioUrl: "/songs/Love-2.mp3",
    duration: "0:00", // Will be updated by audio element
    isPremium: true
  },
  {
    id: 4,
    title: "Fire",
    artist: "Bode Nathaniel",
    artwork: "/lovable-uploads/fire-artwork-new.png",
    audioUrl: "/songs/Fire.mp3",
    duration: "0:00" // Will be updated by audio element
  },
  {
    id: 5,
    title: "Give Thanks",
    artist: "Bode Nathaniel",
    artwork: "/lovable-uploads/give-thanks-artwork.png",
    audioUrl: "/songs/Give-Thanks.mp3",
    duration: "0:00" // Will be updated by audio element
  },
];