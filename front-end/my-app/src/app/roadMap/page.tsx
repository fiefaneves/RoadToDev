'use client';

import { useRoadMap } from "../RoadMapContext";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/Components/ui/checkbox";
import { Card } from "@/Components/ui/card";
import Sidebar from "@/Components/sidebar";
import { Progress } from "@/Components/ui/progress";
import { ChevronRight } from "lucide-react";

const MOCK_ROADMAP = {
  title: "Full Stack Developer Roadmap 2024",
  steps: [
    "🌐 Fundamentos da Web: HTML5, CSS3, HTTP/HTTPS",
    "🎨 Design Responsivo: Flexbox, Grid, Media Queries",
    "⚡ JavaScript Moderno: ES6+, Async/Await, Promises",
    "📦 Versionamento: Git, GitHub, Fluxo de Trabalho",
    "🚀 Frontend Framework: React.js com TypeScript",
    "🔧 Ferramentas de Build: Webpack, Babel, Vite",
    "📡 Backend Essentials: Node.js, Express, REST APIs",
    "🗄️ Banco de Dados: SQL (PostgreSQL) e NoSQL (MongoDB)",
    "🔐 Autenticação: JWT, OAuth 2.0, Sessions",
    "☁️ Cloud Deployment: AWS, Docker, CI/CD Pipelines"
  ],
  progress: [
    { title: "Frontend", progress: 65 },
    { title: "Backend", progress: 40 },
    { title: "DevOps", progress: 25 }
  ]
};

const RoadMapPage = () => {
    const { setRoadmap } = useRoadMap();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [checkedItems, setCheckedItems] = useState<boolean[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) setIsSidebarOpen(false);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
      const initializeRoadmap = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const mockRoadmapString = MOCK_ROADMAP.steps.join("\n");
          setRoadmap(mockRoadmapString);
          setCheckedItems(new Array(MOCK_ROADMAP.steps.length).fill(false));
          setIsLoading(false);

        } catch (error) {
          console.error("Erro ao carregar roadmap:", error);
          router.push("/login");
        }
      };

      initializeRoadmap();
    }, [router, setRoadmap]);

    const handleCheckboxChange = (index: number) => {
      setCheckedItems(prev => {
        const newItems = [...prev];
        newItems[index] = !newItems[index];
        return newItems;
      });
    };

    const calculateProgress = () => {
      if (checkedItems.length === 0) return 0;
      const checkedCount = checkedItems.filter(Boolean).length;
      return Math.round((checkedCount / checkedItems.length) * 100);
    };

    const progressValue = calculateProgress();

    return (
      <div className="min-h-screen bg-gray-50 flex relative overflow-x-hidden">
        {isMobile && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <Sidebar
          isMobile={isMobile}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          roadmaps={MOCK_ROADMAP.progress}
        />

        <div className="flex-1 p-4 md:p-8">
          {isMobile && !isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="mb-4 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          )}

          <Card className="mx-auto max-w-3xl p-6 space-y-6">
            <header className="border-b pb-4 space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {MOCK_ROADMAP.title}
              </h1>
              <div className="flex items-center gap-4">
                <Progress 
                  value={progressValue} 
                  className="h-3 bg-gray-200 flex-1"
                  style={{ backgroundColor: '#f0f0f0', transition: 'all 0.3s' }}
                />
                <span className="text-gray-600 font-medium min-w-[100px]">
                  Progresso: {progressValue}%
                </span>
              </div>
            </header>

            {isLoading ? (
              <div className="text-center py-8 space-y-2">
                <div className="animate-pulse space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded w-full" />
                  ))}
                </div>
              </div>
            ) : (
              <>
                {MOCK_ROADMAP.steps.map((step, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg border hover:border-gray-300 transition-all"
                  >
                    <Checkbox
                      checked={checkedItems[index] || false}
                      onCheckedChange={() => handleCheckboxChange(index)}
                      className="mt-1.5"
                    />
                    <p className={`flex-1 text-gray-700 text-lg ${
                      checkedItems[index] ? 'line-through opacity-50' : ''
                    }`}>
                      <span className="font-semibold text-gray-900">
                        Etapa {index + 1}:
                      </span> {step}
                    </p>
                  </div>
                ))}
              </>
            )}
          </Card>
        </div>
      </div>
    );
};

export default RoadMapPage;