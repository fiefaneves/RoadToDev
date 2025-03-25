"use client";

import React, { useState } from "react";
import { Button } from "@/Components/ui/button";
import Image from "next/image";
import Link from "next/link";
import useResetPassword from "@/hooks/useResetPassword";

const ResetPassword = ({ params }: { params: Promise<{ token: string }> }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showRules, setShowRules] = useState(false);
  const [error, setError] = useState<string | null>(null); 
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { resetPassword, loading } = useResetPassword();

  const resolveParams = React.use(params);
  const token = resolveParams.token;

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
    setError(null);
    setSuccessMessage(null);
        
    const isPasswordValid = rules.every((rule) => validateRule(rule.regex));
    if (!isPasswordValid) {
      setError("A senha não atende a todos os requisitos.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      await resetPassword(token, newPassword);
      setSuccessMessage("Senha redefinida com sucesso!");
    } catch (error) {
      setError("Erro ao redefinir senha. Tente novamente.");
      throw error;
    }
  };

  return (
    <div className="flex h-screen w-auto bg-gray-100 items-center justify-center overflow-x-hidden p-4">
      <div className="flex max-w-[90%] w-full md:w-[900px] h-[500px] bg-white rounded-xl shadow-xl overflow-hidden mx-4">
        {/* Left - Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center bg-white shadow-md rounded-l-xl relative">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-blue-700">Redefinir Senha</h2>
            <p className="text-gray-600 mt-1">Insira sua nova senha abaixo</p>
          </div>

          {error && (
            <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="w-full mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
              {successMessage}
            </div>
          )}

<form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4 relative">
              <input
                type="password"
                placeholder="Nova Senha"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 transition-colors"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onFocus={() => setShowRules(true)}
                onBlur={() => setTimeout(() => setShowRules(false), 200)}
                required
                disabled={loading}
              />
              {showRules && (
                <div className="absolute z-20 w-full top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 animate-fade-in">
                  <div className="absolute -top-2 left-6 w-4 h-4 bg-white transform -rotate-45 border-t border-l border-gray-200"></div>
                  <ul className="space-y-2">
                    {rules.map((rule, index) => (
                      <li 
                        key={index} 
                        className={`flex items-center text-sm ${validateRule(rule.regex) ? 'text-green-600' : 'text-red-500'}`}
                      >
                        <span className="mr-2">
                          {validateRule(rule.regex) ? '✓' : '✗'}
                        </span>
                        {rule.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="mb-4 relative">
              <input
                type="password"
                placeholder="Confirmar Nova Senha"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 transition-colors"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
              {confirmPassword && (
                <span className="absolute right-3 top-3">
                  {newPassword === confirmPassword ? (
                    <span className="text-green-500">✓</span>
                  ) : (
                    <span className="text-red-500">✗</span>
                  )}
                </span>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-500 py-3 rounded-lg font-semibold text-lg text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] hover:from-purple-700 hover:to-blue-600 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={loading}
              aria-label="Redefinir senha"
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
                  Redefinindo...
                </span>
              ) : (
                "Redefinir Senha"
              )}
            </Button>
            
            <p className="text-center text-sm mt-6 text-gray-600">
              <Link 
                href="/" 
                className="text-purple-600 font-semibold hover:text-purple-800 hover:underline transition-colors"
                aria-label="Voltar para o login"
              >
                Voltar para o Login
              </Link>
            </p>
          </form>
        </div>

        {/* Right - Illustration (hidden on small screens) */}
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

export default ResetPassword;