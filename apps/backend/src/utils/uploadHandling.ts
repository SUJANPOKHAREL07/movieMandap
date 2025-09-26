import fs from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { TFile } from '../types/movie.types';

export async function uploadFile(file: TFile) {
  const { createReadStream, filename } = await file;
  const stream = createReadStream();

  const uniqueName = `${uuid()}-${filename}`;
  const uploadDir = path.join(__dirname, '../uploads');
  const filePath = path.join(uploadDir, uniqueName);

  // Ensure upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  // Save file
  await new Promise<void>((resolve, reject) => {
    const writeStream = fs.createWriteStream(filePath);
    stream.pipe(writeStream);
    writeStream.on('finish', () => resolve());
    writeStream.on('error', (err) => reject(err));
  });

  // Return path (you could return S3/Cloudinary URL instead)
  return `/uploads/${uniqueName}`;
}
