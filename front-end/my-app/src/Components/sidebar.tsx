'use client';

import { Progress } from "./ui/progress";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useFetchRoadmaps from '@/hooks/useFetchRoadmaps';

interface SidebarProps {
  isMobile: boolean;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  userId: string;
}

export default function Sidebar({ 
  isMobile, 
  isSidebarOpen, 
  setIsSidebarOpen,
  userId 
}: SidebarProps) {
  const router = useRouter();
  const { roadmaps, loading, error } = useFetchRoadmaps(userId);

  const handleRoadmapClick = (roadmapId: string) => {
    router.push(`/roadMap/${roadmapId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`
        bg-white border-r transition-transform duration-300 ease-in-out
        ${isMobile ? 
          `fixed left-0 top-0 h-full z-50 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64`
          : `static w-64 translate-x-0`
        }
        shadow-lg
      `}>
        <div className="flex flex-col h-full p-4">
          {isMobile && (
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="mb-6 p-2 hover:bg-gray-100 rounded-lg self-end transition-colors duration-200"
            >
              {isSidebarOpen ? (
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              )}
            </button>
          )}

          <div className="space-y-6 flex-1 overflow-y-auto">
            <h2 className="font-semibold text-sm whitespace-nowrap text-gray-700">
              Roadmap Progress
            </h2>
            
            {roadmaps.slice().reverse().map((roadmap, index) => (
              <button 
                key={roadmap._id}
                className="space-y-2 min-w-fit w-full text-left"
                onClick={() => handleRoadmapClick(roadmap._id)}
              >
                <div className="flex justify-between text-sm whitespace-nowrap">
                  <span className="truncate text-gray-600">Roadmap {roadmaps.length - index}</span>
                  <span className="ml-2 text-gray-600 font-medium">{roadmap.progress}%</span>
                </div>
                <Progress 
                  value={roadmap.progress} 
                  className="h-2 bg-gray-200"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}