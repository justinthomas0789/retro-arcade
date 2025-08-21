import React, { useEffect } from 'react';
import { Modal, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAds } from '../contexts/AdContext';
import { useTheme } from '../contexts/ThemeContext';

interface InterstitialAdProps {
  visible: boolean;
  onClose: () => void;
}

export const InterstitialAd: React.FC<InterstitialAdProps> = ({
  visible,
  onClose,
}) => {
  const { showInterstitialAd } = useAds();
  const { colors } = useTheme();

  useEffect(() => {
    if (visible) {
      // Show ad after a brief delay
      const timer = setTimeout(() => {
        showInterstitialAd(onClose);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      backgroundColor: colors.surface,
      padding: 30,
      borderRadius: 10,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.primary,
    },
    text: {
      color: colors.text,
      fontSize: 16,
      marginBottom: 20,
      textAlign: 'center',
    },
  });

  if (!visible) return null;

  return (
    <Modal visible transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.text}>Loading...</Text>
        </View>
      </View>
    </Modal>
  );
};