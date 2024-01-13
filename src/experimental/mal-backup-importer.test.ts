import { createTempDb } from "../util/testing";
import { exec, spawn } from "child_process";
import { mkdtemp } from "fs/promises";
import {test} from "vitest";
import { Database } from "sqlite";

export const importBackup = async (db: Database) => {
  const dir = await mkdtemp('/tmp/stream-sphere-mal-import',)
  console.log(dir)
  const process = await spawn(`git clone https://github.com/bal-mackup/mal-backup ${dir}`, { shell: true, stdio: 'inherit' })
  await new Promise((resolve, reject) => {
    process.on('exit', resolve)
    process.on('error', reject)
  });
}

test('mal import', async () => {
  const db = await createTempDb();
  await importBackup(db);
}, 120_000)