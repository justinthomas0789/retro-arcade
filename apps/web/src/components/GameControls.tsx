import React from 'react';
import './GameControls.css';

interface GameControlsProps {
  onMove: (direction: 'left' | 'right') => void;
  onRotate: () => void;
  onDrop: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onMove,
  onRotate,
  onDrop
}) => {
  return (
    <div className="game-controls">
      <div className="control-row">
        <button 
          className="control-btn"
          onMouseDown={() => onMove('left')}
          onTouchStart={() => onMove('left')}
        >
          ←
        </button>
        <button 
          className="control-btn rotate-btn"
          onMouseDown={onRotate}
          onTouchStart={onRotate}
        >
          ↻
        </button>
        <button 
          className="control-btn"
          onMouseDown={() => onMove('right')}
          onTouchStart={() => onMove('right')}
        >
          →
        </button>
      </div>
      <div className="control-row">
        <button 
          className="control-btn drop-btn"
          onMouseDown={onDrop}
          onTouchStart={onDrop}
        >
          ↓ DROP
        </button>
      </div>
    </div>
  );
};