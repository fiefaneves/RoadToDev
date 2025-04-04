import { useState, useEffect } from "react";

interface Roadmap {
  _id: string;
  title: string;
  progress: number;
}

interface UserData{
  _id: string;
  name: string;
  email: string;
  progress: number;
  interests: string;
  roadmaps: Roadmap[];
}

const useFetchUserData = (userId: string) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setError("Usuário não autenticado");
          setLoading(false);
          return;
        }
        const response = await fetch(`https://roadtodev-production.up.railway.app/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error("Erro ao buscar dados do usuário");
        }
        const data: UserData = await response.json();
        setUserData(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Ocorreu um erro desconhecido.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  return { userData, loading, error };
};

export default useFetchUserData;