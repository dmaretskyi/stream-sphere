import { createDb } from "@/db/createDb"
import { join } from "path"

const dbPromise = createDb(join(process.env.HOME!, '.stsp'))

export const getDb = async () => dbPromise
