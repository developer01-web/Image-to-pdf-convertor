import { PDFSettings } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: File[];
  settings: PDFSettings;
  onDownload: () => void;
}

export default function PreviewModal({ isOpen, onClose, files, settings, onDownload }: PreviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh]">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>PDF Preview</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[70vh] space-y-4">
          {files.map((file, index) => (
            <div key={`preview-${index}`} className="border border-gray-300 rounded-lg p-4 bg-white">
              <h4 className="font-medium mb-2">Page {index + 1}: {file.name}</h4>
              <div className="bg-gray-100 p-8 rounded text-center min-h-[200px] flex flex-col items-center justify-center">
                <div className="bg-white shadow-lg rounded p-4 max-w-sm w-full">
                  <div className="text-center">
                    <div className="w-16 h-20 bg-red-500 rounded mx-auto mb-2 flex items-center justify-center">
                      <span className="text-white font-bold text-xs">PDF</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Preview of PDF page</p>
                    <p className="text-xs text-gray-500">
                      {settings.orientation} • {settings.imageFit} fit
                    </p>
                    {settings.header && (
                      <p className="text-xs text-gray-400 mt-2 border-t pt-1">Header: {settings.header}</p>
                    )}
                    {settings.footer && (
                      <p className="text-xs text-gray-400 border-t pt-1">Footer: {settings.footer}</p>
                    )}
                    {settings.watermark && (
                      <p className="text-xs text-gray-300 absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                        {settings.watermark}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <DialogFooter>
          <Button onClick={onDownload} className="bg-brand-500 hover:bg-brand-600">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
