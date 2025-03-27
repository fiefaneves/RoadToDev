import { useState } from "react";

const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);

  const sendResetEmail = async (email: string) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3005/esqueci-senha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erro ao enviar e-mail de redefinição");
      }
      
      // alert("E-mail de redefinição enviado com sucesso!");
    } catch (error) {
      throw error;
      // if (error instanceof Error) {
      //   alert(error.message);
      // } else {
      //   alert("Um erro desconhecido ocorreu. Tente novamente.");
      // }
    } finally {
      setLoading(false);
    }
  };

  return { sendResetEmail, loading };
};

export default useForgotPassword;