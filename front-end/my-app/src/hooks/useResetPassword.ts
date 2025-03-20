import { useState } from "react";

const useResetPassword = () => {
  const [loading, setLoading] = useState(false);

  const resetPassword = async (token: string, newPassword: string) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3005/mudar-senha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erro ao redefinir senha");
      }

      alert("Senha redefinida com sucesso!");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Um erro desconhecido ocorreu. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, loading };
};

export default useResetPassword;