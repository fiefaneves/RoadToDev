import { useState } from "react";
import { useRouter } from "next/navigation";

interface LoginFormData {
  email: string;
  password: string;
}

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async (loginFormData: LoginFormData) => {
    setLoading(true);

    try {
      console.log("Enviando dados para o servidor:");
      const response = await fetch("https://roadtodev-production.up.railway.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginFormData),
      });

      console.log("Resposta do servidor:", response);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro na resposta do servidor:", errorText);
        throw new Error("Erro ao fazer login");
      }

      const result = await response.json();
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.data));
      localStorage.setItem("userId", result.userId);
      router.push(`/intermediateScreen/${result.data._id}`);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Falha ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};

export default useLogin;