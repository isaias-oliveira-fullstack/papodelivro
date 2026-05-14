import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import type { Request } from 'express';

const storage = multer.diskStorage({
  destination: path.resolve(__dirname, '..', 'uploads'),
  filename: (req: Request, file: any, cb: (error: Error | null, filename: string) => void) => {
    const hash = crypto.randomBytes(6).toString('hex');
    const filename = `${hash}-${file.originalname}`;
    cb(null, filename);
  },
});

export default {
  storage,
};
