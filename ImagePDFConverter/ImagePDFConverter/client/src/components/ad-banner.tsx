import { useEffect } from "react";

interface AdBannerProps {
  type: 'banner' | 'mobile-banner' | 'square' | 'native' | 'interstitial';
  adSlot: string;
  className?: string;
  isDark?: boolean;
  placement?: 'header' | 'footer' | 'inline' | 'after-conversion';
}

export default function AdBanner({ type, adSlot, className = '', isDark = false, placement = 'inline' }: AdBannerProps) {
  useEffect(() => {
    try {
      // Initialize AdSense ads
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (error) {
      console.log('AdSense initialization error:', error);
    }
  }, []);

  const getAdConfig = () => {
    switch (type) {
      case 'banner':
        return {
          dimensions: 'h-[90px] w-full max-w-[728px]', // 728x90 for desktop
          display: 'hidden md:block',
          format: 'auto'
        };
      case 'mobile-banner':
        return {
          dimensions: 'h-[100px] w-full max-w-[320px]', // 320x100 for mobile
          display: 'block md:hidden',
          format: 'auto'
        };
      case 'square':
        return {
          dimensions: 'h-[250px] w-[300px]', // 300x250
          display: 'block',
          format: 'rectangle'
        };
      case 'native':
        return {
          dimensions: 'min-h-[200px] w-full',
          display: 'block',
          format: 'fluid'
        };
      case 'interstitial':
        return {
          dimensions: 'fixed inset-0 z-50',
          display: 'block',
          format: 'interstitial'
        };
      default:
        return {
          dimensions: 'h-[90px] w-full',
          display: 'block',
          format: 'auto'
        };
    }
  };

  const config = getAdConfig();

  // Special handling for interstitial ads
  if (type === 'interstitial') {
    return (
      <div className={`${config.dimensions} bg-black bg-opacity-90 flex items-center justify-center ${className}`}>
        <div className="bg-white rounded-lg p-4 max-w-sm mx-auto">
          <div className="text-xs mb-2 text-gray-500 text-center">Advertisement</div>
          <ins 
            className="adsbygoogle block"
            style={{ display: 'block', width: '300px', height: '250px' }}
            data-ad-client="ca-pub-XXXXXXXXXX"
            data-ad-slot={adSlot}
            data-ad-format={config.format}
            data-ad-region={placement}
          ></ins>
          <div className="text-xs mt-2 text-center text-gray-400">
            Powered by Mr 1
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${config.display} ${className}`}>
      <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Advertisement
        </div>
        
        {/* Google AdSense Ad Unit */}
        <div className={`${config.dimensions} flex items-center justify-center border border-gray-200 rounded mx-auto`}>
          <ins 
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', height: '100%' }}
            data-ad-client="ca-pub-XXXXXXXXXX"
            data-ad-slot={adSlot}
            data-ad-format={config.format}
            data-full-width-responsive="true"
            data-ad-region={placement}
          ></ins>
        </div>
        
        {/* Mr 1 Attribution */}
        <div className={`text-xs mt-2 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          Powered by Mr 1
        </div>
      </div>
    </div>
  );
}
