import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface GameStatsProps {
  score: number;
  level: number;
  lines: number;
  highScore: number;
}

export const GameStats: React.FC<GameStatsProps> = ({
  score,
  level,
  lines,
  highScore,
}) => {
  const { colors } = useTheme();
  const styles = getStatsStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.statItem}>
        <Text style={styles.label}>Score</Text>
        <Text style={styles.value}>{score.toLocaleString()}</Text>
      </View>

      <View style={styles.statItem}>
        <Text style={styles.label}>Level</Text>
        <Text style={styles.value}>{level}</Text>
      </View>

      <View style={styles.statItem}>
        <Text style={styles.label}>Lines</Text>
        <Text style={styles.value}>{lines}</Text>
      </View>

      {highScore > 0 && (
        <View style={[styles.statItem, styles.highScore]}>
          <Text style={styles.label}>🏆 High Score</Text>
          <Text style={[styles.value, styles.highScoreValue]}>
            {highScore.toLocaleString()}
          </Text>
        </View>
      )}
    </View>
  );
};