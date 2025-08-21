import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AdMobBanner } from 'expo-ads-admob';
import { useAds } from '../contexts/AdContext';

export const BannerAd: React.FC = () => {
  const { showBannerAd } = useAds();

  if (!showBannerAd) return null;

  return (
    <View style={styles.container}>
      <AdMobBanner
        bannerSize="smartBannerPortrait"
        adUnitID="ca-app-pub-3940256099942544/6300978111" // Test ID
        servePersonalizedAds={true}
        onDidFailToReceiveAdWithError={(error) => console.error('Banner ad error:', error)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
});