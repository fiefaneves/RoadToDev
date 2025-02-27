"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../Components/ui/button";
import { useRouter } from "next/navigation";
import { useRoadMap } from "../../app/RoadMapContext";

const SignUpPage = () => {
  const [loading, setLoading] = React.useState(false);
  const { setRoadmap } = useRoadMap();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
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
    const queryDescription = `${data.name} quer aprender ${data.technology} na área de ${data.interest} com experiência ${data.experience}, quero que você gere um texto com 8 tópicos (detalhando-os)   e separe-os com um 'enter'`;
    
    console.log("Query description:", queryDescription);
    setLoading(true);
  
    try {
      const response = await fetch("http://localhost:3005/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ queryDescription }),
      });
  
      console.log("Status da resposta:", response.status);
      if (!response.ok) {
        throw new Error("Failed to generate roadmap");
      }
  
      const result = await response.json();
      console.log("Resultado da API:", result);
  
      if (typeof result !== 'object' || result === null) {
        alert("Estrutura de resposta inválida: resposta não é um objeto");
        return;
      }
  
      if (result && result.hasOwnProperty("response")) {
        const roadmapDescription = result.response;
        setRoadmap(roadmapDescription);
        console.log("Roadmap atualizado:", roadmapDescription);
        reset();
        router.push("/roadMap");
      } else {
        console.log("Estrutura da resposta:", result); 
        alert("Falha ao gerar roadmap - Campo `response` não encontrado");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Ocorreu um erro ao gerar o roadmap");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="md:w-[20vw] bg-white mx-auto mt-20 p-6 rounded-lg shadow-lg mb-2">
        <h1 className="flex justify-center text-black text-[50px]">Sign up</h1>
        <p className="flex justify-center text-black text-[11px] mb-8">
          Sign up for a better experience
        </p>

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
              <option value="product manager">Poduct manager</option>


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
            <Button type="submit" className="w-full bg-black text-white">
              {loading ? "Loading..." : "Sign up"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
