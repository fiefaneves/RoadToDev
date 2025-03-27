import { useState, useEffect } from "react";

interface Roadmap {
  name: string;
  _id: string;
  title: string;
  progress: number;
}

const useFetchRoadmaps = (userId: string) => {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://roadtodev-production.up.railway.app/user/${userId}/roadmaps`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error("Erro ao buscar roadmaps");
        }
        const data = await response.json();
        setRoadmaps(data.roadmaps);
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
      fetchRoadmaps();
    }
  }, [userId]);

  return { roadmaps, loading, error, setRoadmaps };
};

export default useFetchRoadmaps;