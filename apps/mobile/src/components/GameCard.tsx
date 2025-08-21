import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { GameConfig } from '@retro-arcade/game-engine';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

interface GameCardProps {
  game: GameConfig;
}

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const handlePress = () => {
    navigation.navigate('Game' as never, { gameId: game.id } as never);
  };

  const styles = getCardStyles(colors);

  return (
    <TouchableOpacity onPress={handlePress} style={styles.card}>
      <LinearGradient
        colors={[colors.surface, colors.background]}
        style={styles.gradient}
      >
        {/* Game Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>
            {game.id === 'block-stack' ? '🧱' : '🎮'}
          </Text>
        </View>

        {/* Game Info */}
        <View style={styles.info}>
          <Text style={styles.name}>{game.name}</Text>
          <Text style={styles.description}>{game.description}</Text>
          
          <View style={styles.meta}>
            <View style={[styles.badge, { backgroundColor: getDifficultyColor(game.difficulty) }]}>
              <Text style={styles.badgeText}>{game.difficulty}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
              <Text style={styles.badgeText}>{game.category}</Text>
            </View>
          </View>
        </View>

        {/* Play Button */}
        <View style={styles.playButton}>
          <Text style={styles.playText}>▶️ PLAY</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};
