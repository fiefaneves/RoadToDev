import { useState } from "react";

interface FormData {
  name: string;
  username: string;
  email: string;
  password: string;
  number: string;
}

interface ApiResponse {
  success: boolean;
  error?: string;
  message?: string;
}

const useCreateAccount = () => {
  const [loading, setLoading] = useState(false);

  const createAccount = async (formData: FormData): Promise<ApiResponse> => {
    setLoading(true);

    try {
      console.log("Enviando dados para o servidor:");
      const response = await fetch("http://localhost:3005/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      console.log("Resposta do servidor:", response);
      
      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.message || "Erro ao criar conta" };
      }
      return { success: true, message: "Conta criada com sucesso!" };
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      return { success: false, error: "Erro ao criar conta. Tente novamente." };
    } finally {
      setLoading(false);
    }
  };

  return { createAccount, loading };
};

export default useCreateAccount;