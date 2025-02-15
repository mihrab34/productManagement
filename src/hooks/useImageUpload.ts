import { useState } from 'react';

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string> => {
    setUploading(true);
    setError(null);

    try {
      //  image upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      const fakeUrl = URL.createObjectURL(file);
      setUploading(false);
      return fakeUrl;
    } catch (err) {
      setError('Failed to upload image');
      setUploading(false);
      throw err;
    }
  };

  return { uploadImage, uploading, error };
};