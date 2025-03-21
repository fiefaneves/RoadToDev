'use client';

import { useRoadMap } from "../../RoadMapContext";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Checkbox } from "@/Components/ui/checkbox";
import { Card } from "@/Components/ui/card";
import { Progress } from "@/Components/ui/progress";
import Sidebar from "@/Components/sidebar";

const RoadMapPage = () => {
  const { setRoadmap } = useRoadMap();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [roadmapData, setRoadmapData] = useState({ 
    topics: [], 
    progress: 0,
    links: [] 
  });
  const { roadMapId } = useParams();
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

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
          if (!roadMapId) {
            throw new Error("Roadmap ID não encontrado");
          }
    
          const response = await fetch(`http://localhost:3005/user/${roadMapId}/roadmap`, {
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
        }
      };
    
      fetchRoadmap();
  }, [roadMapId, setRoadmap]);

  const handleCheckboxChange = async (index: number) => {
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

    // Salvar o progresso no banco de dados
    try {
      const response = await fetch(`http://localhost:3005/user/roadmap/${roadMapId}/atualizar-progresso`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ topics: roadmapData.topics })
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar progresso");
      }

      console.log("Progresso atualizado com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar progresso:", error);
      alert("Erro ao atualizar progresso");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex relative overflow-x-hidden">
      {userId && (
        <Sidebar
          isMobile={isMobile}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          userId={userId}
        />
      )}
      <div className="flex-1 p-4 md:p-8">
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
                  <div className={`flex-1 text-gray-700 text-lg ${topic.completed ? 'line-through opacity-50' : ''}`}>
                    {topic.topic.split('. ').map((subTopic, subIndex) => (
                      <p key={subIndex}>{subTopic}</p>
                    ))}
                  </div>
                </div>
              ))}

              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Links e Descrições</h2>
                {roadmapData.links.map((linkItem, index) => (
                  <div key={index} className="mb-4">
                    <p className="text-lg font-semibold text-gray-800">{linkItem.descricao}</p>
                    <a href={linkItem.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {linkItem.link}
                    </a>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default RoadMapPage;