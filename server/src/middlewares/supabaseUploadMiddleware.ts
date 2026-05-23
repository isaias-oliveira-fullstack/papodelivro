import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  userId?: number;
  file?: Express.Multer.File;
}

/**
 * Middleware that intercepts multer uploads and pushes them to Supabase Storage.
 * Keeps the file in memory and modifies req.file.filename to the Supabase path.
 * If Supabase fails, allows the request to continue with local storage fallback.
 */
export async function supabaseUploadMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.file) {
      try {
        // Lazy load to avoid initialization issues
        const { SupabaseStorageService } = require('../services/SupabaseStorageService');
        
        // Try to upload to Supabase Storage
        const remoteFilename = await SupabaseStorageService.uploadFile(req.file);
        
        // Update the filename so downstream code uses the Supabase path
        req.file.filename = remoteFilename;
        
        console.log(`✅ File uploaded to Supabase: ${remoteFilename}`);
      } catch (supabaseError) {
        // If Supabase fails, log warning but allow local fallback
        console.warn('⚠️ Supabase upload failed, falling back to local storage:', supabaseError);
        // req.file.filename remains as multer set it (local path)
      }
    }
    next();
  } catch (error) {
    console.error('Supabase upload middleware error:', error);
    // Don't block the request - let it proceed with local fallback if Supabase fails
    next();
  }
}
