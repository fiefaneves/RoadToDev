import { useState } from "react";
import { useRouter } from "next/navigation";

interface FormData {
  name: string;
  username: string;
  email: string;
  password: string;
  phone: string;
}

const useCreateAccount = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const createAccount = async (formData: FormData) => {
    setLoading(true);

    try {
      console.log("Enviando dados para o servidor:", formData);
      const response = await fetch("http://localhost:3005/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      console.log("Resposta do servidor:", response);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro na resposta do servidor:", errorText);
        throw new Error("Erro ao criar conta");
      }

      alert("Conta criada com sucesso!");
      router.push("/");
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      alert("Falha ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return { createAccount, loading };
};

export default useCreateAccount;