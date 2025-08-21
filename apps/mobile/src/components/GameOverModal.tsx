import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';

interface GameOverModalProps {
  score: number;
  highScore: number;
  onNewGame: () => void;
  onBackToHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  highScore,
  onNewGame,
  onBackToHome,
}) => {
  const { colors } = useTheme();
  const styles = getModalStyles(colors);
  const isNewHighScore = score > highScore;

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <LinearGradient
            colors={[colors.surface, colors.background]}
            style={styles.gradient}
          >
            <Text style={styles.title}>Game Over!</Text>
            
            {isNewHighScore && (
              <Text style={styles.newRecord}>🏆 NEW HIGH SCORE! 🏆</Text>
            )}

            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>Final Score</Text>
              <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>
            </View>

            {!isNewHighScore && highScore > 0 && (
              <Text style={styles.previousBest}>
                Previous Best: {highScore.toLocaleString()}
              </Text>
            )}

            <View style={styles.actions}>
              <TouchableOpacity style={styles.primaryBtn} onPress={onNewGame}>
                <Text style={styles.primaryBtnText}>🎮 Play Again</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryBtn} onPress={onBackToHome}>
                <Text style={styles.secondaryBtnText}>🏠 Back to Menu</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};