import React from 'react';
import './GameOverModal.css';

interface GameOverModalProps {
  score: number;
  highScore: number;
  onNewGame: () => void;
  onBackToHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  highScore,
  onNewGame,
  onBackToHome
}) => {
  const isNewHighScore = score > highScore;

  return (
    <div className="modal-overlay">
      <div className="game-over-modal">
        <div className="modal-header">
          <h2>Game Over!</h2>
          {isNewHighScore && (
            <div className="new-record">🏆 NEW HIGH SCORE! 🏆</div>
          )}
        </div>
        
        <div className="modal-body">
          <div className="final-score">
            <span className="score-label">Final Score</span>
            <span className="score-value">{score.toLocaleString()}</span>
          </div>
          
          {!isNewHighScore && highScore > 0 && (
            <div className="previous-best">
              <span>Previous Best: {highScore.toLocaleString()}</span>
            </div>
          )}
        </div>
        
        <div className="modal-actions">
          <button className="primary-btn" onClick={onNewGame}>
            🎮 Play Again
          </button>
          <button className="secondary-btn" onClick={onBackToHome}>
            🏠 Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};