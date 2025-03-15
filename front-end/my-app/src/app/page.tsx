"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useLogin from '@/hooks/useLogin';

const PageLogin = () => {
  const [loginFormData, setFormData] = useState({
    email: "",
    password: ""
  });
  const { login, loading } = useLogin();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    login(loginFormData);
  }

  return (
    <div className="h-screen w-full flex overflow-hidden">
      {/* Left Side with Image */}
      <div className="w-full md:w-1/2 bg-blue-500 flex flex-col items-center justify-center">
        {/* Title */}
        <div className="flex justify-center items-center w-full mt-[-50px]">
          <h1 className="text-neutral-700 text-[53px] text-center">Road To Dev</h1>
        </div>

        {/* Image */}
        <div className="mt-6 md:mt-0">
          <Image
            src="roadmap_img.svg"
            alt="Description of image"
            width={320}
            height={1}
            className="rounded-lg mr-[58px] ml-[58px] mb-auto"
          />
        </div>
      </div>

      {/* Right Side with Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
      <form className="w-96 shadow-lg p-8 bg-white rounded-lg" onSubmit={handleSubmit}>
          <h2 className="text-center text-xl font-bold mb-4">LOGIN</h2>
          <div className="mb-4">
            {/* Input fields */}
            <input
              name="email"
              placeholder="Email"
              type="email"
              className="w-full p-2 border rounded mb-3"
              onChange={handleChange}
              required
            />
            <input
              name="password"
              placeholder="Password"
              type="password"
              className="w-full p-2 border rounded mb-3"
              onChange={handleChange}
              required
            />
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Remember me
              </label>
              <a href="#" className="text-blue-500">Esqueceu a Senha?</a>
            </div>
          </div>
          {/* Button */}
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded mb-4">
            {loading ? "Entrando..." : "Entrar"}
          </button>
          <div className="text-center text-sm">
            Não tem uma conta? <Link href="/create_account" className="text-blue-500">Inscrever-se</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PageLogin;