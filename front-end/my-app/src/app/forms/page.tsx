"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../Components/ui/button";
import { useRouter } from "next/navigation";
import { useRoadMap } from "../../app/RoadMapContext";
import Image from "next/image";
import Link from "next/link";

const SignUpPage = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
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
        body: JSON.stringify({ queryDescription, userId, tema: data.interest}),
      });
  
      console.log("Status da resposta:", response.status);
      console.log(userId);
      if (!response.ok) {
        throw new Error("Falha ao gerar o roadmap!");
      }
  
      const result = await response.json();
      console.log("Resultado da API:", result);
  
      if (response.status === 201) {
        localStorage.setItem("roadMapId", result.roadMapId)
        router.push("/roadMap");
      } else{
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
    <div className=" flex h-screen w-screen bg-gray-100 items-center justify-center p-4">
      <div className="flex w-full max-w-[850px] h-[600px] bg-white rounded-lg shadow-lg overflow-hidden flex-col md:flex-row">
        {/* Esquerda - Formulário */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center bg-white shadow-md rounded-r-lg">
          {/* Cabeçalho */}
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-3xl font-bold text-blue-800 mb-2">
              Gerar Roadmap
            </h2>
            <p className="text-gray-600 text-sm md:text-lg">
              Crie um roadmap personalizado para alcançar seus objetivos.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            {/* Card - Área de Interesse */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm">
              <label
                htmlFor="interest"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Área de Interesse
              </label>
              <select
                id="interest"
                {...register("interest", {
                  required: "Selecione uma área de interesse",
                })}
                className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
              >
                <option value="">Selecione</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="fullstack">Fullstack</option>
                <option value="ux/ui design">UX/UI Design</option>
                <option value="data analyst">Data analyst</option>
                <option value="cyber security">Cyber security</option>
                <option value="project manager">Project manager</option>
              </select>
              {errors.interest && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.interest.message}
                </p>
              )}
            </div>

            {/* Card - Nível de Experiência */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm">
              <label
                htmlFor="experience"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nível de Experiência
              </label>
              <select
                id="experience"
                {...register("experience", {
                  required: "Selecione seu nível de experiência",
                })}
                className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
              >
                <option value="">Selecione</option>
                <option value="beginner">Iniciante</option>
                <option value="intermediate">Intermediário</option>
                <option value="advanced">Avançado</option>
              </select>
              {errors.experience && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.experience.message}
                </p>
              )}
            </div>

            {/* Card - Tecnologia para Melhorar */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm">
              <label
                htmlFor="technology"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tecnologia para Melhorar
              </label>
              <select
                id="technology"
                {...register("technology", {
                  required: "Selecione uma tecnologia",
                })}
                className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
              >
                <option value="">Selecione</option>
                <option value="react">React</option>
                <option value="node">Node.js</option>
                <option value="typescript">TypeScript</option>
                <option value="css">CSS</option>
                <option value="sql">SQL</option>
                <option value="engenharia de prompt">Engenharia de Prompt</option>
                <option value="git e github">Git e GitHub</option>
              </select>
              {errors.technology && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.technology.message}
                </p>
              )}
            </div>

            {/* Botão */}
            <div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 py-3 rounded-md font-semibold text-lg text-white shadow-lg transition-all hover:scale-[1.02] hover:from-purple-700 hover:to-blue-600 active:scale-95"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Gerando...
                  </div>
                ) : (
                  "Gerar Roadmap"
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Direita - Ilustração (oculta em telas pequenas) */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-b from-purple-600 to-blue-500 flex-col items-center justify-center p-6">
          <h1 className="text-4xl text-white font-bold mb-6 text-center">
            Road To Dev
          </h1>
          <Image
            src="/roadmap_img.svg"
            alt="Illustration"
            width={300}
            height={300}
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;


//     <div className="flex h-screen w-screen bg-gray-100 items-center justify-center">
//       <div className="flex w-[850px] h-[500px] bg-white rounded-lg shadow-lg overflow-hidden">
//         {/* Esquerda - Formulário */}
//         <div className="w-1/2 p-8 flex flex-col justify-center items-center bg-white shadow-md rounded-r-lg">
//           <h2 className="text-2xl font-semibold text-blue-600 text-center mb-6">
//             Gerar Roadmap
//           </h2>
//           <p className="text-center text-gray-600 mb-4">
//             Preencha os campos abaixo para gerar seu roadmap personalizado.
//           </p>

//           <form onSubmit={handleSubmit(onSubmit)} className="w-full">
//             <div className="mb-4">
//               <label
//                 htmlFor="interest"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Área de Interesse
//               </label>
//               <select
//                 id="interest"
//                 {...register("interest", {
//                   required: "Selecione uma área de interesse",
//                 })}
//                 className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
//               >
//                 <option value="">Selecione</option>
//                 <option value="frontend">Frontend</option>
//                 <option value="backend">Backend</option>
//                 <option value="fullstack">Fullstack</option>
//                 <option value="ux/ui design">UX/UI Design</option>
//                 <option value="data analyst">Data analyst</option>
//                 <option value="cyber security">Cyber security</option>
//                 <option value="project manager">Project manager</option>
//               </select>
//               {errors.interest && (
//                 <p className="text-sm text-red-500 mt-1">
//                   {errors.interest.message}
//                 </p>
//               )}
//             </div>

//             <div className="mb-4">
//               <label
//                 htmlFor="experience"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Nível de Experiência
//               </label>
//               <select
//                 id="experience"
//                 {...register("experience", {
//                   required: "Selecione seu nível de experiência",
//                 })}
//                 className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
//               >
//                 <option value="">Selecione</option>
//                 <option value="beginner">Iniciante</option>
//                 <option value="intermediate">Intermediário</option>
//                 <option value="advanced">Avançado</option>
//               </select>
//               {errors.experience && (
//                 <p className="text-sm text-red-500 mt-1">
//                   {errors.experience.message}
//                 </p>
//               )}
//             </div>

//             <div className="mb-6">
//               <label
//                 htmlFor="technology"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Tecnologia para Melhorar
//               </label>
//               <select
//                 id="technology"
//                 {...register("technology", {
//                   required: "Selecione uma tecnologia",
//                 })}
//                 className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
//               >
//                 <option value="">Selecione</option>
//                 <option value="react">React</option>
//                 <option value="node">Node.js</option>
//                 <option value="typescript">TypeScript</option>
//                 <option value="css">CSS</option>
//                 <option value="sql">SQL</option>
//                 <option value="engenharia de prompt">Engenharia de Prompt</option>
//                 <option value="git e github">Git e GitHub</option>
//               </select>
//               {errors.technology && (
//                 <p className="text-sm text-red-500 mt-1">
//                   {errors.technology.message}
//                 </p>
//               )}
//             </div>

//             <div>
//             <Button
//                 type="submit"
//                 className="w-full bg-gradient-to-r from-blue-600 to-blue-500 py-3 rounded-md font-semibold text-lg text-white shadow-lg transition-all hover:scale-[1.02] hover:from-blue-700 hover:to-blue-600 active:scale-95"
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <div className="flex items-center justify-center">
//                     <svg
//                       className="animate-spin h-5 w-5 mr-3 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     Gerando...
//                   </div>
//                 ) : (
//                   "Gerar Roadmap"
//                 )}
//               </Button>
//             </div>
//           </form>
//         </div>

//         {/* Direita - Ilustração */}
//         <div className="w-1/2 bg-blue-500 flex flex-col items-center justify-center p-6">
//           <h1 className="text-4xl text-white font-bold mb-6 text-center">
//             Road To Dev
//           </h1>
//           <Image
//             src="roadmap_img.svg"
//             alt="Illustration"
//             width={256}
//             height={256}
//             className="rounded-lg"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUpPage;
