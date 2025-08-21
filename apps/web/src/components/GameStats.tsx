import React from 'react';
import './GameStats.css';

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
  highScore
}) => {
  return (
    <div className="game-stats">
      <div className="stat-item">
        <label>Score</label>
        <span className="stat-value">{score.toLocaleString()}</span>
      </div>
      
      <div className="stat-item">
        <label>Level</label>
        <span className="stat-value">{level}</span>
      </div>
      
      <div className="stat-item">
        <label>Lines</label>
        <span className="stat-value">{lines}</span>
      </div>
      
      {highScore > 0 && (
        <div className="stat-item high-score">
          <label>🏆 High Score</label>
          <span className="stat-value">{highScore.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
};