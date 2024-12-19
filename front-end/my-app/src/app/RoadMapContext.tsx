"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Definindo o tipo do contexto para garantir que o estado do roadmap seja uma string
interface RoadMapContextType {
  roadmap: string; // Texto do roadmap gerado
  setRoadmap: (roadmap: string) => void; // Função para atualizar o roadmap
}

// Criando o contexto, inicialmente sem valor (undefined)
const RoadMapContext = createContext<RoadMapContextType | undefined>(undefined);

// Hook personalizado para acessar o contexto
export const useRoadMap = () => {
  const context = useContext(RoadMapContext);

  // Lançando erro caso o hook seja usado fora do RoadMapProvider
  if (!context) {
    throw new Error("useRoadMap deve ser usado dentro de um RoadMapProvider");
  }

  return context;
};

// Componente Provider que irá envolver a aplicação e fornecer o contexto
export const RoadMapProvider = ({ children }: { children: ReactNode }) => {
  const [roadmap, setRoadmap] = useState<string>(""); // Estado para armazenar o texto do roadmap gerado

  return (
    <RoadMapContext.Provider value={{ roadmap, setRoadmap }}>
      {children} {/* Renderiza os filhos com o contexto acessível */}
    </RoadMapContext.Provider>
  );
};
