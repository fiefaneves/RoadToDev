import { useState, useEffect } from "react";

interface Roadmap {
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
        const response = await fetch(`http://localhost:3005/user/${userId}/roadmaps`, {
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
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchRoadmaps();
    }
  }, [userId]);

  return { roadmaps, loading, error };
};

export default useFetchRoadmaps;