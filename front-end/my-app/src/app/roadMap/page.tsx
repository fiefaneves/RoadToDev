"use client";

import { useRoadMap } from "../RoadMapContext";
import React, {useEffect} from "react";
import { useRouter } from "next/navigation";
import { UserSignUpService } from "@/service/userService";

const RoadMapPage = () => {
    const { roadmap, setRoadmap } = useRoadMap();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const router = useRouter();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    useEffect(() => {
      const userService = new UserSignUpService();
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user) {
        router.push("/login");
        return;
      };
      const fetchRoadmap = async () => {
        setIsLoading(true);
        try {
          const response = await userService.findRoadMap(user.id);
          if (response.status === 200) {
            setRoadmap(response.data.roadmap);
          } else {
            alert("Failed to fetch roadmap");
          }
        } catch (error) {
          console.error(error);
          alert("An error occurred while fetching the roadmap");
        } finally {
          setIsLoading(false);
        }  
      };

      fetchRoadmap();
    }, [router, user, setRoadmap]);


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
