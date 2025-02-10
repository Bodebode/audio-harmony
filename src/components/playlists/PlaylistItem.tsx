
import { Play, Pencil, Trash2, Loader, Heart, MessageSquare, Users, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PlaylistSongs } from "./PlaylistSongs";

type Song = {
  id: number;
  title: string;
  duration: string;
};

type Comment = {
  id: number;
  userId: string;
  content: string;
  timestamp: Date;
};

type Collaborator = {
  id: string;
  role: 'editor' | 'viewer';
};

type Playlist = {
  id: number;
  name: string;
  description: string;
  coverImage?: string;
  tags: string[];
  songs: number[];
  shareUrl?: string;
  likes: string[];
  comments: Comment[];
  collaborators: Collaborator[];
  createdBy: string;
};

type PlaylistItemProps = {
  playlist: Playlist;
  editingPlaylist: number | null;
  editName: string;
  expandedPlaylist: number | null;
  playingPlaylist: number | null;
  draggingIndex: number | null;
  sampleSongs: Song[];
  newComment: string;
  setNewComment: (comment: string) => void;
  handleStartRename: (playlist: Playlist) => void;
  handleSaveRename: (playlistId: number) => void;
  setEditName: (name: string) => void;
  togglePlaylist: (playlistId: number) => void;
  handlePlayPlaylist: (playlist: Playlist) => void;
  handleDeletePlaylist: (playlistId: number) => void;
  handleRemoveSong: (playlistId: number, songId: number) => void;
  handleReorderSongs: (playlistId: number, dragIndex: number, dropIndex: number) => void;
  setDraggingIndex: (index: number | null) => void;
  handleLikePlaylist: (playlistId: number) => void;
  handleAddComment: (playlistId: number) => void;
  handleShareOnSocial: (playlist: Playlist) => void;
};

export const PlaylistItem = ({
  playlist,
  editingPlaylist,
  editName,
  expandedPlaylist,
  playingPlaylist,
  draggingIndex,
  sampleSongs,
  newComment,
  setNewComment,
  handleStartRename,
  handleSaveRename,
  setEditName,
  togglePlaylist,
  handlePlayPlaylist,
  handleDeletePlaylist,
  handleRemoveSong,
  handleReorderSongs,
  setDraggingIndex,
  handleLikePlaylist,
  handleAddComment,
  handleShareOnSocial,
}: PlaylistItemProps) => {
  const isLiked = playlist.likes.includes('current-user'); // In a real app, check against actual user ID

  return (
    <div className="space-y-2 animate-fade-in">
      <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 hover:bg-[#1EAEDB]/5 transition-all duration-200">
        <div className="flex items-center gap-3 flex-1">
          {playlist.coverImage && (
            <img 
              src={playlist.coverImage} 
              alt={playlist.name} 
              className="w-12 h-12 rounded object-cover"
            />
          )}
          <div className="flex-1">
            {editingPlaylist === playlist.id ? (
              <div className="flex flex-col gap-2 flex-1">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-black/20 border-[#1EAEDB]/20 text-[#F2FCE2]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveRename(playlist.id);
                    }
                  }}
                />
                <Button
                  onClick={() => handleSaveRename(playlist.id)}
                  className="bg-[#1EAEDB] hover:bg-[#1EAEDB]/80 transition-colors duration-200"
                >
                  Save
                </Button>
              </div>
            ) : (
              <>
                <div 
                  className="text-[#F2FCE2] cursor-pointer hover:text-[#1EAEDB] transition-colors duration-200"
                  onClick={() => togglePlaylist(playlist.id)}
                >
                  {playlist.name}
                </div>
                {playlist.description && (
                  <p className="text-[#F2FCE2]/70 text-sm mt-1">{playlist.description}</p>
                )}
                <div className="flex gap-2 mt-1">
                  {playlist.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="text-xs bg-[#1EAEDB]/20 text-[#F2FCE2]/90 px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleLikePlaylist(playlist.id)}
                  className={`text-[#F2FCE2] transition-colors duration-200 ${
                    isLiked ? 'text-red-500 hover:text-red-600' : 'hover:text-[#1EAEDB]'
                  }`}
                >
                  <Heart className="h-5 w-5" fill={isLiked ? 'currentColor' : 'none'} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isLiked ? 'Unlike' : 'Like'} playlist</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => togglePlaylist(playlist.id)}
                  className="text-[#F2FCE2] hover:text-[#1EAEDB] transition-colors duration-200"
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View comments</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleShareOnSocial(playlist)}
                  className="text-[#F2FCE2] hover:text-[#1EAEDB] transition-colors duration-200"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share playlist</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePlayPlaylist(playlist)}
                  className="text-[#F2FCE2] hover:text-[#1EAEDB] transition-colors duration-200"
                  disabled={playingPlaylist === playlist.id}
                >
                  {playingPlaylist === playlist.id ? (
                    <Loader className="h-5 w-5 animate-spin" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Play playlist</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleStartRename(playlist)}
                  className="text-[#F2FCE2] hover:text-[#1EAEDB] transition-colors duration-200"
                >
                  <Pencil className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit playlist</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeletePlaylist(playlist.id)}
                  className="text-[#F2FCE2] hover:text-red-500 transition-colors duration-200"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete playlist</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      {expandedPlaylist === playlist.id && (
        <div className="space-y-4">
          <PlaylistSongs
            songs={playlist.songs}
            sampleSongs={sampleSongs}
            draggingIndex={draggingIndex}
            playlistId={playlist.id}
            handleRemoveSong={handleRemoveSong}
            handleReorderSongs={handleReorderSongs}
            setDraggingIndex={setDraggingIndex}
          />
          
          <div className="mt-4 space-y-4">
            <h3 className="text-[#F2FCE2] font-semibold">Comments</h3>
            <div className="space-y-2">
              {playlist.comments.map((comment) => (
                <div 
                  key={comment.id}
                  className="bg-black/10 p-3 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[#F2FCE2]/90 font-medium">User {comment.userId}</span>
                    <span className="text-[#F2FCE2]/50 text-sm">
                      {new Date(comment.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[#F2FCE2]/80 mt-1">{comment.content}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-black/20 border-[#1EAEDB]/20 text-[#F2FCE2] placeholder:text-[#F2FCE2]/50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment(playlist.id);
                  }
                }}
              />
              <Button
                onClick={() => handleAddComment(playlist.id)}
                className="bg-[#1EAEDB] hover:bg-[#1EAEDB]/80 transition-colors duration-200"
              >
                Comment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
