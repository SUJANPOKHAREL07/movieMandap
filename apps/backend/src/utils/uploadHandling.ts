import fs from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { TFile } from '../types/movie.types';

export async function uploadFile(file: TFile | undefined) {
  if (typeof file === 'undefined') {
    throw new Error('Type didnpt match');
  }
  const { createReadStream, filename } = await file;
  console.log('Inside the file upload');
  const stream = createReadStream();
  console.log('Stream in the file upload::', stream);

  const uniqueName = `${uuid()}-${filename}`;
  const uploadDir = path.join(`${process.cwd()}/apps/backend`, 'uploads');
  const filePath = path.join(uploadDir, uniqueName);

  console.log('name of file ::', uniqueName);
  console.log('file directory ::', uploadDir);
  console.log('file path ::', filePath);
  // Ensure upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Save file
  await new Promise<void>((resolve, reject) => {
    const writeStream = fs.createWriteStream(filePath);

    stream
      .pipe(writeStream)
      .on('finish', () => {
        console.log('✅ File saved:', filePath);
        resolve();
      })
      .on('error', (err) => {
        console.error('❌ File save error:', err);
        reject(err);
      });
    console.log('CWD:', process.cwd());
  });
  // console.log(`../uploads/${uniqueName}`);
  return `/uploads/${uniqueName}`;
}
