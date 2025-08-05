'use client';

import { useState } from 'react';
import ImageUpload from '@/components/image-converter/ImageUpload';
import FormatSelector from '@/components/image-converter/FormatSelector';
import ConversionControls from '@/components/image-converter/ConversionControls';
import DownloadSection from '@/components/image-converter/DownloadSection';
import { toast } from 'sonner';

export default function ImageConverter() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<'avif' | 'webp'>('webp');
  const [quality, setQuality] = useState<number>(80);
  const [convertedImageUrl, setConvertedImageUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one image file first');
      return;
    }

    setIsConverting(true);
    setError(null);

    // Clear previous converted image
    if (convertedImageUrl) {
      URL.revokeObjectURL(convertedImageUrl);
      setConvertedImageUrl(null);
    }

    try {
      toast.loading('Converting images...', { id: 'conversion' });

      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('file', file);
      });
      formData.append('format', selectedFormat);
      formData.append('quality', quality.toString());

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Conversion failed');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setConvertedImageUrl(url);

      toast.success(
        `Successfully converted ${selectedFiles.length} image${selectedFiles.length > 1 ? 's' : ''} to ${selectedFormat.toUpperCase()}!`,
        { id: 'conversion' }
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during conversion';
      toast.error(errorMessage, { id: 'conversion' });
      setError(errorMessage);
    } finally {
      setIsConverting(false);
    }
  };

  const handleFileSelect = (files: File[]) => {
    setSelectedFiles(files);
    setError(null);
    
    // Clear previous converted image when new files are selected
    if (convertedImageUrl) {
      URL.revokeObjectURL(convertedImageUrl);
      setConvertedImageUrl(null);
    }
  };

  const handleReset = () => {
    // Clear selected files
    setSelectedFiles([]);
    setError(null);
    
    // Clear converted image and revoke URL
    if (convertedImageUrl) {
      URL.revokeObjectURL(convertedImageUrl);
      setConvertedImageUrl(null);
    }
    
    // Reset to default values
    setSelectedFormat('webp');
    setQuality(80);
    setIsConverting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Image Converter</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Convert your images to modern AVIF and WebP formats for better compression and faster loading times
          </p>
        </div>

        <div className="space-y-8">
          {/* File Upload */}
          <section>
            <ImageUpload 
              onFileSelect={handleFileSelect}
              selectedFiles={selectedFiles}
            />
          </section>

          {/* Conversion Settings */}
          {selectedFiles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section>
                <FormatSelector 
                  selectedFormat={selectedFormat}
                  onFormatChange={setSelectedFormat}
                />
              </section>
              
              <section>
                <ConversionControls 
                  quality={quality}
                  onQualityChange={setQuality}
                />
              </section>
            </div>
          )}

          {/* Convert Button */}
          {selectedFiles.length > 0 && (
            <section className="text-center space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={handleConvert}
                  disabled={isConverting}
                  className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-semibold text-lg rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  {isConverting ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full mr-3"></div>
                      Converting...
                    </>
                  ) : (
                    `Convert to ${selectedFormat.toUpperCase()}`
                  )}
                </button>
                
                <button
                  onClick={handleReset}
                  disabled={isConverting}
                  className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-secondary-foreground font-medium rounded-lg hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
                >
                  Reset
                </button>
              </div>
              
              {convertedImageUrl && (
                <p className="text-sm text-muted-foreground">
                  Conversion successful! You can reset to upload new images or download the converted file below.
                </p>
              )}
            </section>
          )}

          {/* Error Message */}
          {error && (
            <section>
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
                <p className="font-medium">Error:</p>
                <p className="text-sm">{error}</p>
              </div>
            </section>
          )}

          {/* Preview */}
          {/* Preview removed for multiple files */}

          {/* Download */}
          <section>
            <DownloadSection
              convertedImageUrl={convertedImageUrl}
              selectedFormat={selectedFormat}
              originalFileName={selectedFiles.length === 1 ? selectedFiles[0]?.name || null : null}
              isConverting={isConverting}
              fileCount={selectedFiles.length}
            />
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            Supports JPEG, JPG, PNG input formats only.
            Maximum file size: 50MB each.
          </p>
        </footer>
      </div>
    </div>
  );
}
