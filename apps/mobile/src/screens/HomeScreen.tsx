import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { games, GameConfig } from '@retro-arcade/game-engine';
import { useTheme } from '../contexts/ThemeContext';
import { GameCard } from '../components/GameCard';
import { BannerAd } from '../components/BannerAd';

const { width } = Dimensions.get('window');
const GAMES: GameConfig[] = Object.values(games).map(gameClass => gameClass.config);

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors, theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'puzzle', 'action', 'arcade'];
  const filteredGames = selectedCategory === 'all' 
    ? GAMES 
    : GAMES.filter(game => game.category === selectedCategory);

  const styles = getStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.background, colors.surface]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>RETRO ARCADE</Text>
            <Text style={styles.subtitle}>Classic Games Reimagined</Text>
          </View>
          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => navigation.navigate('Settings' as never)}
          >
            <Ionicons name="settings-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Category Navigation */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryNav}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryBtn,
                selectedCategory === category && styles.activeCategoryBtn
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.activeCategoryText
                ]}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Games Grid */}
        <ScrollView
          style={styles.gamesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gamesContent}
        >
          <View style={styles.gamesGrid}>
            {filteredGames.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </View>

          {/* Banner Ad */}
          <BannerAd />

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © 2024 Retro Arcade - Bringing back the classics
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};