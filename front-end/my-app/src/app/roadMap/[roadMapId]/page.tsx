'use client';

import { useRoadMap } from "../../RoadMapContext";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Checkbox } from "@/Components/ui/checkbox";
import { Card } from "@/Components/ui/card";
import { Progress } from "@/Components/ui/progress";
import Sidebar from "@/Components/sidebar";
import { FiChevronRight } from "react-icons/fi";

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
    const updatedTopics = roadmapData.topics.map((topic, i) => 
      i === index ? { ...topic, completed: !topic.completed } : topic
    );

    const completedCount = updatedTopics.filter(topic => topic.completed).length;
    const newProgress = (completedCount / updatedTopics.length) * 100;

    setRoadmapData(prev => ({
      ...prev,
      topics: updatedTopics,
      progress: newProgress
    }));

    try {
      const response = await fetch(`http://localhost:3005/user/roadmap/${roadMapId}/atualizar-progresso`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ topics: updatedTopics }) 
      });

      if (!response.ok) throw new Error("Erro ao atualizar progresso");

      const sidebarProgressEvent = new CustomEvent('updateSidebarProgress', {
        detail: { roadMapId, newProgress }
      });
      window.dispatchEvent(sidebarProgressEvent);
      
    } catch (error) {
      console.error("Erro ao atualizar progresso:", error);
      setRoadmapData(prev => ({
        ...prev,
        topics: prev.topics.map((topic, i) => 
          i === index ? { ...topic, completed: !topic.completed } : topic
        ),
        progress: prev.progress
      }));
    }
  };

  const formatProgress = (progress) => {
    return progress % 1 === 0 ? progress.toFixed(0) : progress.toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex relative overflow-x-hidden">
      {userId && (
        <Sidebar
          isMobile={isMobile}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          userId={userId}
        />
      )}
      <div className={`flex-1 p-4 md:p-8 relative ${isMobile ? 'w-full' : ''}`}>
        {isMobile && !isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed left-4 top-20 z-30 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          >
            <FiChevronRight className="w-5 h-5 text-purple-600" />
          </button>
        )}

        <Card className="mx-auto max-w-3xl p-6 space-y-6 shadow-xl rounded.xl bg-white">
          <header className="border-b border-gray-200 pb-4 space-y-4">
            <h1 className="text-3xl font-bold text-gray-700">
              Meu Roadmap
            </h1>
            <div className="flex items-center gap-4">
              <Progress 
                value={roadmapData.progress} 
                className="h-3 bg-gray-200 flex-1 [&>div]:bg-gradient-to-r [&>div]:from-purple-600 [&>div]:to-blue-500"
              />
              <span className="text-gray-600 font-medium min-w-[100px]">
                Progresso: {formatProgress(roadmapData.progress)}%
              </span>
            </div>
          </header>

          {isLoading ? (
            <div className="space-y-4 py-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4">
                  <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
            <div className="space-y-3">
              {roadmapData.topics.map((topic, index) => (
                <div 
                  key={index}
                  className={`flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-purple-300 transition-all ${
                    topic.completed ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <Checkbox
                    checked={topic.completed || false}
                    onCheckedChange={() => handleCheckboxChange(index)}
                    className="mt-0.5 h-5 w-5 border-gray-300 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  />
                  <div className={`flex-1 text-gray-700 ${
                    topic.completed ? 'line-through text-gray-400' : 'text-gray-700'
                  }`}>
                    {topic.topic.split('. ').map((subTopic, subIndex) => (
                      <p key={subIndex} className="mb-1 last:mb-0">{subTopic}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {roadmapData.links.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Recursos Úteis</h2>
                <div className="space-y-3">
                  {roadmapData.links.map((linkItem, index) => (
                    <div 
                      key={index} 
                      className="p-4 rounded-lg border border-gray-200 bg-gray-50 hover:border-purple-300 transition-colors"
                    >
                      <p className="text-gray-700 mb-2">{linkItem.descricao}</p>
                      <a 
                        href={linkItem.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-purple-600 hover:text-purple-800 hover:underline transition-colors"
                      >
                        {linkItem.link}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  </div>
);
};

export default RoadMapPage;