import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { PDFSettings } from '@shared/schema';

export async function generatePDF(
  files: File[],
  settings: PDFSettings,
  onProgress?: (progress: number) => void
): Promise<void> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Page dimensions based on orientation (A4 size)
  const pageWidth = settings.orientation === 'portrait' ? 595 : 842;
  const pageHeight = settings.orientation === 'portrait' ? 842 : 595;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    // Update progress
    if (onProgress) {
      onProgress((i / files.length) * 90); // Reserve 10% for final PDF generation
    }

    try {
      // Convert image to appropriate format for pdf-lib
      const imageBytes = await loadImageAsBytes(file);
      let pdfImage;

      if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        pdfImage = await pdfDoc.embedJpg(imageBytes);
      } else {
        // Convert other formats to PNG
        const pngBytes = await convertToPng(file, settings.quality);
        pdfImage = await pdfDoc.embedPng(pngBytes);
      }

      // Create new page
      const page = pdfDoc.addPage([pageWidth, pageHeight]);

      // Calculate available space considering margins
      const margins = settings.margins;
      const availableWidth = pageWidth - (margins.left + margins.right);
      const availableHeight = pageHeight - (margins.top + margins.bottom);

      // Calculate image dimensions and position
      const { width: imgWidth, height: imgHeight, x, y } = calculateImageLayout(
        pdfImage,
        availableWidth,
        availableHeight,
        margins,
        pageWidth,
        pageHeight,
        settings.imageFit
      );

      // Draw the image
      page.drawImage(pdfImage, {
        x,
        y,
        width: imgWidth,
        height: imgHeight,
      });

      // Add header if specified
      if (settings.header) {
        page.drawText(settings.header, {
          x: margins.left,
          y: pageHeight - margins.top / 2,
          size: 12,
          font: boldFont,
          color: rgb(0, 0, 0),
        });
      }

      // Add footer if specified
      if (settings.footer) {
        page.drawText(settings.footer, {
          x: margins.left,
          y: margins.bottom / 2,
          size: 10,
          font,
          color: rgb(0.5, 0.5, 0.5),
        });
      }

      // Add watermark if specified
      if (settings.watermark) {
        const watermarkWidth = font.widthOfTextAtSize(settings.watermark, 48);
        page.drawText(settings.watermark, {
          x: (pageWidth - watermarkWidth) / 2,
          y: pageHeight / 2,
          size: 48,
          font,
          color: rgb(0.8, 0.8, 0.8),
          opacity: 0.3,
        });
      }

    } catch (error) {
      console.error(`Error processing image ${file.name}:`, error);
      // Continue with other images
    }
  }

  // Set document metadata
  if (settings.title) {
    pdfDoc.setTitle(settings.title);
  }
  pdfDoc.setAuthor('PDF Converter by Mr 1');
  pdfDoc.setCreator('PDF Converter');
  pdfDoc.setSubject('Image to PDF Conversion');

  // Update progress to 95%
  if (onProgress) {
    onProgress(95);
  }

  // Generate PDF bytes
  const pdfBytes = await pdfDoc.save();

  // Update progress to 100%
  if (onProgress) {
    onProgress(100);
  }

  // Download the PDF
  downloadPDF(pdfBytes, settings.title || 'converted-images');
}

async function loadImageAsBytes(file: File): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

async function convertToPng(file: File, quality: string): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        
        // Convert to blob with quality settings
        const qualityValue = quality === 'high' ? 1.0 : quality === 'medium' ? 0.8 : 0.6;
        
        canvas.toBlob(async (blob) => {
          if (blob) {
            const arrayBuffer = await blob.arrayBuffer();
            resolve(new Uint8Array(arrayBuffer));
          } else {
            reject(new Error('Failed to convert image to PNG'));
          }
        }, 'image/png', qualityValue);
      } else {
        reject(new Error('Failed to get canvas context'));
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

function calculateImageLayout(
  pdfImage: any,
  availableWidth: number,
  availableHeight: number,
  margins: PDFSettings['margins'],
  pageWidth: number,
  pageHeight: number,
  imageFit: PDFSettings['imageFit']
): { width: number; height: number; x: number; y: number } {
  const imageWidth = pdfImage.width;
  const imageHeight = pdfImage.height;

  let width: number, height: number, x: number, y: number;

  switch (imageFit) {
    case 'contain':
      // Scale image to fit within available space while maintaining aspect ratio
      const scale = Math.min(availableWidth / imageWidth, availableHeight / imageHeight);
      width = imageWidth * scale;
      height = imageHeight * scale;
      x = margins.left + (availableWidth - width) / 2;
      y = pageHeight - margins.top - (availableHeight + height) / 2;
      break;

    case 'cover':
      // Scale image to cover available space while maintaining aspect ratio
      const coverScale = Math.max(availableWidth / imageWidth, availableHeight / imageHeight);
      width = imageWidth * coverScale;
      height = imageHeight * coverScale;
      x = margins.left + (availableWidth - width) / 2;
      y = pageHeight - margins.top - (availableHeight + height) / 2;
      break;

    case 'stretch':
      // Stretch image to fill entire available space
      width = availableWidth;
      height = availableHeight;
      x = margins.left;
      y = margins.bottom;
      break;

    case 'center':
    default:
      // Center image at original size (or scale down if too large)
      const centerScale = Math.min(1, availableWidth / imageWidth, availableHeight / imageHeight);
      width = imageWidth * centerScale;
      height = imageHeight * centerScale;
      x = margins.left + (availableWidth - width) / 2;
      y = pageHeight - margins.top - (availableHeight + height) / 2;
      break;
  }

  return { width, height, x, y };
}

function downloadPDF(pdfBytes: Uint8Array, filename: string): void {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = `${filename}.pdf`;
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
