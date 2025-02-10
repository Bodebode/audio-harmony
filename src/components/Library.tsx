
import { PlayCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const sampleSongs = [
  { id: 1, title: "Song 1", duration: "3:45" },
  { id: 2, title: "Song 2", duration: "4:20" },
  { id: 3, title: "Song 3", duration: "3:15" },
  { id: 4, title: "Song 4", duration: "3:50" },
  { id: 5, title: "Song 5", duration: "4:10" },
  { id: 6, title: "Song 6", duration: "3:30" },
  { id: 7, title: "Song 7", duration: "4:05" },
  { id: 8, title: "Song 8", duration: "3:55" },
  { id: 9, title: "Song 9", duration: "4:15" },
  { id: 10, title: "Song 10", duration: "3:40" }
];

export const Library = () => {
  return (
    <section id="library" className="p-6">
      <Card className="bg-black/40 backdrop-blur-lg border-[#1EAEDB]/10">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-[#FEF7CD] mb-4">Library</h2>
          <div className="space-y-2">
            {sampleSongs.map((song) => (
              <div
                key={song.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-[#1EAEDB]/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <PlayCircle className="h-5 w-5 text-[#F2FCE2]" />
                  <span className="text-[#F2FCE2]">{song.title}</span>
                </div>
                <span className="text-[#F2FCE2]">{song.duration}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
