import { useState } from "react";
import { FileText, Upload, Settings, Eye, Download, Sliders, Shield, Smartphone, Layers, Image, RefreshCw } from "lucide-react";
import UploadZone from "@/components/upload-zone";
import SettingsPanel from "@/components/settings-panel";
import FileList from "@/components/file-list";
import PreviewModal from "@/components/preview-modal";
import ImageReorder from "@/components/image-reorder";
import AdBanner from "@/components/ad-banner";
import { usePDFConverter } from "@/hooks/use-pdf-converter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const {
    files,
    settings,
    isProcessing,
    progress,
    addFiles,
    removeFile,
    reorderFiles,
    updateSettings,
    previewPDF,
    convertToPDF,
    clearFiles,
    showInterstitial,
    hideInterstitialAd
  } = usePDFConverter();

  const [showPreview, setShowPreview] = useState(false);
  const [showReorder, setShowReorder] = useState(false);

  const handlePreview = async () => {
    await previewPDF();
    setShowPreview(true);
  };

  const handleConvert = async () => {
    await convertToPDF();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-red-500 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">PDF Converter</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#converter" className="text-gray-600 hover:text-brand-600 transition-colors">Converter</a>
              <a href="#features" className="text-gray-600 hover:text-brand-600 transition-colors">Features</a>
              <a href="#help" className="text-gray-600 hover:text-brand-600 transition-colors">Help</a>
            </nav>
            <button className="md:hidden">
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className="w-4 h-0.5 bg-gray-600 mb-1"></span>
                <span className="w-4 h-0.5 bg-gray-600 mb-1"></span>
                <span className="w-4 h-0.5 bg-gray-600"></span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Header Ad Banner */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Desktop Banner 728x90 */}
          <AdBanner 
            type="banner"
            adSlot="HEADER_DESKTOP"
            placement="header"
            className="w-full"
          />
          {/* Mobile Banner 320x100 */}
          <AdBanner 
            type="mobile-banner"
            adSlot="HEADER_MOBILE"
            placement="header"
            className="w-full"
          />
        </div>
      </div>

      {/* Hero Section */}
      <section className="brand-gradient py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Convert Images to PDF Online</h2>
          <p className="text-xl text-gray-600 mb-8">Transform JPEG, PNG, BMP images into professional PDFs instantly. Free, secure, and no registration required.</p>
          
          <img 
            src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400" 
            alt="Digital file conversion workspace" 
            className="rounded-xl shadow-lg mx-auto mb-8 w-full max-w-2xl object-cover h-64"
          />
        </div>
      </section>

      {/* Main Converter Interface */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="converter">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold flex items-center">
                    <Upload className="text-brand-500 mr-3" />
                    Upload Images
                  </h3>
                  {files.length > 0 && (
                    <Button variant="outline" size="sm" onClick={clearFiles}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  )}
                </div>
                
                <UploadZone 
                  onFilesAdded={addFiles}
                  isProcessing={isProcessing}
                  progress={progress}
                />
              </CardContent>
            </Card>

            {files.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-800 flex items-center">
                      <Image className="h-5 w-5 mr-2" />
                      Uploaded Images 
                      <Badge variant="secondary" className="ml-2">
                        {files.length}
                      </Badge>
                    </h4>
                    {files.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowReorder(!showReorder)}
                      >
                        <Layers className="h-4 w-4 mr-2" />
                        Reorder
                      </Button>
                    )}
                  </div>
                  
                  <FileList 
                    files={files}
                    onRemoveFile={removeFile}
                  />
                </CardContent>
              </Card>
            )}

            {showReorder && files.length > 1 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Layers className="text-brand-500 mr-3" />
                    Reorder Images
                  </h3>
                  <ImageReorder 
                    files={files}
                    onReorder={reorderFiles}
                  />
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Settings Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <Settings className="text-brand-500 mr-3" />
                  PDF Settings
                </h3>
                
                <SettingsPanel 
                  settings={settings}
                  onSettingsChange={updateSettings}
                />
                
                <div className="space-y-3 mt-8">
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={handlePreview}
                    disabled={files.length === 0 || isProcessing}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview PDF
                  </Button>
                  
                  <Button 
                    className="w-full bg-brand-500 hover:bg-brand-600"
                    onClick={handleConvert}
                    disabled={files.length === 0 || isProcessing}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Convert & Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Ad Banner after upload section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Desktop Banner 728x90 */}
          <AdBanner 
            type="banner"
            adSlot="AFTER_UPLOAD_DESKTOP"
            placement="inline"
            className="w-full"
          />
          {/* Mobile Banner 320x100 */}
          <AdBanner 
            type="mobile-banner"
            adSlot="AFTER_UPLOAD_MOBILE"
            placement="inline"
            className="w-full"
          />
          {/* Native Ad within conversion steps */}
          <div className="mt-8">
            <AdBanner 
              type="native"
              adSlot="NATIVE_CONVERSION"
              placement="inline"
              className="w-full"
            />
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need to convert images to PDF professionally</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Image className="h-8 w-8 text-brand-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Multiple Formats</h3>
              <p className="text-gray-600">Support for JPEG, PNG, BMP, WEBP and more image formats</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Layers className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Batch Processing</h3>
              <p className="text-gray-600">Convert multiple images at once to save time</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sliders className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Full Customization</h3>
              <p className="text-gray-600">Adjust orientation, margins, headers, footers, and watermarks</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure & Private</h3>
              <p className="text-gray-600">All processing happens in your browser - files never leave your device</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Download</h3>
              <p className="text-gray-600">Generate and download your PDF in seconds</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Mobile Friendly</h3>
              <p className="text-gray-600">Works perfectly on desktop, tablet, and mobile devices</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Convert your images in 3 simple steps</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-brand-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">1</div>
              <img 
                src="https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                alt="File upload interface" 
                className="rounded-lg shadow-md mx-auto mb-4 w-full h-48 object-cover"
              />
              <h3 className="text-xl font-semibold mb-3">Upload Images</h3>
              <p className="text-gray-600">Drag and drop or click to select your image files</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-brand-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">2</div>
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                alt="Customization settings panel" 
                className="rounded-lg shadow-md mx-auto mb-4 w-full h-48 object-cover"
              />
              <h3 className="text-xl font-semibold mb-3">Customize Settings</h3>
              <p className="text-gray-600">Adjust orientation, margins, and add headers or watermarks</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-brand-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">3</div>
              <img 
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                alt="Professional PDF document" 
                className="rounded-lg shadow-md mx-auto mb-4 w-full h-48 object-cover"
              />
              <h3 className="text-xl font-semibold mb-3">Download PDF</h3>
              <p className="text-gray-600">Get your professionally formatted PDF instantly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with Ad Banner */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          {/* Desktop Footer Banner 728x90 */}
          <AdBanner 
            type="banner"
            adSlot="FOOTER_DESKTOP"
            placement="footer"
            isDark
            className="w-full"
          />
          {/* Mobile Footer Banner 320x100 */}
          <AdBanner 
            type="mobile-banner"
            adSlot="FOOTER_MOBILE"
            placement="footer"
            isDark
            className="w-full"
          />
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <FileText className="h-8 w-8 text-red-500 mr-3" />
                <h3 className="text-xl font-bold">PDF Converter</h3>
              </div>
              <p className="text-gray-400 mb-4">Free online tool to convert images to PDF with professional customization options. Secure, fast, and user-friendly.</p>
              <p className="text-sm text-gray-500">Created by Mr 1</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Batch conversion</li>
                <li>Custom margins</li>
                <li>Watermarks</li>
                <li>Headers & footers</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help guides</li>
                <li>FAQ</li>
                <li>Contact support</li>
                <li>Privacy policy</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PDF Converter by Mr 1. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Preview Modal */}
      {showPreview && (
        <PreviewModal 
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          files={files}
          settings={settings}
          onDownload={handleConvert}
        />
      )}

      {/* Interstitial Ad - Shows after conversion completion */}
      {showInterstitial && (
        <div className="fixed inset-0 z-50" onClick={hideInterstitialAd}>
          <AdBanner 
            type="interstitial"
            adSlot="INTERSTITIAL_CONVERSION"
            placement="after-conversion"
            className="cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}
