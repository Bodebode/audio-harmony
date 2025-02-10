
export type Comment = {
  id: number;
  userId: string;
  content: string;
  timestamp: Date;
};

export type Collaborator = {
  id: string;
  role: 'editor' | 'viewer';
};

export type Playlist = {
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

export type Song = {
  id: number;
  title: string;
  duration: string;
};
