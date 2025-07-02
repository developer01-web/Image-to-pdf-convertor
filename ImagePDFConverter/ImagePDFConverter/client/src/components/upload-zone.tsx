import { useCallback, useState } from "react";
import { Cloud, FolderOpen, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UploadZoneProps {
  onFilesAdded: (files: File[]) => void;
  isProcessing: boolean;
  progress: number;
}

export default function UploadZone({ onFilesAdded, isProcessing, progress }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFiles = useCallback((files: File[]) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    const invalidFiles = files.filter(file => 
      !validTypes.includes(file.type) || file.size > maxSize
    );

    if (invalidFiles.length > 0) {
      setError('Please select valid image files (JPEG, PNG, BMP, WEBP) under 10MB each.');
      return false;
    }

    setError(null);
    return true;
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (validateFiles(files)) {
      onFilesAdded(files);
    }
  }, [onFilesAdded, validateFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (validateFiles(files)) {
      onFilesAdded(files);
    }
    // Reset input value to allow selecting the same files again
    e.target.value = '';
  }, [onFilesAdded, validateFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer
          ${isDragOver 
            ? 'border-brand-400 bg-brand-50' 
            : 'border-gray-300 hover:border-brand-400 bg-gray-50 hover:bg-brand-50'
          }
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <Cloud className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-600 mb-2">Drag & drop images here</p>
        <p className="text-gray-500 mb-4">or click to browse files</p>
        <Button className="bg-brand-500 hover:bg-brand-600">
          <FolderOpen className="h-4 w-4 mr-2" />
          Choose Files
        </Button>
        <p className="text-sm text-gray-500 mt-4">Supports: JPG, PNG, BMP, WEBP (Max 10MB each)</p>
      </div>

      <input
        id="fileInput"
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.bmp,.webp"
        className="hidden"
        onChange={handleFileSelect}
      />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isProcessing && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Processing images...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}
    </div>
  );
}
