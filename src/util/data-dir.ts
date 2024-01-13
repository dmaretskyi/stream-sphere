import { mkdir } from "fs/promises"

export const getDataDir = async () => {
  const dataDir = process.env.STSP_DATA_DIR
  if (!dataDir) throw new Error('STSP_DATA_DIR not set')
  await mkdir(dataDir, { recursive: true })
  return dataDir
}