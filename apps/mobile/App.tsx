import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PlayerProfile } from '@retro-arcade/game-engine';

import { HomeScreen } from './src/screens/HomeScreen';
import { GameplayScreen } from './src/screens/GameplayScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { AudioProvider } from './src/contexts/AudioContext';
import { AdProvider } from './src/contexts/AdContext';

const Stack = createNativeStackNavigator();

// Mobile Storage Implementation
class MobileGameStorage {
  private static readonly STORAGE_KEY = 'retro-arcade-mobile';

  static async savePlayerProfile(profile: PlayerProfile): Promise<void> {
    try {
      const data = await this.getData();
      data.profile = profile;
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save player profile:', error);
    }
  }

  static async getPlayerProfile(): Promise<PlayerProfile | null> {
    try {
      const data = await this.getData();
      return data.profile || null;
    } catch (error) {
      console.error('Failed to get player profile:', error);
      return null;
    }
  }

  static async saveHighScore(gameId: string, score: number): Promise<void> {
    try {
      const data = await this.getData();
      if (!data.highScores) data.highScores = {};
      
      if (!data.highScores[gameId] || data.highScores[gameId] < score) {
        data.highScores[gameId] = score;
        await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      }
    } catch (error) {
      console.error('Failed to save high score:', error);
    }
  }

  static async getHighScore(gameId: string): Promise<number> {
    try {
      const data = await this.getData();
      return data.highScores?.[gameId] || 0;
    } catch (error) {
      console.error('Failed to get high score:', error);
      return 0;
    }
  }

  private static async getData(): Promise<any> {
    try {
      const stored = await AsyncStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }
}

function AppContent() {
  const { theme } = useTheme();
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null);

  useEffect(() => {
    loadPlayerProfile();
  }, []);

  const loadPlayerProfile = async () => {
    const profile = await MobileGameStorage.getPlayerProfile();
    if (profile) {
      setPlayerProfile(profile);
    } else {
      const defaultProfile: PlayerProfile = {
        name: 'Player',
        avatar: '🎮',
        totalScore: 0,
        gamesPlayed: 0,
        achievements: [],
        settings: {
          soundEnabled: true,
          musicEnabled: true,
          vibrationEnabled: true,
          difficulty: 'normal',
          theme: 'retro'
        }
      };
      setPlayerProfile(defaultProfile);
      await MobileGameStorage.savePlayerProfile(defaultProfile);
    }
  };

  return (
    <NavigationContainer>
      <StatusBar style={theme === 'classic' ? 'light' : 'auto'} />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#000' }
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Game" component={GameplayScreen} />
        <Stack.Screen name="Settings">
          {(props) => (
            <SettingsScreen 
              {...props} 
              playerProfile={playerProfile}
              setPlayerProfile={setPlayerProfile}
              storage={MobileGameStorage}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AudioProvider>
            <AdProvider>
              <AppContent />
            </AdProvider>
          </AudioProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}