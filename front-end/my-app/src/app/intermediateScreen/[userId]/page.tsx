'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Progress } from '@/Components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import Sidebar from "@/Components/sidebar";
import { FiChevronRight } from "react-icons/fi";
import useFetchUserData from '@/hooks/useFetchUserData';
import useFetchRoadmaps from '@/hooks/useFetchRoadmaps';
import Link from 'next/link';

export default function ProfileScreen() {
  const { userId } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const { userData, loading, error } = useFetchUserData(userId as string);
  const { roadmaps, loading: roadmapsLoading, error: roadmapsError } = useFetchRoadmaps(userId as string);
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(true);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNavigation = () => {
    setIsNavigating(true);
    router.push(`/forms`);
  };

  if (loading || roadmapsLoading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
    </div>
  );

  if (error || roadmapsError) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
        Error: {error || roadmapsError}
      </div>
    </div>
  );

  const overallProgress = roadmaps.length > 0
    ? (roadmaps.reduce((acc, roadmap) => acc + roadmap.progress, 0) / roadmaps.length).toFixed(2)
    : 0;

  return (
    <div className="min-h-screen bg-gray-100 flex relative overflow-x-hidden">
      <Sidebar
        isMobile={isMobile}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        userId={userId as string}
      />

      <div className={`flex-1 p-4 md:p-8 relative ${isMobile ? 'w-full' : ''}`}>
        {isMobile && !isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed left-4 top-20 z-30 p-2 bg-white rounded-lg shadow-md hover:bg-grey-50 transition-colors"
          >
            <FiChevronRight className="w-5 h-5 text-purple-600" />
          </button>
        )}

        <Card className="mx-auto max-w-3xl p-6 space-y-8 shadow-xl bg-white rounded-xl">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              <AvatarImage src="/avatar-placeholder.png" />
              <AvatarFallback className="bg-gradient-to-r from-purple-100 to-blue-100 text-2xl font-medium text-purple-600">
                {userData?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4 w-full text-center md:text-left">
              <h1 className="text-3xl font-semibold text-gray-700">{userData?.name}</h1>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="text-gray-600">Progresso Geral</span>
                  <span className="text-gray-600">{overallProgress}%</span>
                </div>
                <Progress 
                  value={parseFloat(overallProgress.toString())} 
                  className="h-3 bg-gray-200 [&>div]:bg-gradient-to-r [&>div]:from-purple-600 [&>div]:to-blue-500"
                />
              </div>
            </div>
          </div>

          <section className="rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm">
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-100 to-blue-100">
                <span className="text-purple-600">✉️</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Email</p>
                <p className="text-gray-800 font-mono">{userData?.email}</p>
              </div>
            </div>
          </section>

          <div className="border-t border-gray-200 pt-6">
            <Link href="/forms">            
              <Button 
                onClick={handleNavigation}
                disabled={isNavigating}
                className={`w-full bg-gradient-to-r from-purple-600 to-blue-500 py-6 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all ${
                  !isNavigating ? 'hover:scale-[1.02] hover:from-purple-700 hover:to-blue-600 active:scale-[0.98]' : ''
                } disabled:opacity-70 disabled:cursor-not-allowed`}
                >
                  {isNavigating ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg 
                        className="animate-spin h-5 w-5 text-white" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Gerando Roadmap...
                    </span>
                  ) : (
                    'Gerar Roadmap →'
                  )}
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}