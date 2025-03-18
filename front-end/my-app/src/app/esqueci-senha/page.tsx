"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useForgotPassword from "@/hooks/useForgotPassword";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { sendResetEmail, loading } = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sendResetEmail(email);
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
            >
              {loading ? "Enviando..." : "Enviar Link de Redefinição"}
            </button>
            <p className="text-center text-sm mt-4">
              Lembrou sua senha? <Link href="/login" className="text-blue-500 font-bold hover:underline">Login</Link>
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
