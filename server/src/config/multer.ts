import fs from 'fs';
import os from 'os';
import path from 'path';
import multer from 'multer';

const defaultUploadDir = path.resolve(process.cwd(), 'uploads');
const serverlessTempDir = path.join(os.tmpdir(), 'uploads');

function ensureDirectory(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function resolveUploadDirectory() {
  const candidateDirs = [defaultUploadDir, serverlessTempDir];

  for (const dir of candidateDirs) {
    try {
      ensureDirectory(dir);
      fs.accessSync(dir, fs.constants.W_OK);
      return dir;
    } catch {
      continue;
    }
  }

  throw new Error('Nenhum diretório de upload gravável disponível.');
}

const uploadDir = resolveUploadDirectory();

const storage = multer.memoryStorage();

export default {
  storage,
  uploadDir,
};
