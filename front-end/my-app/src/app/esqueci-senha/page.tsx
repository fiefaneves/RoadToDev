"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useForgotPassword from "@/hooks/useForgotPassword";
import { Button } from "../../Components/ui/button";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { sendResetEmail, loading } = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email || !email.includes("@")) {
      setError("Por favor, insira um e-mail válido.");
      return;
    }

    try {
      await sendResetEmail(email);
      setSuccessMessage("E-mail de redefinição enviado com sucesso! Verifique sua caixa de entrada.");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Um erro desconhecido ocorreu. Tente novamente.");
      }
    }
  };

  return (
    <div className="flex h-screen w-auto bg-gray-100 items-center justify-center overflow-x-hidden p-4">
      <div className="flex max-w-[90%] w-full md:w-[900px] h-[500px] bg-white rounded-xl shadow-xl overflow-hidden mx-4">
        {/* Esquerda - Formulário */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center bg-white shadow-md rounded-l-xl">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-blue-700">Esqueceu sua senha?</h2>
            <p className="text-gray-600 mt-1">
              Insira seu e-mail para receber um link de redefinição
            </p>
          </div>

          {error && (
            <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="w-full mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4">
              <input
                type="email"
                placeholder="E-mail"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-500 py-3 rounded-lg font-semibold text-lg text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] hover:from-purple-700 hover:to-blue-600 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={loading} 
              aria-label={loading ? "Enviando e-mail..." : "Enviar Link de Redefinição"}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                  Enviando...
                </span>
              ) : (
                "Enviar Link de Redefinição"
              )}   
            </Button>
            <p className="text-center text-sm mt-6 text-gray-600">
              Lembrou sua senha? <Link href="/" className="text-purple-600 font-semibold hover:text-purple-800 hover:underline transition-colors">Login</Link>
            </p>
          </form>
        </div>

        {/* Direita - Ilustração (oculta em telas pequenas) */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-b from-purple-600 to-blue-500 flex-col items-center justify-center p-8">
          <h1 className="text-3xl md:text-4xl text-white font-bold mb-6 text-center drop-shadow-md">Road To Dev</h1>
          <Image 
            src="/roadmap_img.svg" 
            alt="Illustration" 
            width={256} 
            height={256} 
            className="rounded-lg max-w-full h-auto drop-shadow-md"
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;