import { afterEach, describe, expect, it } from "vitest";
import { createDatabase, migrateDatabase } from "@/db/client";
import { dailyRuns } from "@/db/schema";
import { madridRunKey, runDailySync } from "@/domain/automation/daily";

describe("daily automation", () => {
  const clients: Array<{ close(): Promise<void> }> = [];
  afterEach(async () => Promise.all(clients.splice(0).map((client) => client.close())));

  it("uses the Madrid calendar day across DST", () => {
    expect(madridRunKey(new Date("2026-07-10T07:00:00Z"))).toBe("daily:2026-07-10");
    expect(madridRunKey(new Date("2026-12-10T08:00:00Z"))).toBe("daily:2026-12-10");
  });

  it("runs once per Madrid day and records the result", async () => {
    const database = createDatabase();
    clients.push(database.client);
    await migrateDatabase(database.client);
    const now = new Date("2026-11-18T08:00:00Z");

    const first = await runDailySync({ db: database.db, connectors: [], now, enforceMadridHour: true });
    const second = await runDailySync({ db: database.db, connectors: [], now, enforceMadridHour: true });

    expect(first.status).toBe("completed");
    expect(second.status).toBe("already_completed");
    expect(await database.db.select().from(dailyRuns)).toHaveLength(1);
  });

  it("skips a scheduled invocation outside 09:00 Madrid", async () => {
    const database = createDatabase();
    clients.push(database.client);
    await migrateDatabase(database.client);
    const result = await runDailySync({
      db: database.db,
      connectors: [],
      now: new Date("2026-11-18T07:00:00Z"),
      enforceMadridHour: true,
    });
    expect(result.status).toBe("outside_window");
    expect(await database.db.select().from(dailyRuns)).toHaveLength(0);
  });
});
