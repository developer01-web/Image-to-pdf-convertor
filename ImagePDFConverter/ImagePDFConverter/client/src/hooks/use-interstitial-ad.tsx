import { useState, useCallback } from 'react';

export function useInterstitialAd() {
  const [showInterstitial, setShowInterstitial] = useState(false);

  const showInterstitialAd = useCallback(() => {
    // Show interstitial ad after conversion completion
    setShowInterstitial(true);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setShowInterstitial(false);
    }, 5000);
  }, []);

  const hideInterstitialAd = useCallback(() => {
    setShowInterstitial(false);
  }, []);

  return {
    showInterstitial,
    showInterstitialAd,
    hideInterstitialAd
  };
}