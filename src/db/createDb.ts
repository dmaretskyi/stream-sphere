import { getDataDir } from '../util/data-dir';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

export const createDb = async (dataDir?: string) => {
  dataDir ??= await getDataDir();
  const dbPath = join(dataDir, 'db.sqlite');
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
  return db;
};
