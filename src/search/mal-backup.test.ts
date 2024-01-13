import { test } from "vitest";
import { createTempDb } from "../util/testing";
import { importBackup, searchMalBackup } from "./mal-backup";
import { createDb } from "../db/createDb";
import { inspect } from "util";

test.skip('mal import', async () => {
  const db = await createTempDb();
  await importBackup(db);
}, 120_000)

test.only('search', async () => {
  const db = await createDb();
  const results = await searchMalBackup(db, 'eminence');
  console.log(inspect(results, { depth: null, colors: true }));
})