"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useForgotPassword from "@/hooks/useForgotPassword";

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
    <div className="flex h-screen w-screen bg-gray-100 items-center justify-center">
      <div className="flex w-[850px] h-[500px] bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Esquerda - Formulário */}
        <div className="w-1/2 p-8 flex flex-col justify-center items-center bg-white shadow-md rounded-r-lg">
          <h2 className="text-2xl font-semibold text-blue-600 text-center mb-6">Esqueceu sua senha?</h2>
          <p className="text-center text-gray-600 mb-4">
            Insira seu e-mail para receber um link de redefinição de senha.
          </p>
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
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 py-3 rounded-md font-semibold text-lg text-white shadow-lg transition-all hover:scale-[1.02] hover:from-blue-700 hover:to-blue-600 active:scale-95"
              disabled={loading} // Desabilita o botão durante o carregamento
              aria-label={loading ? "Enviando e-mail..." : "Enviar Link de Redefinição"}
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
                "Enviando..."
                </div>
              ) : (
                "Enviar Link de Redefinição"
              )}              
            </button>
            <p className="text-center text-sm mt-4">
              Lembrou sua senha? <Link href="/" className="text-blue-500 font-bold hover:underline">Login</Link>
            </p>
          </form>
        </div>

        {/* Direita - Ilustração */}
        <div className="w-1/2 bg-blue-500 flex flex-col items-center justify-center p-6">
          <h1 className="text-4xl text-white font-bold mb-6 text-center">Road To Dev</h1>
          <Image src="roadmap_img.svg" alt="Illustration" width={256} height={256} className="rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;