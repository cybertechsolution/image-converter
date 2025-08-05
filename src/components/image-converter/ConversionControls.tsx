'use client';

interface ConversionControlsProps {
  quality: number;
  onQualityChange: (quality: number) => void;
}

export default function ConversionControls({ quality, onQualityChange }: ConversionControlsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Quality Settings</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="quality-slider" className="text-sm font-medium">
            Quality
          </label>
          <span className="text-sm font-mono bg-secondary px-2 py-1 rounded">
            {quality}%
          </span>
        </div>
        <input
          id="quality-slider"
          type="range"
          min="1"
          max="100"
          value={quality}
          onChange={(e) => onQualityChange(parseInt(e.target.value))}
          className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Lower size</span>
          <span>Higher quality</span>
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        <p>
          <strong>Quality {quality}%:</strong> {' '}
          {quality >= 90 ? 'Excellent quality, larger file size' :
           quality >= 70 ? 'Good quality, balanced file size' :
           quality >= 50 ? 'Moderate quality, smaller file size' :
           'Lower quality, smallest file size'}
        </p>
      </div>
    </div>
  );
}
