import { describe, expect, it } from "vitest";
import { loadSeedCatalog } from "@/domain/opportunities/seed-catalog";

describe("catálogo inicial de oportunidades", () => {
  it("carga exactamente 55 IDs únicos sin duplicar las hojas comunes", async () => {
    const records = await loadSeedCatalog();
    const ids = records.map((record) => record.externalId);

    expect(records).toHaveLength(55);
    expect(new Set(ids).size).toBe(55);
    expect(records.filter((record) => record.opportunityType === "sector")).toHaveLength(25);
    expect(records.filter((record) => record.opportunityType === "technology")).toHaveLength(30);
  });

  it("conserva legacy score y procedencia para cada oportunidad", async () => {
    const records = await loadSeedCatalog();

    expect(records.every((record) => record.legacyScore !== null)).toBe(true);
    expect(records.every((record) => record.sourceSheet && record.sourceRow > 0)).toBe(true);
    expect(records.every((record) => record.claimType === "hypothesis")).toBe(true);
  });
});

