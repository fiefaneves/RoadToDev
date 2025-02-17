import { vi, describe, it, expect, MockedFunction } from "vitest";

global.fetch = vi.fn();

// Mock de resposta da API
const mockSuccessResponse = {
  roadmap: ["Passo 1: Configurar ambiente", "Passo 2: Criar projeto"],
};

async function fetchRoadmap(queryDescription: string) {
  try {
    const response = await fetch("http://localhost:3005/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ queryDescription }),
    });

    return await response.json();
  } catch {
    throw new Error("Erro ao buscar roadmap");
  }
}

describe("fetchRoadmap", () => {
  it("deve retornar um roadmap formatado corretamente", async () => {
    (global.fetch as MockedFunction<typeof fetch>).mockResolvedValue({
      json: () => Promise.resolve(mockSuccessResponse),
    } as Response);

    const result = await fetchRoadmap("Quero aprender React");

    expect(result).toEqual(mockSuccessResponse);
  });

  it("deve lidar com erros de rede", async () => {
    (global.fetch as MockedFunction<typeof fetch>).mockRejectedValue(new Error("API offline"));

    await expect(fetchRoadmap("Teste")).rejects.toThrow("Erro ao buscar roadmap");
  });
});
