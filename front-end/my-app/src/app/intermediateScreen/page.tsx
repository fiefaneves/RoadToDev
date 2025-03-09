'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Progress } from '@/Components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import Sidebar from "@/Components/sidebar";
import { FiChevronRight } from "react-icons/fi";

export default function ProfileScreen() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [roadmaps] = useState([
    { title: "Front-end", progress: 30 },
    { title: "Back-end", progress: 65 },
    { title: "Mobile", progress: 15 }
  ]);

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

  return (
    <div className="min-h-screen bg-gray-50 flex relative overflow-x-hidden">
      <Sidebar
        isMobile={isMobile}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        roadmaps={roadmaps}
      />

      <div className={`flex-1 p-4 md:p-8 relative ${isMobile ? 'w-full' : ''}`}>
        {isMobile && !isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed left-4 top-20 z-30 p-2 bg-white rounded-lg shadow-md"
          >
            <FiChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        )}

        <Card className="mx-auto max-w-3xl p-6 space-y-8 shadow-lg bg-white">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-white shadow-md">
              <AvatarImage src="/avatar-placeholder.png" />
              <AvatarFallback className="bg-blue-100 text-2xl font-medium text-gray-600">
                UN
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4 w-full text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900">User Name</h1>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="text-gray-600">Overall Progress</span>
                  <span className="text-gray-600">50%</span>
                </div>
                <Progress 
                  value={50} 
                  className="h-3 bg-gray-200"
                />
              </div>
            </div>
          </div>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 text-center md:text-left">Interests</h2>
            <div className="rounded-lg bg-gray-50 p-4 border border-gray-100">
              <p className="text-gray-600 leading-relaxed text-center md:text-left">
                Hello, I am Heinz. I am a Computer Science student at the Federal University of Pernambuco (UFPE) and I have a great desire to learn new technologies.
              </p>
            </div>
          </section>

          <section className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <span className="text-blue-600">✉️</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Email</p>
                <p className="text-gray-900 font-mono">heitorfelipes27@gmail.com</p>
              </div>
            </div>
          </section>

          <div className="border-t pt-6">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 py-6 text-lg font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:from-blue-700 hover:to-blue-600 active:scale-95">
              Generate Roadmap →
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}