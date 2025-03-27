import { useState } from "react";

const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);

  const sendResetEmail = async (email: string) => {
    setLoading(true);
    try {
      const response = await fetch("https://roadtodev-production.up.railway.app/esqueci-senha", {
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
      
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { sendResetEmail, loading };
};

export default useForgotPassword;