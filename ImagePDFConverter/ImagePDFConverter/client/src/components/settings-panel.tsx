import { PDFSettings } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Tablet } from "lucide-react";

interface SettingsPanelProps {
  settings: PDFSettings;
  onSettingsChange: (settings: Partial<PDFSettings>) => void;
}

export default function SettingsPanel({ settings, onSettingsChange }: SettingsPanelProps) {
  const updateMargin = (side: keyof PDFSettings['margins'], value: string) => {
    const numValue = parseInt(value) || 0;
    onSettingsChange({
      margins: {
        ...settings.margins,
        [side]: Math.max(0, Math.min(50, numValue))
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Orientation */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-3 block">Orientation</Label>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant={settings.orientation === 'portrait' ? 'default' : 'outline'}
            className={`h-auto p-3 flex items-center justify-center ${
              settings.orientation === 'portrait' 
                ? 'bg-brand-500 hover:bg-brand-600 border-brand-500' 
                : 'hover:border-brand-400'
            }`}
            onClick={() => onSettingsChange({ orientation: 'portrait' })}
          >
            <Smartphone className="h-4 w-4 mr-2" />
            Portrait
          </Button>
          <Button
            variant={settings.orientation === 'landscape' ? 'default' : 'outline'}
            className={`h-auto p-3 flex items-center justify-center ${
              settings.orientation === 'landscape' 
                ? 'bg-brand-500 hover:bg-brand-600 border-brand-500' 
                : 'hover:border-brand-400'
            }`}
            onClick={() => onSettingsChange({ orientation: 'landscape' })}
          >
            <Tablet className="h-4 w-4 mr-2" />
            Landscape
          </Button>
        </div>
      </div>

      {/* Image Fit */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-3 block">Image Fit</Label>
        <Select 
          value={settings.imageFit} 
          onValueChange={(value) => onSettingsChange({ imageFit: value as PDFSettings['imageFit'] })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="contain">Fit to page</SelectItem>
            <SelectItem value="cover">Fill page</SelectItem>
            <SelectItem value="stretch">Stretch to fit</SelectItem>
            <SelectItem value="center">Center on page</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Margins */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-3 block">Margins (mm)</Label>
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            placeholder="Top"
            value={settings.margins.top}
            min="0"
            max="50"
            onChange={(e) => updateMargin('top', e.target.value)}
          />
          <Input
            type="number"
            placeholder="Bottom"
            value={settings.margins.bottom}
            min="0"
            max="50"
            onChange={(e) => updateMargin('bottom', e.target.value)}
          />
          <Input
            type="number"
            placeholder="Left"
            value={settings.margins.left}
            min="0"
            max="50"
            onChange={(e) => updateMargin('left', e.target.value)}
          />
          <Input
            type="number"
            placeholder="Right"
            value={settings.margins.right}
            min="0"
            max="50"
            onChange={(e) => updateMargin('right', e.target.value)}
          />
        </div>
      </div>

      {/* Advanced Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Advanced Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm text-gray-600">Document Title</Label>
            <Input
              placeholder="Enter PDF title"
              value={settings.title || ''}
              onChange={(e) => onSettingsChange({ title: e.target.value })}
            />
          </div>
          
          <div>
            <Label className="text-sm text-gray-600">Header Text</Label>
            <Input
              placeholder="Enter header text"
              value={settings.header || ''}
              onChange={(e) => onSettingsChange({ header: e.target.value })}
            />
          </div>
          
          <div>
            <Label className="text-sm text-gray-600">Footer Text</Label>
            <Input
              placeholder="Enter footer text"
              value={settings.footer || ''}
              onChange={(e) => onSettingsChange({ footer: e.target.value })}
            />
          </div>
          
          <div>
            <Label className="text-sm text-gray-600">Watermark Text</Label>
            <Input
              placeholder="Enter watermark text"
              value={settings.watermark || ''}
              onChange={(e) => onSettingsChange({ watermark: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quality Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Output Quality</CardTitle>
        </CardHeader>
        <CardContent>
          <Select 
            value={settings.quality} 
            onValueChange={(value) => onSettingsChange({ quality: value as PDFSettings['quality'] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High Quality (Larger file)</SelectItem>
              <SelectItem value="medium">Medium Quality (Balanced)</SelectItem>
              <SelectItem value="low">Low Quality (Smaller file)</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
}
