import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlayerProfile, GameStorage } from '@retro-arcade/game-engine';
import './SettingsScreen.css';

interface SettingsScreenProps {
  playerProfile: PlayerProfile | null;
  setPlayerProfile: (profile: PlayerProfile) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  playerProfile,
  setPlayerProfile
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'gameplay' | 'audio'>('profile');

  if (!playerProfile) return <div>Loading...</div>;

  const updateProfile = (updates: Partial<PlayerProfile>) => {
    const updatedProfile = { ...playerProfile, ...updates };
    setPlayerProfile(updatedProfile);
    GameStorage.savePlayerProfile(updatedProfile);
  };

  const updateSettings = (updates: Partial<PlayerProfile['settings']>) => {
    updateProfile({
      settings: { ...playerProfile.settings, ...updates }
    });
  };

  return (
    <div className="settings-screen">
      <header className="settings-header">
        <Link to="/" className="back-btn">← Back to Games</Link>
        <h1>Settings</h1>
      </header>

      <div className="settings-layout">
        <nav className="settings-nav">
          <button
            className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Profile
          </button>
          <button
            className={`nav-btn ${activeTab === 'gameplay' ? 'active' : ''}`}
            onClick={() => setActiveTab('gameplay')}
          >
            🎮 Gameplay
          </button>
          <button
            className={`nav-btn ${activeTab === 'audio' ? 'active' : ''}`}
            onClick={() => setActiveTab('audio')}
          >
            🔊 Audio
          </button>
        </nav>

        <main className="settings-content">
          {activeTab === 'profile' && (
            <div className="settings-panel">
              <h2>Player Profile</h2>
              
              <div className="profile-section">
                <div className="avatar-selector">
                  <label>Avatar</label>
                  <div className="avatar-options">
                    {['🎮', '👾', '🕹️', '🎯', '⚡', '🔥', '💎', '🌟'].map(emoji => (
                      <button
                        key={emoji}
                        className={`avatar-btn ${playerProfile.avatar === emoji ? 'selected' : ''}`}
                        onClick={() => updateProfile({ avatar: emoji })}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="playerName">Player Name</label>
                  <input
                    id="playerName"
                    type="text"
                    value={playerProfile.name}
                    onChange={(e) => updateProfile({ name: e.target.value })}
                    maxLength={20}
                  />
                </div>

                <div className="stats-display">
                  <div className="stat-item">
                    <span className="stat-label">Total Score</span>
                    <span className="stat-value">{playerProfile.totalScore.toLocaleString()}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Games Played</span>
                    <span className="stat-value">{playerProfile.gamesPlayed}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Achievements</span>
                    <span className="stat-value">{playerProfile.achievements.filter(a => a.unlocked).length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gameplay' && (
            <div className="settings-panel">
              <h2>Gameplay Settings</h2>
              
              <div className="setting-group">
                <label>Theme</label>
                <div className="theme-selector">
                  {[
                    { value: 'retro', label: 'Retro Green', color: '#00ff00' },
                    { value: 'neon', label: 'Neon Blue', color: '#00ffff' },
                    { value: 'classic', label: 'Classic White', color: '#ffffff' }
                  ].map(theme => (
                    <button
                      key={theme.value}
                      className={`theme-btn ${playerProfile.settings.theme === theme.value ? 'selected' : ''}`}
                      onClick={() => updateSettings({ theme: theme.value as any })}
                      style={{ borderColor: theme.color }}
                    >
                      <span style={{ color: theme.color }}>●</span>
                      {theme.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="setting-group">
                <label>Difficulty</label>
                <select
                  value={playerProfile.settings.difficulty}
                  onChange={(e) => updateSettings({ difficulty: e.target.value as any })}
                  className="difficulty-select"
                >
                  <option value="easy">Easy - Slower pace</option>
                  <option value="normal">Normal - Standard pace</option>
                  <option value="hard">Hard - Faster pace</option>
                </select>
              </div>

              <div className="setting-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={playerProfile.settings.vibrationEnabled}
                    onChange={(e) => updateSettings({ vibrationEnabled: e.target.checked })}
                  />
                  <span className="checkmark"></span>
                  Vibration (Mobile)
                </label>
              </div>
            </div>
          )}

          {activeTab === 'audio' && (
            <div className="settings-panel">
              <h2>Audio Settings</h2>
              
              <div className="setting-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={playerProfile.settings.soundEnabled}
                    onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
                  />
                  <span className="checkmark"></span>
                  Sound Effects
                </label>
              </div>

              <div className="setting-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={playerProfile.settings.musicEnabled}
                    onChange={(e) => updateSettings({ musicEnabled: e.target.checked })}
                  />
                  <span className="checkmark"></span>
                  Background Music
                </label>
              </div>

              <div className="setting-group">
                <label>Master Volume</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="70"
                  className="volume-slider"
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};