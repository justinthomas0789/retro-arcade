import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as PIXI from 'pixi.js';

import { getGame, IGame, GameState, GameConfig, GameStorage } from '@retro-arcade/game-engine';
import { useTheme } from '../contexts/ThemeContext';
import { useAudio } from '../contexts/AudioContext';
import { TouchControls } from '../components/TouchControls';
import { GameStats } from '../components/GameStats';
import { GameOverModal } from '../components/GameOverModal';
import { InterstitialAd } from '../components/InterstitialAd';
import Canvas from 'react-native-canvas';
import { getGameplayStyles } from '../utils/getStyles';

export const GameplayScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();
  const { playSound, playMusic, stopMusic } = useAudio();
  
  const gameRef = useRef<IGame | null>(null);
  const canvasRef = useRef<any>(null);
  const nextPieceCanvasRef = useRef<any>(null);
  const gameContainerRef = useRef<View>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showInterstitial, setShowInterstitial] = useState(false);
  
  const gameId = (route.params as any)?.gameId || 'block-stack';

  useEffect(() => {
    const GameClass = getGame(gameId);
    if (!GameClass || !canvasRef.current) {
      return;
    }

    setGameConfig(GameClass.config);

    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    const headerHeight = 60; 
    const sidebarWidth = 120; 

    const availableWidth = screenWidth - sidebarWidth;
    const availableHeight = screenHeight - headerHeight;

    const aspectRatio = (GameClass.config as any).aspectRatio || 10 / 20;
    let gameWidth = availableWidth;
    let gameHeight = availableWidth / aspectRatio;

    if (gameHeight > availableHeight) {
      gameHeight = availableHeight;
      gameWidth = availableHeight * aspectRatio;
    }

    canvasRef.current.width = gameWidth;
    canvasRef.current.height = gameHeight;

    const game = new GameClass();
    gameRef.current = game;

    game.initializePixiApp(canvasRef.current, gameWidth, gameHeight);

    let nextPieceApp: PIXI.Application | null = null;
    if (game.drawNextPiece && nextPieceCanvasRef.current) {
        nextPieceApp = new PIXI.Application({
            view: nextPieceCanvasRef.current,
            width: 80,
            height: 80,
            background: 0x000011,
        });
    }

    const handleGameStateChange = (state: GameState) => {
      setGameState(state);
      if (nextPieceApp && game.drawNextPiece) {
          nextPieceApp.stage.removeChildren();
          const nextPieceGraphics = game.drawNextPiece(80, 80);
          if(nextPieceGraphics) {
            nextPieceApp.stage.addChild(nextPieceGraphics);
          }
      }
      if (state.gameOver && !showGameOver) {
        setShowGameOver(true);
        const currentHigh = GameStorage.getHighScore(gameId!);
        if (state.score > currentHigh) {
          GameStorage.saveHighScore(gameId!, state.score);
        }
      }
    };

    game.on('gameStateChanged', handleGameStateChange);
    setGameState(game.state);
    
    // Introduce a small delay before starting the game
    const startGameTimeout = setTimeout(() => {
      game.start();
      playMusic('background');
    }, 50); // 50ms delay

    return () => {
      clearTimeout(startGameTimeout);
      stopMusic();
      game.off('gameStateChanged', handleGameStateChange);
      game.destroy();
      if (nextPieceApp) {
        nextPieceApp.destroy();
      }
    };
  }, [gameId, showGameOver]);

  const handleGameAction = (action: string) => {
    if (gameRef.current?.handleAction) {
        if(gameState?.isPlaying && !gameState?.isPaused) {
            playSound('move');
            Vibration.vibrate(50);
        }
        gameRef.current.handleAction(action);
    }
  };

  const handleNewGame = () => {
    if (gameRef.current) {
      gameRef.current.start();
      setShowGameOver(false);
    }
  };

  const styles = getGameplayStyles(colors);

  if (!gameConfig) {
      return <View><Text>Loading...</Text></View>
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        
        <Text style={styles.title}>{gameConfig.name}</Text>
        
        <TouchableOpacity
          style={styles.helpBtn}
          onPress={() => setShowInstructions(true)}
        >
          <Ionicons name="help-circle-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.gameLayout}>
        <View style={styles.sidebar}>
          <GameStats
            score={gameState?.score || 0}
            level={gameState?.level || 1}
            lines={(gameState as any)?.linesCleared || 0}
            highScore={GameStorage.getHighScore(gameId)}
          />
          {gameRef.current?.drawNextPiece && (
            <View style={styles.nextPieceDisplay}>
              <Text style={styles.nextPieceText}>Next Piece</Text>
              <Canvas ref={nextPieceCanvasRef} style={styles.nextPieceCanvas} />
            </View>
          )}
        </View>

        <View style={styles.gameArea} ref={gameContainerRef}>
          <Canvas ref={canvasRef} style={styles.gameCanvas} />

            {gameState?.isPaused && (
              <View style={styles.pauseOverlay}>
                <Text style={styles.pauseText}>PAUSED</Text>
                <TouchableOpacity
                  style={styles.resumeBtn}
                  onPress={() => handleGameAction('pause')}
                >
                  <Text style={styles.resumeText}>Resume</Text>
                </TouchableOpacity>
              </View>
            )}
        </View>
      </View>

      <TouchControls
        onAction={handleGameAction}
        disabled={!gameState?.isPlaying}
      />

      <Modal
        visible={showInstructions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowInstructions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.instructionsModal}>
            <Text style={styles.modalTitle}>How to Play</Text>
            <Text style={styles.modalText}>
              {gameConfig.description}
            </Text>
            <View style={styles.controlsList}>
              {gameConfig.controls.map((control, index) => (
                <Text key={index} style={styles.controlItem}>
                  • {control.action}
                </Text>
              ))}
            </View>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setShowInstructions(false)}
            >
              <Text style={styles.closeBtnText}>Got It!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {showGameOver && (
        <GameOverModal
          score={gameState?.score || 0}
          highScore={GameStorage.getHighScore(gameId)}
          onNewGame={() => {
            setShowGameOver(false);
            handleNewGame();
          }}
          onBackToHome={() => navigation.goBack()}
        />
      )}

      <InterstitialAd
        visible={showInterstitial}
        onClose={() => setShowInterstitial(false)}
      />
    </SafeAreaView>
  );
};