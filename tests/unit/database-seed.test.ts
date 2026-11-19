import { afterEach, describe, expect, it } from "vitest";
import { createDatabase, migrateDatabase } from "@/db/client";
import { listOpportunities, seedCatalog } from "@/domain/opportunities/repository";

describe("persistencia del catálogo", () => {
  const clients: Array<{ close(): Promise<void> }> = [];

  afterEach(async () => {
    await Promise.all(clients.splice(0).map((client) => client.close()));
  });

  it("aplica migraciones y siembra 55 oportunidades de forma idempotente", async () => {
    const database = createDatabase();
    clients.push(database.client);
    await migrateDatabase(database.client);

    const first = await seedCatalog(database.db);
    const second = await seedCatalog(database.db);
    const opportunities = await listOpportunities(database.db);

    expect(first).toEqual({ inserted: 55, existing: 0 });
    expect(second).toEqual({ inserted: 0, existing: 55 });
    expect(opportunities).toHaveLength(55);
    expect(new Set(opportunities.map((item) => item.externalId)).size).toBe(55);
  });
});

