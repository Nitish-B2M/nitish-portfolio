'use client';

import { useState, useCallback } from 'react';
import { CloudinaryImage } from './CloudinaryImage';
import { Button } from './button';
import { Label } from './label';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onUpload: (url: string, public_id: string) => void;
  defaultImage?: string;
  className?: string;
  folder?: string;
  caption?: string;
}

export function ImageUpload({
  onUpload,
  defaultImage = '',
  className,
  folder = 'portfolio',
  caption = ''
}: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState<string>(defaultImage);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setError('');
    setIsUploading(true);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      setIsUploading(false);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    
    if (caption) {
      formData.append('caption', caption);
    }

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      if (data.secure_url) {
        setImageUrl(data.secure_url);
        onUpload(data.secure_url, data.public_id);
      } else {
        throw new Error('No URL in response');
      }
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  }, [folder, caption, onUpload]);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="image-upload" className="cursor-pointer">
          {imageUrl ? (
            <div className="relative group">
              <CloudinaryImage
                src={imageUrl}
                alt="Uploaded image"
                width={300}
                height={200}
                className="rounded-lg object-cover w-full h-[200px]"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                <span className="text-white text-sm">Click to change image</span>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <div className="flex flex-col items-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span className="mt-2 text-sm text-gray-500">
                  Click to upload an image
                </span>
              </div>
            </div>
          )}
        </Label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={isUploading}
          className="hidden"
        />
      </div>

      {isUploading && (
        <div className="text-sm text-gray-500">Uploading...</div>
      )}

      {error && (
        <div className="text-sm text-red-500">{error}</div>
      )}
    </div>
  );
} 