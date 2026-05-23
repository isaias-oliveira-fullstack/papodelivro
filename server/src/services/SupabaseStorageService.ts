import { supabase } from '../config/supabase';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import multerConfig from '../config/multer';

const BUCKET_NAME = 'book-covers';

export class SupabaseStorageService {
  /**
   * Upload a file to Supabase Storage
   * Returns the public URL or storage path for database storage
   */
  static async uploadFile(file: Express.Multer.File): Promise<string> {
    if (!supabase) {
      throw new Error('Supabase não está configurado (variáveis de ambiente faltando). Usando fallback local.');
    }

    try {
      const hash = crypto.randomBytes(6).toString('hex');
      const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filename = `${hash}-${safeName}`;
      let fileData: Buffer | undefined = file.buffer;

      if (!fileData && file.path) {
        const diskPath = path.isAbsolute(file.path) ? file.path : path.join(multerConfig.uploadDir, file.path);
        fileData = fs.readFileSync(diskPath);
      }

      if (!fileData) {
        throw new Error('Arquivo inválido: buffer não disponível.');
      }

      if (fileData.length === 0) {
        throw new Error('Arquivo inválido: o buffer do arquivo está vazio.');
      }

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filename, fileData, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) {
        console.error('Supabase upload error:', error);
        throw new Error(`Supabase storage error: ${error.message}`);
      }

      console.log(`✅ Successfully uploaded ${filename} to Supabase Storage bucket: ${BUCKET_NAME}`);
      return filename;
    } catch (error) {
      console.error('Error uploading file to Supabase:', error);
      throw error;
    }
  }

  /**
   * Delete a file from Supabase Storage
   */
  static async deleteFile(filename: string): Promise<void> {
    if (!supabase) {
      console.warn('Supabase não configurado. Não foi possível deletar arquivo.');
      return;
    }

    try {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([filename]);

      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error deleting file from Supabase:', error);
      // Don't throw - deletion failure shouldn't break the flow
    }
  }

  /**
   * Get the public URL for a file in Supabase Storage
   */
  static normalizeStorageFilename(pathValue: string): string {
    if (!pathValue) return '';
    const normalized = pathValue.trim();

    // Already a Supabase storage public URL
    if (/https?:\/\/[^\/]+\.supabase\.co\/storage\/v1\/object\/public\//i.test(normalized)) {
      return normalized;
    }

    // If the value is a backend file URL from /files/, extract the file name
    const fileNameMatch = normalized.match(/([^\/\\?#]+)(?:[?#].*)?$/);
    if (fileNameMatch) {
      return fileNameMatch[1];
    }

    return normalized;
  }

  static getPublicUrl(filename: string): string {
    if (!supabase) {
      // Fallback: return as if it's a local file
      return `/files/${filename}`;
    }

    if (!filename) return '';

    const normalized = SupabaseStorageService.normalizeStorageFilename(filename);

    if (/^https?:\/\//i.test(normalized)) {
      return normalized;
    }

    try {
      // SDK may return { data: { publicUrl } } synchronously
      const result: any = supabase.storage.from(BUCKET_NAME).getPublicUrl(normalized);
      let publicUrl: string = result?.data?.publicUrl || '';

      if (!publicUrl) {
        // Fallback: construct public URL from SUPABASE_URL if available
        const rawUrl = process.env.SUPABASE_URL || '';
        if (rawUrl) {
          const base = rawUrl.replace(/^https?:\/\/db\./i, 'https://').replace(/\/+$/g, '');
          publicUrl = `${base}/storage/v1/object/public/${BUCKET_NAME}/${encodeURIComponent(normalized)}`;
          console.warn('[Supabase] Usando fallback manual para URL pública:', publicUrl);
        }
      }

      if (publicUrl && publicUrl.includes('://db.')) {
        publicUrl = publicUrl.replace('://db.', '://');
        console.warn('[Supabase] Corrigindo URL pública com prefixo db.:', publicUrl);
      }

      return publicUrl;
    } catch (err) {
      console.warn('[Supabase] Erro ao obter getPublicUrl para', normalized, err instanceof Error ? err.message : err);
      // As a last resort, return backend /files path so old uploads remain accessible
      return `/files/${normalized}`;
    }
  }
}
