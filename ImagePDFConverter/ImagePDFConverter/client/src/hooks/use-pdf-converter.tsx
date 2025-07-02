import { useState, useCallback, useEffect } from "react";
import { PDFSettings, pdfSettingsSchema } from "@shared/schema";
import { generatePDF } from "@/lib/pdf-generator";
import { useToast } from "@/hooks/use-toast";
import { useInterstitialAd } from "@/hooks/use-interstitial-ad";
import { apiRequest } from "@/lib/queryClient";

export function usePDFConverter() {
  const [files, setFiles] = useState<File[]>([]);
  const [settings, setSettings] = useState<PDFSettings>(pdfSettingsSchema.parse({}));
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sessionId] = useState(() => crypto.randomUUID());
  const { toast } = useToast();
  const { showInterstitial, showInterstitialAd, hideInterstitialAd } = useInterstitialAd();

  const trackAnalytics = useCallback(async (event: string, metadata: any = {}) => {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event,
          sessionId,
          metadata,
        }),
      });
    } catch (error) {
      console.log('Analytics tracking failed:', error);
    }
  }, [sessionId]);

  const trackConversion = useCallback(async (filename: string, imageCount: number, fileSize?: number) => {
    try {
      await fetch('/api/conversions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          filename,
          imageCount,
          settings,
          fileSize,
        }),
      });
    } catch (error) {
      console.log('Conversion tracking failed:', error);
    }
  }, [sessionId, settings]);

  // Track page view analytics after functions are defined
  useEffect(() => {
    trackAnalytics('page_view', { page: 'converter' });
  }, [trackAnalytics]);

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
    trackAnalytics('files_uploaded', { 
      fileCount: newFiles.length,
      totalFiles: files.length + newFiles.length 
    });
    toast({
      title: "Files added",
      description: `Added ${newFiles.length} image${newFiles.length > 1 ? 's' : ''} for conversion.`,
    });
  }, [toast, trackAnalytics, files.length]);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    toast({
      title: "File removed",
      description: "Image removed from conversion list.",
    });
  }, [toast]);

  const reorderFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<PDFSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
    setProgress(0);
    toast({
      title: "Files cleared",
      description: "All images have been removed.",
    });
  }, [toast]);

  const previewPDF = useCallback(async () => {
    if (files.length === 0) {
      toast({
        title: "No files",
        description: "Please add some images first.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate preview generation progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      toast({
        title: "Preview ready",
        description: "PDF preview has been generated.",
      });
    } catch (error) {
      console.error('Preview error:', error);
      toast({
        title: "Preview failed",
        description: "Failed to generate PDF preview. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, [files, toast]);

  const convertToPDF = useCallback(async () => {
    if (files.length === 0) {
      toast({
        title: "No files",
        description: "Please add some images first.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      await generatePDF(files, settings, (progress) => {
        setProgress(progress);
      });

      // Track successful conversion
      const filename = settings.title || 'converted-images';
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      await trackConversion(filename, files.length, totalSize);
      await trackAnalytics('pdf_conversion_success', { 
        imageCount: files.length,
        fileSize: totalSize,
        settings: settings 
      });

      toast({
        title: "Conversion complete",
        description: "Your PDF has been generated and downloaded.",
      });

      // Show interstitial ad after successful conversion
      showInterstitialAd();
    } catch (error) {
      console.error('Conversion error:', error);
      await trackAnalytics('pdf_conversion_error', { 
        imageCount: files.length,
        error: String(error) 
      });
      toast({
        title: "Conversion failed",
        description: "Failed to convert images to PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, [files, settings, toast, trackConversion, trackAnalytics]);

  return {
    files,
    settings,
    isProcessing,
    progress,
    addFiles,
    removeFile,
    reorderFiles,
    updateSettings,
    clearFiles,
    previewPDF,
    convertToPDF,
    showInterstitial,
    hideInterstitialAd,
  };
}
