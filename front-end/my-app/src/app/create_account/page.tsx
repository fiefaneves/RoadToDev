"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/Components/ui/button";
import useCreateAccount from "@/hooks/useCreateAccount";

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    number: "",
  });
  const [password, setPassword] = useState("");
  const [showRules, setShowRules] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { createAccount, loading } = useCreateAccount();

  const rules = [
    { regex: /.{8,}/, label: "Pelo menos 8 caracteres" },
    { regex: /[A-Z]/, label: "Pelo menos 1 letra maiúscula" },
    { regex: /[a-z]/, label: "Pelo menos 1 letra minúscula" },
    { regex: /\d/, label: "Pelo menos 1 número" },
    { regex: /[!@#$%^&*(),.?\":{}|<>]/, label: "Pelo menos 1 caractere especial" },
  ];

  const validateRule = (regex: RegExp) => regex.test(password);

  const validateForm = () => {
    if (!rules.every(rule => validateRule(rule.regex))) {
      setError("A senha não atende a todos os requisitos.");
      return false;
    }

    if (!formData.number.trim()) {
      setError("Por favor, insira um número de telefone válido.");
      return false;
    }

    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
    if (successMessage) setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await createAccount(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccessMessage("Conta criada com sucesso!");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
    } catch (error) {
      setError("Ocorreu um erro ao criar a conta. Tente novamente.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-blue-700">Crie sua conta!</h2>
          <p className="text-gray-600 mt-1">Preencha os campos para se registrar</p>
        </div>

        {error && (
          <div className="w-full mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded-xl">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="w-full mb-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded-xl">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <input
              name="name"
              type="text"
              placeholder="Nome completo"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 transition-colors"
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="mb-4">
            <input
              name="username"
              type="text"
              placeholder="Nome de usuário"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 transition-colors"
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="mb-4">
            <input
              name="email"
              type="email"
              placeholder="E-mail"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 transition-colors"
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="mb-4 relative">
            <input
              name="password"
              type="password"
              placeholder="Senha"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 transition-colors"
              value={formData.password}
              onChange={(e) => {
                handleChange(e);
                setPassword(e.target.value);
              }}
              onFocus={() => setShowRules(true)}
              onBlur={() => setTimeout(() => setShowRules(false), 200)}
              required
              disabled={isSubmitting}
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
          
          <div className="mb-4">
            <input
              name="number"
              type="tel"
              placeholder="Telefone (com DDD)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 transition-colors"
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          
          <Button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 py-3 rounded-lg font-semibold text-lg text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] hover:from-purple-700 hover:to-blue-600 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading || isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Criando conta...
              </span>
            ) : "Criar Conta"}
          </Button>
          
          <p className="text-center text-sm text-gray-600 mt-4">
            Já tem uma conta? {' '}
            <Link href="/" className="text-purple-600 font-semibold hover:text-purple-800 hover:underline transition-colors">
              Faça login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;