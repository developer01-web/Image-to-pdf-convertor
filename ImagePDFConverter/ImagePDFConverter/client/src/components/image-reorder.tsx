import { useState, useCallback, useEffect } from "react";
import { GripVertical } from "lucide-react";

interface ImageReorderProps {
  files: File[];
  onReorder: (newFiles: File[]) => void;
}

export default function ImageReorder({ files, onReorder }: ImageReorderProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newFiles = [...files];
    const draggedFile = newFiles[draggedIndex];
    
    // Remove the dragged file
    newFiles.splice(draggedIndex, 1);
    
    // Insert it at the new position
    const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
    newFiles.splice(insertIndex, 0, draggedFile);
    
    onReorder(newFiles);
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, [files, draggedIndex, onReorder]);

  const createImagePreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {files.map((file, index) => (
        <div
          key={`reorder-${file.name}-${index}`}
          className={`relative bg-white rounded-lg shadow-md p-2 cursor-move transition-all duration-200 ${
            draggedIndex === index ? 'opacity-50 scale-95' : ''
          } ${
            dragOverIndex === index ? 'ring-2 ring-brand-500 scale-105' : ''
          }`}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, index)}
        >
          <div className="absolute top-1 left-1 bg-brand-500 text-white text-xs px-2 py-1 rounded z-10">
            {index + 1}
          </div>
          <div className="absolute top-1 right-1 text-gray-400 cursor-grab active:cursor-grabbing z-10">
            <GripVertical className="h-4 w-4" />
          </div>
          
          <ImagePreview file={file} />
          
          <p className="text-xs text-gray-600 mt-1 truncate px-1">{file.name}</p>
        </div>
      ))}
    </div>
  );
}

function ImagePreview({ file }: { file: File }) {
  const [preview, setPreview] = useState<string>('');

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, [file]);

  return (
    <div className="w-full h-24 bg-gray-100 rounded overflow-hidden">
      {preview ? (
        <img src={preview} alt={file.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-pulse bg-gray-200 w-full h-full rounded"></div>
        </div>
      )}
    </div>
  );
}
