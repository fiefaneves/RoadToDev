"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/Components/ui/button";
import { useRouter } from "next/navigation";

const SignUpPage = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues:{
        name: "",
        interest: "",
        experience: "",
        technology: "",
    },
  });

  const onSubmit = async (data: any) => {
    const queryDescription = `${data.name} quer aprender ${data.technology} na área de ${data.interest} com experiência ${data.experience}`;
    
    console.log("Query description:", queryDescription);

    try {
      const response = await fetch("http://localhost:3005/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify({ queryDescription }), 
      });

      if (!response.ok) {
        throw new Error("Failed to generate roadmap");
      }

      const result = await response.json();
      console.log("Generated roadmap:", result);

      alert("Roadmap generated successfully");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while generating the roadmap");
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
              <option value="design">Design</option>
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
            </select>
            {errors.technology && (
              <p className="text-sm text-red-500 mt-1">{errors.technology.message}</p>
            )}
          </div>

          <div>
            <Button type="submit" className="w-full bg-black text-white">
              Sign up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
