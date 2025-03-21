"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useLogin from '@/hooks/useLogin';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const PageLogin = () => {
  const [loginFormData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useLogin();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(loginFormData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100 items-center justify-center">
      <div className="flex w-[900px] h-[500px] bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Esquerda - Ilustração */}
        <div className="w-1/2 bg-blue-500 flex flex-col items-center justify-center p-6">
          <h1 className="text-4xl text-white font-bold mb-6 text-center">Road To Dev</h1>
          <Image src="/roadmap_img.svg" alt="Illustration" width={256} height={256} className="rounded-lg" />
        </div>

        {/* Direita - Formulário */}
        <div className="w-1/2 p-8 flex flex-col justify-center items-center bg-white shadow-md rounded-r-lg">
          <h2 className="text-2xl font-semibold text-blue-600 text-center mb-6">Faça seu login!</h2>
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4">
              <input
                name="email"
                type="email"
                placeholder="E-mail"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4 relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
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
            <p className="text-center text-sm mt-4">
              Não tem uma conta? <Link href="/create_account" className="text-blue-500 font-bold hover:underline">Cadastre-se</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PageLogin;