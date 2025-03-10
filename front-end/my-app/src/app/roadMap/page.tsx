'use client';

import { useRoadMap } from "../RoadMapContext";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/Components/ui/checkbox";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import Sidebar from "@/Components/sidebar";
import { Progress } from "@/Components/ui/progress";

const RoadMapPage = () => {
    const { roadmap, setRoadmap } = useRoadMap();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [checkedItems, setCheckedItems] = useState<boolean[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      
      if (!user) {
        router.push("/login");
        return;
      };

      const fetchRoadmap = async () => {
        setIsLoading(true);
        try {
          const response = {
            status: 200,
            data: {
              roadmap: "Step 1: Learn HTML\nStep 2: Learn CSS\nStep 3: Learn JavaScript\nStep 4: Learn React"
            }
          };
          if (response.status === 200) {
            setRoadmap(response.data.roadmap);
            const paragraphs = response.data.roadmap.split("\n").filter((p: string) => p.trim() !== "");
            setCheckedItems(new Array(paragraphs.length).fill(false));
          }
        } catch (error) {
          console.error(error);
          alert("Error loading roadmap");
        } finally {
          setIsLoading(false);
        }  
      };

      fetchRoadmap();
    }, [router, setRoadmap]);

    const handleCheckboxChange = (index: number) => {
      const newCheckedItems = [...checkedItems];
      newCheckedItems[index] = !newCheckedItems[index];
      setCheckedItems(newCheckedItems);
    };

    const calculateProgress = () => {
      const totalItems = checkedItems.length;
      const checkedCount = checkedItems.filter(item => item).length;
      return totalItems === 0 ? 0 : Math.round((checkedCount / totalItems) * 100);
    };

    const progressValue = calculateProgress();

    return (
      <div className="min-h-screen bg-gray-50 flex relative overflow-x-hidden">
        <Sidebar
          isMobile={isMobile}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          roadmaps={[]}
        />

        <div className="flex-1 p-4 md:p-8">
          <Card className="mx-auto max-w-3xl p-6 space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b pb-4 gap-4">
              <h1 className="text-3xl font-bold text-gray-900">
                Your Generated RoadMap
              </h1>
              <div className="flex items-center w-full md:w-auto gap-4">
                <div className="flex-1 min-w-[150px]">
                  <Progress 
                    value={progressValue} 
                    className="h-3 bg-gray-200"
                  />
                </div>
                <span className="text-gray-600 font-medium whitespace-nowrap">
                  {progressValue}% Complete
                </span>
              </div>
            </div>

            {isLoading ? (
              <p className="text-gray-500 text-center py-6">
                Generating roadmap, please wait...
              </p>
            ) : (
              <div className="space-y-4">
                {roadmap && roadmap.split("\n")
                  .filter(paragraph => paragraph.trim() !== "")
                  .map((paragraph, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Checkbox
                        checked={checkedItems[index]}
                        onCheckedChange={() => handleCheckboxChange(index)}
                        className="mt-1"
                      />
                      <p className={`flex-1 text-gray-700 ${
                        checkedItems[index] ? 'line-through opacity-50' : ''
                      }`}>
                        {paragraph}
                      </p>
                    </div>
                  ))
                }
              </div>
            )}

            {!isLoading && !roadmap && (
              <div className="text-center py-6 text-gray-500">
                No roadmap available. Please generate a new roadmap.
                <Button 
                  className="mt-4"
                  onClick={() => router.push("/profile")}
                >
                  Generate Roadmap
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    );
};

export default RoadMapPage;