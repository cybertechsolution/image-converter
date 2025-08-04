'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploadProps {
  onFileSelect: (files: File[]) => void;
  selectedFiles: File[];
}

export default function ImageUpload({ onFileSelect, selectedFiles }: ImageUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.tiff', '.webp']
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024, // 10MB limit per file
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="text-4xl">📁</div>
          {isDragActive ? (
            <p className="text-lg text-primary">Drop the images here...</p>
          ) : (
            <div className="space-y-2">
              <p className="text-lg font-medium">
                Drag and drop images, or click to select files
              </p>
              <p className="text-sm text-muted-foreground">
                Supports JPEG, PNG, GIF, BMP, TIFF, WebP (max 10MB each)
              </p>
            </div>
          )}
          {selectedFiles.length > 0 && (
            <div className="mt-4 p-3 bg-secondary rounded-md max-h-48 overflow-auto">
              <p className="text-sm font-medium">Selected files:</p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                {selectedFiles.map((file) => (
                  <li key={file.name}>
                    {file.name} - {(file.size / 1024 / 1024).toFixed(2)} MB
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
