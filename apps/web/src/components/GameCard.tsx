import React from 'react';
import { Link } from 'react-router-dom';
import { GameConfig, GameStorage } from '@retro-arcade/game-engine';
import './GameCard.css';

interface GameCardProps {
  game: GameConfig;
}

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const highScore = GameStorage.getHighScore(game.id);
  console.log(game);
  const difficultyColors = {
    easy: '#4ade80',
    medium: '#fbbf24',
    hard: '#ef4444'
  };

  return (
    <Link to={`/game/${game.id}`} className="game-card">
      <div className="game-thumbnail">
        <div className="game-icon">
          {game.id === 'block-stack' ? '🧱' : '🎮'}
        </div>
      </div>
      
      <div className="game-info">
        <h3 className="game-name">{game.name}</h3>
        <p className="game-description">{game.description}</p>
        
        <div className="game-meta">
          <span 
            className="difficulty-badge"
            style={{ backgroundColor: difficultyColors[game.difficulty] }}
          >
            {game.difficulty}
          </span>
          <span className="category-badge">{game.category}</span>
        </div>
        
        {highScore > 0 && (
          <div className="high-score">
            🏆 Best: {highScore.toLocaleString()}
          </div>
        )}
      </div>
      
      <div className="play-overlay">
        <span className="play-button">▶️ PLAY</span>
      </div>
    </Link>
  );
};