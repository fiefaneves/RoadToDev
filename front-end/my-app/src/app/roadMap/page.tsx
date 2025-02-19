"use client";

import { useRoadMap } from "../RoadMapContext";
import React from "react";

const RoadMapPage = () => {
    const { roadmap } = useRoadMap();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
      if (!roadmap) {
        setIsLoading(true);
      } else {
        setIsLoading(false);
      }
    }, [roadmap]);

    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/2">
          <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Seu RoadMap Gerado</h1>
            <div className="text-gray-700 text-left px-4 py-6">
                {isLoading ? (
                    <p className="text-gray-500 text-center px-4 py-6">Gerando roadmap, por favor aguarde...</p>
                ) : (
                    roadmap
                    ? roadmap
                        .split("\n")
                        .map((paragraph: string, index: number) => {
                            return <p key={index} className="mb-6">{paragraph}</p>;
                        })
                    : "Nenhum roadmap disponível. Por favor, tente novamente."
                )}
            </div>
        </div>
      </div>
    );
};

export default RoadMapPage;
