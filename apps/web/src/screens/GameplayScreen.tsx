import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GameStorage, getGame, IGame, GameState, GameConfig } from '@retro-arcade/game-engine';
import { GameControls } from '../components/GameControls';
import { GameStats } from '../components/GameStats';
import { GameOverModal } from '../components/GameOverModal';
import './GameplayScreen.css';

export const GameplayScreen: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nextPieceCanvasRef = useRef<HTMLCanvasElement>(null);
  const nextPieceAppRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<IGame | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState<number>(0);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (gameContainerRef.current && canvasRef.current) {
      const containerWidth = gameContainerRef.current.offsetWidth;
      const containerHeight = gameContainerRef.current.offsetHeight;

      const GameClass = getGame(gameId!);
      if (!GameClass) return;

      const aspectRatio = (GameClass.config as any).aspectRatio || 10 / 20; 
      let gameWidth = containerWidth;
      let gameHeight = containerWidth / aspectRatio;

      if (gameHeight > containerHeight) {
        gameHeight = containerHeight;
        gameWidth = containerHeight * aspectRatio;
      }

      canvasRef.current.width = gameWidth;
      canvasRef.current.height = gameHeight;
    }
  }, [gameId]);

  useEffect(() => {
    const GameClass = getGame(gameId!);
    if (!GameClass || !canvasRef.current) {
      return;
    }

    setGameConfig(GameClass.config);

    const game = new GameClass();
    gameRef.current = game;

    try {
      (game as any).initializeCanvas(canvasRef.current, canvasRef.current.width, canvasRef.current.height);
    } catch (error) {
      console.error('Failed to initialize Canvas:', error);
      return;
    }

    const handleGameStateChange = (state: GameState) => {
      setGameState(state);
      
      if (game.drawNextPiece && nextPieceCanvasRef.current) {
        game.drawNextPiece(nextPieceCanvasRef.current, 80, 80);
      }
      
      if (state.gameOver && !showGameOver) {
        setFinalScore(state.score); // Preserve the final score
        setShowGameOver(true);
        const currentHigh = GameStorage.getHighScore(gameId!);
        if (state.score > currentHigh) {
          GameStorage.saveHighScore(gameId!, state.score);
        }
      }
    };

    game.on('gameStateChanged', handleGameStateChange);
    setGameState(game.state);

    return () => {
      game.off('gameStateChanged', handleGameStateChange);
      game.destroy();
    };
  }, [gameId, showGameOver]);

  const handleGameAction = (action: string) => {
    if (gameRef.current && gameRef.current.handleAction) {
        gameRef.current.handleAction(action);
    }
  };

  const handleNewGame = () => {
    if (gameRef.current) {
        gameRef.current.start();
        setShowGameOver(false);
    }
  };

  if (!gameId || !getGame(gameId)) {
    return <div>Game not found</div>;
  }

  const highScore = GameStorage.getHighScore(gameId);

  return (
    <div className="gameplay-screen">
      <header className="gameplay-header">
        <Link to="/" className="back-btn">← Back</Link>
        <h1>{gameConfig?.name}</h1>
        <button 
          className="help-btn"
          onClick={() => setShowInstructions(true)}
        >
          ? Help
        </button>
      </header>

      <div className="game-layout">
        <aside className="game-sidebar">
          <GameStats 
            score={gameState?.score || 0}
            level={gameState?.level || 1}
            lines={(gameState as any)?.linesCleared || 0} // Cast to any for now
            highScore={highScore}
          />
          
          {gameRef.current?.drawNextPiece && (
            <div className="next-piece-display">
              <h3>Next Piece</h3>
              <canvas ref={nextPieceCanvasRef} width="80" height="80" className="next-canvas"></canvas>
            </div>
          )}
        </aside>

        <main className="game-main" ref={gameContainerRef}>
          <div className="game-container">
            <canvas
              ref={canvasRef}
              className="game-canvas"
            />
            
            {(!gameState?.isPlaying && !showGameOver) && (
              <div className="game-overlay">
                <button className="start-btn" onClick={handleNewGame}>
                  Start Game
                </button>
              </div>
            )}

            {gameState?.isPaused && (
              <div className="game-overlay">
                <div className="pause-screen">
                  <h2>PAUSED</h2>
                  <button onClick={() => handleGameAction('pause')}>Resume</button>
                  <button onClick={handleNewGame}>New Game</button>
                </div>
              </div>
            )}
          </div>

          <GameControls 
            onMove={(direction) => handleGameAction(direction === 'left' ? 'moveLeft' : 'moveRight')}
            onRotate={() => handleGameAction('rotate')}
            onDrop={() => handleGameAction('hardDrop')}
          />
        </main>
      </div>

      {showInstructions && gameConfig && (
        <div className="modal-overlay" onClick={() => setShowInstructions(false)}>
          <div className="instructions-modal" onClick={e => e.stopPropagation()}>
            <h2>How to Play {gameConfig.name}</h2>
            <div className="instructions-content">
              <p>{gameConfig.description}</p>
              <h3>Controls:</h3>
              <ul>
                {gameConfig.controls.map((control, index) => (
                  <li key={index}>
                    <strong>{control.action}:</strong> {control.keys.join(', ')}
                  </li>
                ))}
              </ul>
            </div>
            <button onClick={() => setShowInstructions(false)}>Close</button>
          </div>
        </div>
      )}

      {showGameOver && (
        <GameOverModal
          score={finalScore}
          highScore={highScore}
          onNewGame={handleNewGame}
          onBackToHome={() => window.location.href = '/'}
        />
      )}
    </div>
  );
};
