"use client";

import React, { useState } from "react";
import { Button } from "@/Components/ui/button";
import Image from "next/image";
import Link from "next/link";
import useResetPassword from "@/hooks/useResetPassword";

const ResetPassword = ({ params }: { params: { token: string } }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showRules, setShowRules] = useState(false);
  const [error, setError] = useState<string | null>(null); 
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { resetPassword, loading } = useResetPassword();

  const rules = [
    { regex: /.{8,}/, label: "Pelo menos 8 caracteres" },
    { regex: /[A-Z]/, label: "Pelo menos 1 letra maiúscula" },
    { regex: /[a-z]/, label: "Pelo menos 1 letra minúscula" },
    { regex: /\d/, label: "Pelo menos 1 número" },
    { regex: /[!@#$%^&*(),.?":{}|<>]/, label: "Pelo menos 1 caractere especial" },
  ];

  const validateRule = (regex: RegExp) => regex.test(newPassword);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isPasswordValid = rules.every((rule) => validateRule(rule.regex));
    if (!isPasswordValid) {
      setError("A senha não atende a todos os requisitos.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setError(null);
    setSuccessMessage(null);

    try {
      await resetPassword(params.token, newPassword);
      setSuccessMessage("Senha redefinida com sucesso!");
    } catch (error) {
      setError("Erro ao redefinir senha. Tente novamente.");
      throw error;
      
      // if (error instanceof Error) {
      //   setError(error.message); // Exibe a mensagem de erro específica
      // } else {
      //   setError("Erro ao redefinir senha. Tente novamente.");
      // }
    }
  };

  return (
    <div className="font-sans flex h-screen w-screen bg-gray-100 items-center justify-center p-4">
      <div className="flex w-full max-w-[850px] h-[500px] bg-white rounded-lg shadow-lg overflow-hidden flex-col md:flex-row">
        {/* Esquerda - Formulário */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center bg-white shadow-md rounded-r-lg">
          <h2 className="text-2xl font-semibold text-blue-800 text-center mb-6">Redefinir Senha</h2>
          <p className="text-center text-gray-600 mb-4">
            Insira sua nova senha abaixo.
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
            <div className="mb-4 relative">
              <input
                type="password"
                placeholder="Nova Senha"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onFocus={() => setShowRules(true)}
                onBlur={() => setShowRules(false)}
                required
              />
              {showRules && (
                <div className="absolute z-10 mt-2 w-full p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <p className="font-bold mb-2">Sua senha deve conter:</p>
                  <ul className="list-disc pl-5">
                    {rules.map((rule, index) => (
                      <li
                        key={index}
                        className={validateRule(rule.regex) ? "text-green-500" : "text-red-500"}
                      >
                        {rule.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="mb-4 relative"> {/* Adicionado relative aqui */}
              <input
                type="password"
                placeholder="Confirmar Nova Senha"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {confirmPassword && (
                <span className="absolute right-3 top-3">
                  {newPassword === confirmPassword ? (
                    <span className="text-green-500">✔️</span>
                  ) : (
                    <span className="text-red-500">❌</span>
                  )}
                </span>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-500 py-3 rounded-md font-semibold text-lg text-white shadow-lg transition-all hover:scale-[1.02] hover:from-purple-700 hover:to-blue-600 active:scale-95"
              disabled={loading}
              aria-label="Redefinir senha"
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
                  Redefinindo...
                </div>
              ) : (
                "Redefinir Senha"
              )}
            </Button>
            <p className="text-center text-sm mt-4" aria-label="Voltar para o login">
              <Link href="/login" className="text-blue-500 font-bold hover:underline">Voltar para o Login</Link>
            </p>
          </form>
        </div>

        {/* Direita - Ilustração (oculta em telas pequenas) */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-b from-purple-600 to-blue-500 flex-col items-center justify-center p-6">
          <h1 className="text-4xl text-white font-bold mb-6 text-center">Road To Dev</h1>
          <Image src="/roadmap_img.svg" alt="Illustration" width={256} height={256} className="rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;