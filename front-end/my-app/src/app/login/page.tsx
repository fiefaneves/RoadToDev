"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../Components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const LoginPage = () => {
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: "",
            password: ""
        }
    });

    interface FormData {
        email: string;
        password: string;
    }

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:3005/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password
                })
            });

            if (!response.ok) {
                throw new Error("Failed to login");
            }

            const result = await response.json();

            if (result.status === 200) {
                localStorage.setItem("user", JSON.stringify(result.data));
                router.push("/roadmap");
            } else{
                alert("Invalid email or password");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred during login");
        } finally {
            setLoading(false);
        }
    };

    return (
<div className="flex h-screen w-screen bg-blue-50 items-center justify-center">
      <div className="flex w-[850px] h-[500px] bg-white rounded-lg shadow-lg overflow-hidden">  
        {/* Esquerda - Ilustração */}
        <div className="w-1/2 bg-gradient-to-br from-blue-400 to-blue-500 flex flex-col items-center justify-center p-6 rounded-l-lg">
          <h1 className="text-3xl text-white font-bold mb-6 text-center">Road To Dev</h1>
          <img
            src="roadmap_img.svg"
            alt="Illustration"
            className="rounded-lg w-56"
          />
        </div>

        {/* Direita - Formulário */}
        <div className="w-1/2 p-8 flex flex-col justify-center items-center bg-white shadow-md rounded-r-lg">
          <h2 className="text-2xl font-semibold text-blue-600 text-center mb-6">Faça seu login!</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="mb-4">
              <input
                {...register("email", { required: "Insira seu email!" })}
                type="email"
                placeholder="E-mail"
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
              />
              {errors.email && <p className="text-sm text-red-400 font-bold mt-1">{errors.email.message}</p>}
            </div>
            <div className="mb-4">
              <input
                {...register("password", { required: "Insira sua senha!" })}
                type="password"
                placeholder="Senha"
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
                />
              {errors.password && <p className="text-sm text-red-400 font-bold mt-1">{errors.password.message}</p>}
            </div>
            <div className="flex justify-between items-center text-sm mb-4">
              <div>
                <input type="checkbox" id="remember" className="mr-2" />
                <label htmlFor="remember">Lembre de mim</label>
              </div>
              <a href="/esqueci-senha" className="text-blue-500 hover:underline">Esqueceu a Senha?</a>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 py-3 rounded-md font-semibold text-lg text-white shadow-lg transition-all hover:scale-[1.02] hover:from-blue-700 hover:to-blue-600 active:scale-95"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
            <p className="text-center text-sm mt-4">Não tem uma conta? <a href="/create_account" className="text-blue-500 font-bold hover:underline">Cadastre-se</a></p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;