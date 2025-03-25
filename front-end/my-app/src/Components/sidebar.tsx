'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Progress } from "./ui/progress";
import { ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useFetchRoadmaps from '../hooks/useFetchRoadmaps';

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
  const { roadmaps, loading, error, setRoadmaps } = useFetchRoadmaps(userId);
  const [selectedRoadmap, setSelectedRoadmap] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingRoadmapId, setEditingRoadmapId] = useState<string | null>(null);
  const [newRoadmapName, setNewRoadmapName] = useState<string>('');

  const menuRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setSelectedRoadmap(null);
      }
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowModal(false);
        setSelectedRoadmap(null);
      }
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        if (editingRoadmapId) {
          handleEditRoadmapName(editingRoadmapId, newRoadmapName);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingRoadmapId, newRoadmapName]);

  useEffect(() => {
    if (editingRoadmapId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingRoadmapId]);

  const handleRoadmapClick = (roadmapId: string) => {
    if (!editingRoadmapId) {
      router.push(`/roadMap/${roadmapId}`);
    }
  };

  const handleDeleteRoadmap = async (roadmapId: string) => {
    console.log('Iniciando deleção do roadmap:', roadmapId);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      console.log('Enviando requisição para:', `http://localhost:3005/user/roadmap/${roadmapId}`);
      
      const response = await fetch(`http://localhost:3005/user/roadmap/${roadmapId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Resposta recebida:', response);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      console.log('Deleção bem sucedida, atualizando estado...');
      
      setRoadmaps(prev => {
        const newRoadmaps = prev.filter(roadmap => roadmap._id !== roadmapId);
        console.log('Novos roadmaps:', newRoadmaps);
        return newRoadmaps;
      });

      setShowModal(false);
      setSelectedRoadmap(null);
      
    } catch (error) {
      console.error('Erro na deleção:', error);
      alert(error instanceof Error ? error.message : 'Erro desconhecido');
      setShowModal(false);
      setSelectedRoadmap(null);
    }
  };

  const handleEditRoadmapName = async (roadmapId: string, newName: string) => {
    console.log('Iniciando edição do nome do roadmap:', roadmapId);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      console.log('Enviando requisição para:', `http://localhost:3005/user/roadmap/editar-nome`);
      
      const response = await fetch(`http://localhost:3005/user/roadmap/editar-nome`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ roadMapId: roadmapId, newName })
      });

      console.log('Resposta recebida:', response);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      console.log('Edição bem sucedida, atualizando estado...');
      
      setRoadmaps(prev => {
        const newRoadmaps = prev.map(roadmap => 
          roadmap._id === roadmapId ? { ...roadmap, name: newName } : roadmap
        );
        console.log('Novos roadmaps:', newRoadmaps);
        return newRoadmaps;
      });

      setEditingRoadmapId(null);
      
    } catch (error) {
      console.error('Erro na edição:', error);
      alert(error instanceof Error ? error.message : 'Erro desconhecido');
      setEditingRoadmapId(null);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && editingRoadmapId) {
      handleEditRoadmapName(editingRoadmapId, newRoadmapName);
    }
  };

  useEffect(() => {
    const handleUpdateSidebarProgress = (event: CustomEvent) => {
      const { roadMapId, newProgress } = event.detail;
      setRoadmaps(prev => 
        prev.map(roadmap => 
          roadmap._id === roadMapId ? { ...roadmap, progress: newProgress } : roadmap
        )
      );
    };

    window.addEventListener('updateSidebarProgress', handleUpdateSidebarProgress);
    return () => {
      window.removeEventListener('updateSidebarProgress', handleUpdateSidebarProgress);
    };
  }, [setRoadmaps]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {isMobile && isSidebarOpen && (
        <div 
          data-testid="sidebar-overlay"
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`
        bg-white border-r transition-transform duration-300 ease-in-out
        ${isMobile ? 
          `fixed left-0 top-0 z-50 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64`
          : `static w-64 translate-x-0`
        }
        shadow-lg
      `}>
        <div className="flex flex-col h-full p-4">
          {isMobile && (
            <button 
              data-testid="toggle-sidebar"
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
              Meus Roadmaps
            </h2>
            
            {roadmaps.slice().reverse().map((roadmap) => (
              <div key={roadmap._id} className="relative group hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200">
                <div
                  role="button"
                  data-testid="roadmap-item"
                  className="space-y-2 min-w-fit w-full text-left"
                  onClick={() => handleRoadmapClick(roadmap._id)}
                >
                  <div className="flex justify-between items-center text-sm whitespace-nowrap">
                    <div className="flex-1">
                      {editingRoadmapId === roadmap._id ? (
                        <input
                          ref={inputRef}
                          type="text"
                          value={newRoadmapName}
                          onChange={(e) => setNewRoadmapName(e.target.value)}
                          onKeyDown={handleKeyDown}
                          onClick={(e) => e.stopPropagation()}
                          className="truncate text-gray-600 bg-transparent border-none outline-none w-full"
                        />
                      ) : (
                        <span className="truncate text-gray-600">{roadmap.name}</span>
                      )}
                    </div>
                    <button 
                      className="ml-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRoadmap(roadmap._id);
                        setDeletingRoadmapId(roadmap._id);
                      }}
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  <Progress 
                    value={roadmap.progress} 
                    className="h-2 bg-gray-200"
                  />
                </div>
                {selectedRoadmap === roadmap._id && !showModal && (
                <div ref={menuRef} className="absolute top-8 right-0 bg-white border rounded-md shadow-lg z-10 min-w-[85px]">
                  <div className="space-y-1 p-1">
                    <button 
                      className="w-full px-2 py-1.5 text-sm text-gray-700 hover:bg-blue-50 rounded-sm transition-colors duration-200 text-center"
                      onClick={() => {
                        setEditingRoadmapId(roadmap._id);
                        setNewRoadmapName(roadmap.name);
                        setSelectedRoadmap(null);
                      }}
                    >
                      Renomear
                    </button>
                    <button 
                      className="w-full px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-sm transition-colors duration-200 text-center"
                      onClick={() => setShowModal(true)}
                    >
                      Deletar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirmar Exclusão</h2>
            <p className="mb-4">Tem certeza de que deseja excluir este roadmap?</p>
            <div className="flex justify-end space-x-4">
              <button 
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => {
                  setShowModal(false);
                  setDeletingRoadmapId(null);
                  setSelectedRoadmap(null);
                }}
              >
                Cancelar
              </button>
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => {
                  console.log('Botão deletar clicado, roadmap selecionado:', selectedRoadmap);
                  if (deletingRoadmapId) {
                    handleDeleteRoadmap(deletingRoadmapId);
                  }
                }}
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}