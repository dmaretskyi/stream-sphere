import { test } from "vitest";
import { createTempDb } from "../util/testing";
import { importBackup } from "./mal-backup";

test.skip('mal import', async () => {
  const db = await createTempDb();
  await importBackup(db);
}, 120_000)