import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GameCard } from '../components/GameCard';
import { games, GameConfig } from '@retro-arcade/game-engine';
import './HomeScreen.css';

const GAMES: GameConfig[] = Object.values(games).map(gameClass => gameClass.config);

export const HomeScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const categories = ['all', 'puzzle', 'action', 'arcade'];
  
  const filteredGames = selectedCategory === 'all' 
    ? GAMES 
    : GAMES.filter(game => game.category === selectedCategory);
  return (
    <div className="home-screen">
      <header className="home-header">
        <h1 className="home-title">
          <span className="retro-text">RETRO ARCADE</span>
          <span className="subtitle">Classic Games Reimagined</span>
        </h1>
        <Link to="/settings" className="settings-btn">
          ⚙️ Settings
        </Link>
      </header>

      <nav className="category-nav">
        {categories.map(category => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </nav>

      <main className="games-grid">
        {filteredGames.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </main>

      <footer className="home-footer">
        <p>© 2024 Retro Arcade - Bringing back the classics</p>
      </footer>
    </div>
  );
};