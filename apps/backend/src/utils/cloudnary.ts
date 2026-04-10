import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuid } from 'uuid';
import { TFile } from '../types/movie.types';

// Configure Cloudinary (ideally in a separate config file)
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadFile(file: TFile) {
  const { createReadStream, filename } = await file;

  const stream = createReadStream();
  const uniqueName = `${uuid()}-${filename}`;

  // Upload to Cloudinary using stream
  const result = await new Promise<{ secure_url: string }>(
    (resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'myapp', public_id: uniqueName },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as any);
        }
      );

      stream.pipe(uploadStream);
    }
  );

  console.log('✅ Uploaded to Cloudinary:', result.secure_url);

  // Return the Cloudinary URL instead of local path
  return result.secure_url;
}

export async function uploadBase64(base64DataUrl: string): Promise<string> {
  const uniqueName = `poster-${uuid()}`;
  const result = await cloudinary.uploader.upload(base64DataUrl, {
    folder: 'myapp/posters',
    public_id: uniqueName,
  });
  console.log('✅ Uploaded base64 to Cloudinary:', result.secure_url);
  return result.secure_url;
}
