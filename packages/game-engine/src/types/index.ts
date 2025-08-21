import EventEmitter from 'events';

export interface GameConfig {
    id: string;
    name: string;
    description: string;
    thumbnail: string;
    category: 'puzzle' | 'action' | 'arcade';
    difficulty: 'easy' | 'medium' | 'hard';
    controls: GameControl[];
    highScore?: number;
    lastPlayed?: Date;
  }
  
  export interface GameControl {
    action: string;
    keys: string[];
    touch?: TouchControl;
  }
  
  export interface TouchControl {
    type: 'tap' | 'swipe' | 'hold';
    area: 'left' | 'right' | 'center' | 'full';
  }
  
  export interface GameState {
    score: number;
    level: number;
    lives: number;
    isPlaying: boolean;
    isPaused: boolean;
    gameOver: boolean;
    timeElapsed: number;
  }
  
  export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
    unlockedAt?: Date;
  }
  
  export interface GameSettings {
    soundEnabled: boolean;
    musicEnabled: boolean;
    vibrationEnabled: boolean;
    difficulty: 'easy' | 'normal' | 'hard';
    theme: 'retro' | 'neon' | 'classic';
  }

export interface PlayerProfile {
    name: string;
    avatar: string;
    totalScore: number;
    gamesPlayed: number;
    achievements: Achievement[];
    settings: GameSettings;
  }
  
  export interface GameData {
    profile?: PlayerProfile;
    highScores?: { [gameId: string]: number };
    progress?: { [gameId: string]: any };
  }

  export interface IGame extends EventEmitter {
    readonly state: GameState;
    canvas: HTMLCanvasElement | null;
  
    start(): void;
    pause(): void;
    stop(): void;
    destroy(): void;
    initializeCanvas(canvas: HTMLCanvasElement, width: number, height: number): void;
  
    // Optional methods for specific game interactions
    handleAction?(action: string, options?: any): void;
    drawNextPiece?(canvas: HTMLCanvasElement, width: number, height: number): void;
  }
  
  export interface IGameConstructor {
      new (): IGame;
      config: GameConfig;
  }
