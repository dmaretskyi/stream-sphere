import { createDb } from '@/db/createDb';
import { importBackup } from '@/search/mal-backup';
import { getDataDir } from '@/util/data-dir';
import { rm } from 'fs/promises';
import sql from 'sql-template-strings';

const RESET = true;
const IMPORT = true;

(async () => {
  if (RESET) {
    const dataDir = await getDataDir();
    console.log(`Clearing ${dataDir}`);
    await rm(dataDir, { recursive: true, force: true });
  }

  const db = await createDb();

  if (IMPORT) {
    await importBackup(db);
  }

  const entry = await db.all(
    sql`SELECT * FROM mal_backup WHERE data MATCH 'Naruto'`
  );
  console.log(entry);
})();
