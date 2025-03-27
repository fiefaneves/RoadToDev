"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "../Components/ui/button";
import useLogin from '@/hooks/useLogin';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const PageLogin = () => {
  const [loginFormData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, loading } = useLogin();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(loginFormData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex h-screen w-auto bg-gray-100 items-center justify-center overflow-x-hidden p-4">
      <div className="flex max-w-[90%] w-full md:w-[900px] h-[500px] bg-white rounded-xl shadow-xl overflow-hidden mx-4">
        {/* Esquerda - Ilustração */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-b from-purple-600 to-blue-500 flex-col items-center justify-center p-8">
          <h1 className="text-3xl md:text-4xl text-white font-bold mb-6 text-center drop-shadow-md">Road To Dev</h1>
          <Image 
            src="/roadmap_img.svg" 
            alt="Illustration" 
            width={256} 
            height={256} 
            className="rounded-lg max-w-full h-aut drop-shadow-md"
          />
        </div>

        {/* Direita - Formulário */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center bg-white shadow-md rounded-r-xl">  
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-blue-700">Faça seu login!</h2>
          <p className="text-gray-600 mt-1">Acesse sua conta para continuar</p>
        </div>
          <form onSubmit={handleSubmit} className="w-full">
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
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 transition-colors"
                onChange={handleChange}
                required
                disabled={isSubmitting}
                />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-purple-600 transition-colors"
                disabled={isSubmitting}
                >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            <div className="flex justify-between items-center text-sm mb-6">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="remember" 
                  className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  disabled={isSubmitting}
                  />
                <label htmlFor="remember" className="text-gray-600">Lembre de mim</label>
              </div>
              <Link 
                href="/esqueci-senha" 
                className="text-purple-600 hover:text-purple-800 hover:underline transition-colors"
                >
                  Esqueceu a Senha?
              </Link>
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
                  Entrando...
                </span>
              ) : "Entrar"}
            </Button>
            <p className="text-center text-sm mt-6 text-gray-600">
              Não tem uma conta? {" "}
              <Link 
                href="/create_account" 
                className="text-purple-600 font-semibold hover:text-purple-800 hover:underline transition-colors"
                >
                  Cadastre-se
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PageLogin;