import { afterEach, describe, expect, it } from "vitest";
import { createDatabase, migrateDatabase } from "@/db/client";
import { dataSources, sourceRuns, trendObservations } from "@/db/schema";
import { persistConnectorResult } from "@/domain/connectors/repository";
import { createIneConnector } from "@/domain/connectors/ine";
import { createGitHubConnector } from "@/domain/connectors/github";

describe("connector persistence", () => {
  const clients: Array<{ close(): Promise<void> }> = [];

  afterEach(async () => {
    await Promise.all(clients.splice(0).map((client) => client.close()));
  });

  it("persists source metadata and de-duplicates identical observations", async () => {
    const database = createDatabase();
    clients.push(database.client);
    await migrateDatabase(database.client);
    const connector = createIneConnector({
      fetchJson: async () => ({
        fetchedAt: new Date("2026-11-18T08:00:00Z"),
        payload: {
          COD: "IPC251856",
          Data: [
            { Fecha: "2026-09-01T00:00:00.000+02:00", T3_TipoDato: "Definitivo", Valor: 2.4 },
            { Fecha: "2026-10-01T00:00:00.000+02:00", T3_TipoDato: "Provisional", Valor: 2.1 },
          ],
        },
      }),
    });
    const result = await connector.fetch();

    const first = await persistConnectorResult(database.db, result, "test-run-1");
    const samePeriodRefetch = {
      ...result,
      observations: result.observations.map((observation) => ({
        ...observation,
        fetchedAt: new Date("2026-11-18T09:00:00Z"),
      })),
    };
    const second = await persistConnectorResult(database.db, samePeriodRefetch, "test-run-2");

    expect(first).toMatchObject({ fetched: 2, inserted: 2 });
    expect(second).toMatchObject({ fetched: 2, inserted: 0 });
    expect(await database.db.select().from(dataSources)).toHaveLength(1);
    expect(await database.db.select().from(trendObservations)).toHaveLength(2);
    expect(await database.db.select().from(sourceRuns)).toHaveLength(2);

    const response = { total_count: 50, incomplete_results: false, items: [] };
    const morning = createGitHubConnector({
      fetchJson: async () => ({ payload: response, fetchedAt: new Date("2026-11-18T08:00:00Z") }),
    });
    const evening = createGitHubConnector({
      fetchJson: async () => ({ payload: response, fetchedAt: new Date("2026-11-18T18:00:00Z") }),
    });

    const githubFirst = await persistConnectorResult(database.db, await morning.fetch());
    const githubSecond = await persistConnectorResult(database.db, await evening.fetch());

    expect(githubFirst.inserted).toBe(1);
    expect(githubSecond.inserted).toBe(0);
  });
});
