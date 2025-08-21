import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomeScreen } from './screens/HomeScreen';
import { GameplayScreen } from './screens/GameplayScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { GameStorage, PlayerProfile } from '@retro-arcade/game-engine';
import './App.css';

function App() {
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null);

  useEffect(() => {
    const profile = GameStorage.getPlayerProfile();
    if (profile) {
      setPlayerProfile(profile);
    } else {
      // Create default profile
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
      GameStorage.savePlayerProfile(defaultProfile);
    }
  }, []);

  return (
    <div className="App" data-theme={playerProfile?.settings.theme || 'retro'}>
      <Router>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/game/:gameId" element={<GameplayScreen />} />
          <Route path="/settings" element={<SettingsScreen playerProfile={playerProfile} setPlayerProfile={setPlayerProfile} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;