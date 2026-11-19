import { afterEach, describe, expect, it } from "vitest";
import { createDatabase, migrateDatabase } from "@/db/client";
import { companies, sectorDefinitions } from "@/db/schema";
import { seedReferenceCatalog } from "@/domain/reference/repository";

describe("reference catalog seed", () => {
  const clients: Array<{ close(): Promise<void> }> = [];
  afterEach(async () => Promise.all(clients.splice(0).map((client) => client.close())));

  it("loads six scopes including non-comparable technology and 43 company references idempotently", async () => {
    const database = createDatabase();
    clients.push(database.client);
    await migrateDatabase(database.client);

    const first = await seedReferenceCatalog(database.db);
    const second = await seedReferenceCatalog(database.db);

    expect(first).toEqual({ sectorsInserted: 6, companiesInserted: 43 });
    expect(second).toEqual({ sectorsInserted: 0, companiesInserted: 0 });
    const sectors = await database.db.select().from(sectorDefinitions);
    expect(sectors).toHaveLength(6);
    expect(sectors.find((sector) => sector.name === "Tecnología")).toMatchObject({
      sectorTaxonomy: "technology_lines",
      methodology: expect.stringContaining("not comparable"),
    });
    expect(await database.db.select().from(companies)).toHaveLength(43);
  });
});
