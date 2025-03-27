"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface RoadMapContextType {
  roadmap: string;
  setRoadmap: (roadmap: string) => void;
}

const RoadMapContext = createContext<RoadMapContextType | undefined>(undefined);

export const useRoadMap = () => {
  const context = useContext(RoadMapContext);

  if (!context) {
    throw new Error("useRoadMap deve ser usado dentro de um RoadMapProvider");
  }

  return context;
};

export const RoadMapProvider = ({ children }: { children: ReactNode }) => {
  const [roadmap, setRoadmap] = useState<string>("");

  return (
    <RoadMapContext.Provider value={{ roadmap, setRoadmap }}>
      {children}
    </RoadMapContext.Provider>
  );
};
