'use client';

import { useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  onFileSelect: (files: File[]) => void;
  selectedFiles: File[];
}

export default function ImageUpload({ onFileSelect, selectedFiles }: ImageUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    // Handle rejected files with toast notifications
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach((rejection) => {
        const { file, errors } = rejection;
        errors.forEach((error) => {
          if (error.code === 'file-invalid-type') {
            toast.error(`Invalid file type: ${file.name}. Only JPEG, JPG, and PNG files are allowed.`);
          } else if (error.code === 'file-too-large') {
            toast.error(`File too large: ${file.name}. Maximum size is 50MB.`);
          } else {
            toast.error(`Error with file ${file.name}: ${error.message}`);
          }
        });
      });
    }

    // Handle accepted files
    if (acceptedFiles.length > 0) {
      toast.success(`${acceptedFiles.length} file${acceptedFiles.length > 1 ? 's' : ''} selected successfully!`);
      onFileSelect(acceptedFiles);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png']
    },
    multiple: true,
    maxSize: 50 * 1024 * 1024, // 10MB limit per file
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
          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
          {isDragActive ? (
            <p className="text-lg text-primary">Drop the images here...</p>
          ) : (
            <div className="space-y-2">
              <p className="text-lg font-medium">
                Drag and drop images, or click to select files
              </p>
              <p className="text-sm text-muted-foreground">
                Supports JPEG, JPG, PNG only (max 50MB each)
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
