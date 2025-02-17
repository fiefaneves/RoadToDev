import { describe, expect, it } from "vitest";
import { formatDate } from "../utils/formatDate";

describe("formatDate", () => {
  it("deve formatar a data corretamente", () => {
    const result = formatDate("2024-02-16");
    expect(result).toBe("16/02/2024");
  });

  it("deve lidar com datas inválidas", () => {
    const result = formatDate("data-invalida");
    expect(result).toBe("Invalid Date");
  });
});
