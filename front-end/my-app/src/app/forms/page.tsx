"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/Components/ui/button";
import { useRouter } from "next/navigation";
import { useRoadMap } from "../../app/RoadMapContext";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "@/Components/sidebar";
import { FiChevronRight } from "react-icons/fi";

const GenerateRoadMapPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserId(localStorage.getItem('userId'));
    }
  }, []);

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      interest: "",
      experience: "",
      technology: "",
    },
  });

  interface FormData {
    name: string;
    interest: string;
    experience: string;
    technology: string;
  }

  const onSubmit = async (data: FormData) => {
    const queryDescription = `${data.name} quer aprender ${data.technology} na área de ${data.interest} com experiência ${data.experience}, quero que você gere um texto com 8 tópicos (detalhando-os) e separe-os com um 'enter'`;
    
    console.log("Query description:", queryDescription);
    setLoading(true);
    setError(null);
  
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch("http://localhost:3005/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ queryDescription, userId, tema: data.interest }),
      });
  
      console.log("Status da resposta:", response.status);
      console.log(userId);
      if (!response.ok) {
        throw new Error("Falha ao gerar o roadmap!");
      }
  
      const result = await response.json();
      console.log("Resultado da API:", result);
  
      if (response.status === 201) {
        localStorage.setItem("roadMapId", result.roadMapId);
        router.push(`/roadMap/${result.roadMapId}`);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Erro:", error);
      setError("Ocorreu um erro ao gerar o roadmap. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen flex relative overflow-x-hidden">
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
            className="fixed left-4 top-20 z-30 p-2 bg-white rounded-lg shadow-md"
          >
            <FiChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        )}

        <div className="w-full max-w-lg bg-white mx-auto p-6 rounded-lg shadow-lg mb-2">
          <h1 className="text-center text-3xl font-bold text-gray-900">Generate</h1>
          <p className="text-center text-gray-600 mb-8">Generate your Road Map</p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="name"
                {...register("name", { required: "Name is required" })}
                type="text"
                placeholder="Your name"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="interest" className="block text-sm font-medium text-gray-700">
                Area of Interest
              </label>
              <select
                id="interest"
                {...register("interest", { required: "Please select an area of interest" })}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="fullstack">Fullstack</option>
                <option value="ux/ui design">UX/UI Design</option>
                <option value="data analyst">Data analyst</option>
                <option value="cyber security">Cyber security</option>
                <option value="project manager">Project manager</option>
              </select>
              {errors.interest && (
                <p className="text-sm text-red-500 mt-1">{errors.interest.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                Experience
              </label>
              <select
                id="experience"
                {...register("experience", { required: "Please select your experience level" })}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              {errors.experience && (
                <p className="text-sm text-red-500 mt-1">{errors.experience.message}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="technology" className="block text-sm font-medium text-gray-700">
                Technology to Improve
              </label>
              <select
                id="technology"
                {...register("technology", { required: "Please select a technology" })}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select</option>
                <option value="react">React</option>
                <option value="node">Node.js</option>
                <option value="typescript">TypeScript</option>
                <option value="css">CSS</option>
                <option value="sql">SQL</option>
                <option value="engenharia de prompt">Prompt engineering</option>
                <option value="git e github ">Git e github</option>
              </select>
              {errors.technology && (
                <p className="text-sm text-red-500 mt-1">{errors.technology.message}</p>
              )}
            </div>

            <div>
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-500 py-3 rounded-md font-semibold text-lg text-white shadow-lg transition-all hover:scale-[1.02] hover:from-blue-700 hover:to-blue-600 active:scale-95">
                {loading ? "Loading..." : "Generate"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GenerateRoadMapPage;
