import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

interface TouchControlsProps {
  onAction: (action: string) => void;
  onPause: () => void;
  disabled?: boolean;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onAction,
  onPause,
  disabled = false,
}) => {
  const { colors } = useTheme();
  const styles = getControlStyles(colors);

  return (
    <View style={styles.container}>
      {/* Movement Controls */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.button, disabled && styles.disabled]}
          onPress={() => onAction('move-left')}
          disabled={disabled}
        >
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.rotateButton, disabled && styles.disabled]}
          onPress={() => onAction('rotate')}
          disabled={disabled}
        >
          <Ionicons name="refresh" size={24} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, disabled && styles.disabled]}
          onPress={() => onAction('move-right')}
          disabled={disabled}
        >
          <Ionicons name="chevron-forward" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Drop and Pause Controls */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.button, styles.dropButton, disabled && styles.disabled]}
          onPress={() => onAction('hard-drop')}
          disabled={disabled}
        >
          <Text style={styles.dropText}>DROP</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.pauseButton]}
          onPress={onPause}
        >
          <Ionicons name="pause" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};