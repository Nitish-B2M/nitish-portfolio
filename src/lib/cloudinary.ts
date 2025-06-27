import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadImageParams {
  file: string | Buffer;
  folder?: string;
  public_id?: string;
  overwrite?: boolean;
  resource_type?: "image" | "video" | "raw" | "auto";
  tags?: string[];
  caption?: string;
}

export interface CloudinaryUploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

export async function uploadToCloudinary({
  file,
  folder = "portfolio",
  public_id,
  overwrite = true,
  resource_type = "image",
  tags = [],
  caption = ""
}: UploadImageParams): Promise<CloudinaryUploadResult> {
  try {
    // Clean the folder path to prevent duplicates
    const cleanFolder = folder.replace(/^\/+|\/+$/g, '').replace(/\/+/g, '/');
    
    // If file is a Buffer, convert it to base64
    const fileToUpload = Buffer.isBuffer(file) 
      ? `data:image/jpeg;base64,${file.toString('base64')}`
      : file;

    const uploadResult = await cloudinary.uploader.upload(fileToUpload, {
      folder: cleanFolder,
      public_id,
      overwrite,
      resource_type,
      tags,
      caption
    });

    // For debugging
    console.log('Cloudinary upload response:', uploadResult);

    return {
      url: uploadResult.secure_url,
      secure_url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
      resource_type: uploadResult.resource_type
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload file to Cloudinary');
  }
}

export function getCloudinaryUrl(public_id: string, options: any = {}) {
  return cloudinary.url(public_id, {
    secure: true,
    ...options
  });
}

export function deleteFromCloudinary(public_id: string) {
  return cloudinary.uploader.destroy(public_id);
}

export const uploadImage = async (
  file: string | File,
  options?: { width?: number; height?: number; crop?: string }
): Promise<UploadApiResponse> => {
  try {
    const uploadOptions = {
      ...options,
      folder: process.env.CLOUDINARY_FOLDER || 'portfolio',
    };

    if (typeof file === 'string') {
      // If file is a base64 string or URL
      return await cloudinary.uploader.upload(file, uploadOptions);
    } else {
      // If file is a File object, we need to convert it to base64 first
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      
      return await cloudinary.uploader.upload(base64, uploadOptions);
    }
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};