'use client';

interface DownloadSectionProps {
  convertedImageUrl: string | null;
  selectedFormat: 'avif' | 'webp';
  originalFileName: string | null;
  isConverting: boolean;
  fileCount: number;
}

export default function DownloadSection({
  convertedImageUrl,
  selectedFormat,
  originalFileName,
  isConverting,
  fileCount
}: DownloadSectionProps) {
  const getDownloadFileName = () => {
    // For multiple files, use ZIP filename
    if (fileCount > 1) {
      return 'converted_images.zip';
    }

    // For single file, use the converted format extension
    if (!originalFileName) return `converted.${selectedFormat}`;

    const nameWithoutExtension = originalFileName.replace(/\.[^/.]+$/, '');
    return `${nameWithoutExtension}.${selectedFormat}`;
  };

  if (isConverting) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Download</h3>
        <div className="flex items-center justify-center p-8 border rounded-lg bg-secondary/20">
          <div className="text-center space-y-2">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="text-sm text-muted-foreground">
              Converting {fileCount === 1 ? 'image' : `${fileCount} images`}...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!convertedImageUrl) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Download</h3>
        <div className="flex items-center justify-center p-8 border rounded-lg bg-secondary/20">
          <p className="text-sm text-muted-foreground">
            Upload {fileCount === 1 ? 'an image' : 'images'} and convert {fileCount === 1 ? 'it' : 'them'} to download
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Download</h3>
      <div className="flex flex-col items-center space-y-4 p-6 border rounded-lg bg-secondary/20">
        <div className="text-center space-y-2">
          <p className="text-sm font-medium">
            Your {fileCount === 1 ? 'image has' : `${fileCount} images have`} been converted to {selectedFormat.toUpperCase()}
          </p>
          <p className="text-xs text-muted-foreground">
            Click the button below to download your converted {fileCount === 1 ? 'image' : 'images'}
          </p>
        </div>
        
        <a
          href={convertedImageUrl}
          download={getDownloadFileName()}
          className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          {fileCount === 1
            ? `Download ${selectedFormat.toUpperCase()} Image`
            : `Download ZIP File (${fileCount} ${selectedFormat.toUpperCase()} Images)`
          }
        </a>
        
        <div className="text-xs text-muted-foreground text-center">
          <p>File name: {getDownloadFileName()}</p>
        </div>
      </div>
    </div>
  );
}
