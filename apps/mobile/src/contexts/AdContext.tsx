import React, { createContext, useContext, useState, useEffect } from 'react';
import * as AdMob from 'expo-ads-admob';

interface AdContextType {
  showBannerAd: boolean;
  showInterstitialAd: (callback?: () => void) => void;
  showRewardedAd: (callback?: (rewarded: boolean) => void) => void;
}

const AdContext = createContext<AdContextType | undefined>(undefined);

export const AdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showBannerAd, setShowBannerAd] = useState(true);

  useEffect(() => {
    initializeAds();
  }, []);

  const initializeAds = async () => {
    try {
      // Initialize AdMob with your app ID
      await AdMob.setTestDeviceIDAsync(AdMob.SIMULATOR_ID);
      
      // Pre-load interstitial ads
      await AdMob.AdMobInterstitial.setAdUnitID('ca-app-pub-3940256099942544/1033173712'); // Test ID
      await AdMob.AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
      
      // Pre-load rewarded ads
      await AdMob.AdMobRewarded.setAdUnitID('ca-app-pub-3940256099942544/5224354917'); // Test ID
      await AdMob.AdMobRewarded.requestAdAsync();
    } catch (error) {
      console.error('Failed to initialize ads:', error);
    }
  };

  const showInterstitialAd = async (callback?: () => void) => {
    try {
      const isReady = await AdMob.AdMobInterstitial.getIsReadyAsync();
      if (isReady) {
        await AdMob.AdMobInterstitial.showAdAsync();
        // Pre-load next ad
        await AdMob.AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
      }
      callback?.();
    } catch (error) {
      console.error('Failed to show interstitial ad:', error);
      callback?.();
    }
  };

  const showRewardedAd = async (callback?: (rewarded: boolean) => void) => {
    try {
      const isReady = await AdMob.AdMobRewarded.getIsReadyAsync();
      if (isReady) {
        const result = await AdMob.AdMobRewarded.showAdAsync();
        callback?.(result.type === 'rewarded');
        // Pre-load next ad
        await AdMob.AdMobRewarded.requestAdAsync();
      } else {
        callback?.(false);
      }
    } catch (error) {
      console.error('Failed to show rewarded ad:', error);
      callback?.(false);
    }
  };

  return (
    <AdContext.Provider value={{
      showBannerAd,
      showInterstitialAd,
      showRewardedAd,
    }}>
      {children}
    </AdContext.Provider>
  );
};

export const useAds = () => {
  const context = useContext(AdContext);
  if (!context) {
    throw new Error('useAds must be used within AdProvider');
  }
  return context;
};
