'use client';

interface PreviewProps {
  originalFile: File | null;
  convertedImageUrl: string | null;
  selectedFormat: 'avif' | 'webp';
}

export default function Preview({ originalFile, convertedImageUrl, selectedFormat }: PreviewProps) {
  const originalImageUrl = originalFile ? URL.createObjectURL(originalFile) : null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Preview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original Image */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Original</h4>
          <div className="border rounded-lg overflow-hidden bg-secondary/20">
            {originalImageUrl ? (
              <img
                src={originalImageUrl}
                alt="Original uploaded image for conversion"
                className="w-full h-64 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "https://placehold.co/400x300?text=Image+Load+Error";
                }}
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center">
                <img
                  src="https://placehold.co/400x300?text=Upload+an+image+to+see+preview"
                  alt="Placeholder showing upload area for original image preview"
                  className="opacity-50"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "https://placehold.co/400x300?text=Preview+Area";
                  }}
                />
              </div>
            )}
          </div>
          {originalFile && (
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Format: {originalFile.type}</p>
              <p>Size: {(originalFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          )}
        </div>

        {/* Converted Image */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">
            Converted ({selectedFormat.toUpperCase()})
          </h4>
          <div className="border rounded-lg overflow-hidden bg-secondary/20">
            {convertedImageUrl ? (
              <img
                src={convertedImageUrl}
                alt={`Converted image in ${selectedFormat.toUpperCase()} format showing the processed result`}
                className="w-full h-64 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "https://placehold.co/400x300?text=Conversion+Error";
                }}
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center">
                <img
                  src={`https://placehold.co/400x300?text=Converted+${selectedFormat.toUpperCase()}+preview+will+appear+here`}
                  alt={`Placeholder for converted ${selectedFormat.toUpperCase()} image preview area`}
                  className="opacity-50"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "https://placehold.co/400x300?text=Preview+Area";
                  }}
                />
              </div>
            )}
          </div>
          {convertedImageUrl && (
            <div className="text-xs text-muted-foreground">
              <p>Format: image/{selectedFormat}</p>
              <p>Converted successfully</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
