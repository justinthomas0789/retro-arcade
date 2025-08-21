import React, { createContext, useContext, useState, useEffect } from 'react';
import { Audio } from 'expo-av';

interface AudioContextType {
  soundEnabled: boolean;
  musicEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  setMusicEnabled: (enabled: boolean) => void;
  playSound: (soundName: string) => void;
  playMusic: (musicName: string) => void;
  stopMusic: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [musicSound, setMusicSound] = useState<Audio.Sound | null>(null);
  const [soundCache, setSoundCache] = useState<Map<string, Audio.Sound>>(new Map());

  useEffect(() => {
    return () => {
      // Cleanup audio resources
      musicSound?.unloadAsync();
      soundCache.forEach(sound => sound.unloadAsync());
    };
  }, []);

  const playSound = async (soundName: string) => {
    if (!soundEnabled) return;

    try {
      let sound = soundCache.get(soundName);
      if (!sound) {
        // Load sound files - you'd have actual audio files here
        const soundMap: { [key: string]: any } = {
          'move': require('../../assets/sounds/move.wav'),
          'rotate': require('../../assets/sounds/rotate.wav'),
          'drop': require('../../assets/sounds/drop.wav'),
          'line': require('../../assets/sounds/line.wav'),
          'gameOver': require('../../assets/sounds/game-over.wav'),
        };

        if (soundMap[soundName]) {
          const { sound: loadedSound } = await Audio.Sound.createAsync(soundMap[soundName]);
          setSoundCache(prev => new Map(prev.set(soundName, loadedSound)));
          sound = loadedSound;
        }
      }

      if (sound) {
        await sound.replayAsync();
      }
    } catch (error) {
      console.error('Failed to play sound:', error);
    }
  };

  const playMusic = async (musicName: string) => {
    if (!musicEnabled) return;

    try {
      if (musicSound) {
        await musicSound.unloadAsync();
      }

      const musicMap: { [key: string]: any } = {
        'background': require('../../assets/music/background.mp3'),
        'menu': require('../../assets/music/menu.mp3'),
      };

      if (musicMap[musicName]) {
        const { sound } = await Audio.Sound.createAsync(
          musicMap[musicName],
          { isLooping: true, volume: 0.3 }
        );
        setMusicSound(sound);
        await sound.playAsync();
      }
    } catch (error) {
      console.error('Failed to play music:', error);
    }
  };

  const stopMusic = async () => {
    if (musicSound) {
      await musicSound.stopAsync();
      await musicSound.unloadAsync();
      setMusicSound(null);
    }
  };

  return (
    <AudioContext.Provider value={{
      soundEnabled,
      musicEnabled,
      setSoundEnabled,
      setMusicEnabled,
      playSound,
      playMusic,
      stopMusic,
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
};
