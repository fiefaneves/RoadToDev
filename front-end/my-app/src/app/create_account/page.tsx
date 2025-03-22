"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  const {createAccount, loading} = useCreateAccount();

  const rules = [
    { regex: /.{8,}/, label: "Pelo menos 8 caracteres" },
    { regex: /[A-Z]/, label: "Pelo menos 1 letra maiúscula" },
    { regex: /[a-z]/, label: "Pelo menos 1 letra minúscula" },
    { regex: /\d/, label: "Pelo menos 1 número" },
    { regex: /[!@#$%^&*(),.?\":{}|<>]/, label: "Pelo menos 1 caractere especial" },
  ];

  const validateRule = (regex: RegExp) => regex.test(password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createAccount(formData);
  };

  return (
<div className="flex h-screen w-auto bg-gray-100 items-center justify-center">
      <div className="flex w-[900px] h-[500px] bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Esquerda - Formulário */}
        <div className="w-1/2 p-8 flex flex-col justify-center items-center bg-white shadow-md rounded-r-lg">
          <h2 className="text-2xl font-semibold text-blue-600 text-center mb-6">Crie sua conta!</h2>
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4">
              <input
                name="name"
                type="text"
                placeholder="Nome"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <input
                name="username"
                type="text"
                placeholder="Username"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
                onChange={handleChange}
                required
              />
            </div>
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
            <div className="mb-4">
              <input
                name="password"
                type="password"
                placeholder="Senha"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
                value={formData.password}
                onChange={(e) => {
                  handleChange(e);
                  setPassword(e.target.value);
                }}
                onFocus={() => setShowRules(true)}
                onBlur={() => setShowRules(false)}
                required
              />
              {showRules && (
                <div className="border rounded p-4 bg-white shadow-md w-full mt-2">
                  <p className="font-bold">Sua senha deve conter:</p>
                  <ul className="list-disc pl-5">
                    {rules.map((rule, index) => (
                      <li key={index} className={validateRule(rule.regex) ? "text-green-500" : "text-red-500"}>
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
                placeholder="Telefone"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 py-3 rounded-md font-semibold text-lg text-white shadow-lg transition-all hover:scale-[1.02] hover:from-blue-700 hover:to-blue-600 active:scale-95"
            >
              {loading ? "Criando..." : "Criar Conta"}
            </button>
            <p className="text-center text-sm mt-4">
              Já tem uma conta? <Link href="/" className="text-blue-500 font-bold hover:underline">Login</Link>
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

export default CreateAccount;