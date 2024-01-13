import { createTempDb } from "../util/testing";
import { exec, spawn } from "child_process";
import { mkdtemp, readFile, readdir } from "fs/promises";
import {test} from "vitest";
import { Database } from "sqlite";
import { basename, join } from "path";
import sql from "sql-template-strings";
import * as parallel from "async-parallel";

export const importBackup = async (db: Database) => {
  await db.exec(sql`CREATE VIRTUAL TABLE mal_backup USING FTS4(id, data)`);

  const dir = '/tmp/stream-sphere-mal-import9xHs3O' ?? await mkdtemp('/tmp/stream-sphere-mal-import')
  const process = await spawn(`git clone https://github.com/bal-mackup/mal-backup ${dir}`, { shell: true, stdio: 'inherit' })
  await new Promise((resolve, reject) => {
    process.on('exit', resolve)
    process.on('error', reject)
  });

  const importDir = async (subdir: string, keyprefix: string) => {
    console.log('Importing ' + subdir)
    const files = await readdir(join(dir, subdir))

    let done = 0
    await parallel.each(files, async file => {
      const data = JSON.parse(await readFile(join(dir, subdir, file), { encoding: 'utf-8' }))
      await db.run(sql`INSERT INTO mal_backup(id, data) VALUES(${keyprefix + file.slice(0, -'.json'.length)}, ${JSON.stringify(data)})`)
      done++
      if(done % 500 === 0) console.log(`${done}/${files.length}`)
    }, 20)    
  }

  await importDir('mal/anime', 'malbak:mal:')
  await importDir('anilist/anime', 'malbak:anilist:')
}