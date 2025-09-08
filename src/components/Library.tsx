import { PlayCircle, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const alkebulanSongs = [
  { id: 1, title: "Song 1", duration: "3:45" },
  { id: 2, title: "Song 2", duration: "4:20" },
  { id: 3, title: "Song 3", duration: "3:15" },
  { id: 4, title: "Song 4", duration: "3:50" },
  { id: 5, title: "Song 5", duration: "4:10" },
];

const upcomingProjectsSongs = [
  { id: 11, title: "Future Track 1", duration: "3:30" },
  { id: 12, title: "Future Track 2", duration: "4:05" },
  { id: 13, title: "Future Track 3", duration: "3:55" },
  { id: 14, title: "Future Track 4", duration: "4:15" },
  { id: 15, title: "Future Track 5", duration: "3:40" },
];

const allSongs = [...alkebulanSongs, ...upcomingProjectsSongs];

export const Library = () => {
  const { toast } = useToast();
  const [playlists, setPlaylists] = useState<{ id: number; name: string; songs: number[]; }[]>([]);
  const [playingSongId, setPlayingSongId] = useState<number | null>(null);

  const handleAddToPlaylist = (playlistId: number, songId: number) => {
    setPlaylists(currentPlaylists => 
      currentPlaylists.map(playlist => {
        if (playlist.id === playlistId) {
          if (playlist.songs.includes(songId)) {
            toast({
              title: "Already in playlist",
              description: "This song is already in the selected playlist",
              variant: "destructive",
            });
            return playlist;
          }
          toast({
            title: "Success",
            description: "Song added to playlist successfully",
          });
          return {
            ...playlist,
            songs: [...playlist.songs, songId],
          };
        }
        return playlist;
      })
    );
  };

  const handlePlaySong = (songId: number) => {
    setPlayingSongId(songId);
    toast({
      title: "Now Playing",
      description: `Playing ${allSongs.find(s => s.id === songId)?.title}`,
    });
  };

  const renderSongList = (songs: typeof alkebulanSongs) => (
    <div className="space-y-2">
      {songs.map((song, index) => (
        <div
          key={song.id}
          className="group flex items-center justify-between p-3 rounded-lg hover:bg-[#1EAEDB]/10 transition-all duration-300 cursor-pointer border border-transparent hover:border-[#1EAEDB]/20 hover:shadow-lg hover:shadow-[#1EAEDB]/10 hover:scale-[1.02] transform animate-fade-in"
          style={{ animationDelay: `${index * 30}ms` }}
        >
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-full transition-all duration-200 ${
                playingSongId === song.id 
                  ? 'text-[#1EAEDB] bg-[#1EAEDB]/20 animate-pulse' 
                  : 'text-[#F2FCE2] hover:text-[#1EAEDB] hover:bg-[#1EAEDB]/10 opacity-0 group-hover:opacity-100'
              }`}
              onClick={() => handlePlaySong(song.id)}
            >
              <PlayCircle className="h-4 w-4" />
            </Button>
            <span className={`transition-colors ${
              playingSongId === song.id ? 'text-[#1EAEDB]' : 'text-[#F2FCE2] group-hover:text-[#FEF7CD]'
            }`}>
              {song.title}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#F2FCE2]/60 group-hover:text-[#F2FCE2]/80 transition-colors">
              {song.duration}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-[#F2FCE2] hover:text-[#1EAEDB] hover:bg-[#1EAEDB]/10 transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {playlists.map((playlist) => (
                  <DropdownMenuItem
                    key={playlist.id}
                    onClick={() => handleAddToPlaylist(playlist.id, song.id)}
                  >
                    Add to {playlist.name}
                  </DropdownMenuItem>
                ))}
                {playlists.length === 0 && (
                  <DropdownMenuItem disabled>
                    No playlists available
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section id="library" className="p-6">
      <Card className="bg-black/40 backdrop-blur-lg border-[#1EAEDB]/10">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-[#FEF7CD] mb-4">Albums</h2>
          <Accordion type="multiple" defaultValue={["alkebulan", "upcoming"]} className="w-full">
            <AccordionItem value="alkebulan" className="border-[#1EAEDB]/20">
              <AccordionTrigger className="text-[#FEF7CD] hover:text-[#1EAEDB] text-lg font-semibold transition-colors">
                Alkebulan
                <span className="text-sm text-[#F2FCE2]/60 ml-2">({alkebulanSongs.length} tracks)</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                {renderSongList(alkebulanSongs)}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="upcoming" className="border-[#1EAEDB]/20">
              <AccordionTrigger className="text-[#FEF7CD] hover:text-[#1EAEDB] text-lg font-semibold transition-colors">
                Upcoming Projects
                <span className="text-sm text-[#F2FCE2]/60 ml-2">({upcomingProjectsSongs.length} tracks)</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                {renderSongList(upcomingProjectsSongs)}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </section>
  );
};