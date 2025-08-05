'use client';

interface FormatSelectorProps {
  selectedFormat: 'avif' | 'webp';
  onFormatChange: (format: 'avif' | 'webp') => void;
}

export default function FormatSelector({ selectedFormat, onFormatChange }: FormatSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Output Format</h3>
      <div className="flex gap-6">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="radio"
            name="format"
            value="avif"
            checked={selectedFormat === 'avif'}
            onChange={(e) => onFormatChange(e.target.value as 'avif')}
            className="w-4 h-4 text-primary border-border focus:ring-primary focus:ring-2"
          />
          <div className="space-y-1">
            <span className="text-sm font-medium">AVIF</span>
            <p className="text-xs text-muted-foreground">
              Better compression, newer format
            </p>
          </div>
        </label>
        
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="radio"
            name="format"
            value="webp"
            checked={selectedFormat === 'webp'}
            onChange={(e) => onFormatChange(e.target.value as 'webp')}
            className="w-4 h-4 text-primary border-border focus:ring-primary focus:ring-2"
          />
          <div className="space-y-1">
            <span className="text-sm font-medium">WebP</span>
            <p className="text-xs text-muted-foreground">
              Wide browser support, good compression
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}
