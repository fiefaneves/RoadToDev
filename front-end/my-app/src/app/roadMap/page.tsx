'use client';

import { useRoadMap } from "../RoadMapContext";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/Components/ui/checkbox";
import { Card } from "@/Components/ui/card";
// import Sidebar from "@/Components/sidebar"; // Comentado: Importação da sidebar
import { Progress } from "@/Components/ui/progress";
import { ChevronRight } from "lucide-react";

const RoadMapPage = () => {
  const { setRoadmap } = useRoadMap();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [roadmapData, setRoadmapData] = useState({ 
    topics: [], 
    progress: 0 
  });
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
    const fetchRoadmap = async () => {
        try {
          const roadmapId = localStorage.getItem("roadMapId"); 
          if (!roadmapId) {
            throw new Error("Roadmap ID não encontrado");
          }
    
          const response = await fetch(`http://localhost:3005/user/${roadmapId}/roadmap`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json", 
              "Authorization": `Bearer ${localStorage.getItem("token")}` 
            }
          });
    
          if (!response.ok) {
            throw new Error("Erro ao buscar roadmap");
          }
    
          const data = await response.json(); 
          setRoadmapData(data.roadmap); 
    
          const stepsString = data.roadmap.topics.map(topic => topic.topic).join("\n"); 
          setRoadmap(stepsString); 
          setIsLoading(false); 
    
        } catch (error) {
          console.error("Erro ao carregar roadmap:", error);
          alert(error.message);
          //router.push("/login"); 
        }
      };
    
      fetchRoadmap();
  }, [router, setRoadmap]);

  const handleCheckboxChange = (index: number) => {
    setRoadmapData(prev => {
      const updatedTopics = [...prev.topics]; // Cria uma cópia dos tópicos
      updatedTopics[index].completed = !updatedTopics[index].completed; // Alterna o estado "completed"

      // Calcula o novo progresso
      const completedCount = updatedTopics.filter(topic => topic.completed).length;
      const newProgress = Math.round((completedCount / updatedTopics.length) * 100);

      return {
        ...prev, // Mantém as outras propriedades do estado
        topics: updatedTopics, // Atualiza os tópicos
        progress: newProgress // Atualiza o progresso
      };
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex relative overflow-x-hidden">
      {/* Comentado: Overlay da sidebar em dispositivos móveis */}
      {/* {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )} */}

      {/* Comentado: Renderização da sidebar */}
      {/* <Sidebar
        isMobile={isMobile}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        progress={roadmapData.progress} // Passa o progresso para o Sidebar
      /> */}

      <div className="flex-1 p-4 md:p-8">
        {/* Comentado: Botão para abrir a sidebar em dispositivos móveis */}
        {/* {isMobile && !isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="mb-4 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        )} */}

        <Card className="mx-auto max-w-3xl p-6 space-y-6">
          <header className="border-b pb-4 space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Roadmap
            </h1>
            <div className="flex items-center gap-4">
              <Progress 
                value={roadmapData.progress} 
                className="h-3 bg-gray-200 flex-1"
                style={{ backgroundColor: '#f0f0f0', transition: 'all 0.3s' }}
              />
              <span className="text-gray-600 font-medium min-w-[100px]">
                Progresso: {roadmapData.progress}%
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
              {roadmapData.topics.map((topic, index) => ( 
                <div 
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg border hover:border-gray-300 transition-all"
                >
                  <Checkbox
                    checked={topic.completed || false}
                    onCheckedChange={() => handleCheckboxChange(index)}
                    className="mt-1.5"
                  />
                  <p className={`flex-1 text-gray-700 text-lg ${
                    topic.completed ? 'line-through opacity-50' : ''
                  }`}>
                    {topic.topic}
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