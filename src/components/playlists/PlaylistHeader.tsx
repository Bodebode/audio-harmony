
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

type PlaylistHeaderProps = {
  newPlaylistName: string;
  setNewPlaylistName: (name: string) => void;
  handleCreatePlaylist: () => void;
};

export const PlaylistHeader = ({
  newPlaylistName,
  setNewPlaylistName,
  handleCreatePlaylist,
}: PlaylistHeaderProps) => {
  return (
    <div className="flex gap-3 mb-6">
      <Input
        value={newPlaylistName}
        onChange={(e) => setNewPlaylistName(e.target.value)}
        placeholder="Enter playlist name"
        className="bg-black/20 border-[#1EAEDB]/20 text-[#F2FCE2] placeholder:text-[#F2FCE2]/50"
      />
      <Button
        onClick={handleCreatePlaylist}
        className="bg-[#1EAEDB] hover:bg-[#1EAEDB]/80 text-white transition-colors duration-200"
      >
        <Plus className="h-5 w-5 mr-2" />
        Create
      </Button>
    </div>
  );
};
