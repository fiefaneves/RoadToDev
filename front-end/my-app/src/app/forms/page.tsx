"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/Components/ui/button";
import { useRouter } from "next/navigation";
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
      interest: "",
      experience: "",
      technology: "",
    },
  });

  interface FormData {
    interest: string;
    experience: string;
    technology: string;
  }

  const onSubmit = async (data: FormData) => {
    const queryDescription = `Quero aprender ${data.technology} na área de ${data.interest} com experiência ${data.experience}. Gere um plano de estudos com exatamente 8 tópicos que devo estudar.

    Cada tópico deve seguir este formato:
    
    1. [Nome do Tópico]
    Conceitos principais
    
    Os tópicos DEVEM estar separados por uma linha em branco (duplo ENTER) para garantir a correta divisão do texto.
    Não explique os conceitos, apenas liste os conteúdos que devo estudar em cada tópico.`;
    
    console.log("Query description:", queryDescription);
    setLoading(true);
    setError(null);
  
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch("https://roadtodev-production.up.railway.app/generate", {
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

        <div className="w-full max-w-lg bg-white mx-auto p-8 rounded-xl shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-blue-700">Gerar Roadmap</h1>
            <p className="text-gray-600 mt-2">Crie seu plano de aprendizado personalizado</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label htmlFor="interest" className="block text-sm font-medium text-gray-700">
                Área de Interesse
              </label>
              <select
                id="interest"
                {...register("interest", { required: "Selecione uma área de interesse" })}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 transition-colors"
              >
                <option value="">Selecione</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="fullstack">Fullstack</option>
                <option value="ux/ui design">UX/UI Design</option>
                <option value="analista de dados">Analista de dados</option>
                <option value="cybersegurança">Cybersegurança</option>
                <option value="gestão de projetos">Gestão de projetos</option>
                <option value="engenharia de prompt">Engenharia de Prompt</option>
              </select>
              {errors.interest && (
                <p className="text-sm text-red-500 mt-1">{errors.interest.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                Nível de Experiência
              </label>
              <select
                id="experience"
                {...register("experience", { required: "Selecione seu nível de experiência" })}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 transition-colors"
              >
                <option value="">Selecione</option>
                <option value="beginner">Iniciante</option>
                <option value="intermediate">Intermediário</option>
                <option value="advanced">Avançado</option>
              </select>
              {errors.experience && (
                <p className="text-sm text-red-500 mt-1">{errors.experience.message}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="technology" className="block text-sm font-medium text-gray-700">
                Tecnologia para Aprimorar
              </label>
              <select
                id="technology"
                {...register("technology", { required: "Selecione uma tecnologia" })}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 transition-colors"
              >
                <option value="">Selecione</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="react">React</option>
                <option value="angular">Angular</option>
                <option value="node">Node.js</option>
                <option value="express">Express</option>
                <option value="django">Django</option>
                <option value="flask">Flask</option>
                <option value="typescript">TypeScript</option>
                <option value="java">Java</option>
                <option value="csharp">C#</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="tailwind">Tailwind CSS</option>
                <option value="bootstrap">Bootstrap</option>
                <option value="sql">SQL</option>
                <option value="mongodb">MongoDB</option>
                <option value="postgresql">PostgreSQL</option>
                <option value="mysql">MySQL</option>
                <option value="docker">Docker</option>
                <option value="kubernetes">Kubernetes</option>
                <option value="aws">AWS</option>
                <option value="azure">Azure</option>
                <option value="git e github">Git e GitHub</option>
              </select>
              {errors.technology && (
                <p className="text-sm text-red-500 mt-1">{errors.technology.message}</p>
              )}
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={loading}
                className={`w-full bg-gradient-to-r from-purple-600 to-blue-500 py-3 rounded-lg font-semibold text-lg text-white shadow-lg transition-all ${
                  !loading ? 'hover:shadow-xl hover:scale-[1.02] hover:from-purple-700 hover:to-blue-600 active:scale-[0.98]' : ''
                } disabled:opacity-70 disabled:cursor-not-allowed`}
              >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg 
                    className="animate-spin h-5 w-5 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Gerando...
                </span>
              ) : "Gerar Roadmap →"}
            </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GenerateRoadMapPage;
