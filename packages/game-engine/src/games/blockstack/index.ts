import EventEmitter from 'events';
import { GameConfig, GameState, IGame } from '../../types';

const BLOCK_STACK_CONFIG: GameConfig = {
  id: 'block-stack',
  name: 'Block Stack',
  description: 'Classic falling blocks puzzle game',
  thumbnail: '/images/block-stack.png',
  category: 'puzzle',
  difficulty: 'medium',
  controls: [
    { action: 'moveLeft', keys: ['ArrowLeft', 'A'], touch: { type: 'tap', area: 'left' } },
    { action: 'moveRight', keys: ['ArrowRight', 'D'], touch: { type: 'tap', area: 'right' } },
    { action: 'rotate', keys: ['ArrowUp', 'W'], touch: { type: 'tap', area: 'center' } },
    { action: 'softDrop', keys: ['ArrowDown', 'S'], touch: { type: 'swipe', area: 'center' } },
    { action: 'hardDrop', keys: ['Space'], touch: { type: 'hold', area: 'center' } },
    { action: 'pause', keys: ['Escape', 'P'], touch: { type: 'tap', area: 'full' } }
  ]
};

export interface BlockStackPiece {
  shape: number[][];
  color: string;
  x: number;
  y: number;
}

export interface BlockStackState extends GameState {
  board: (string | null)[][];
  currentPiece: BlockStackPiece | null;
  nextPiece: BlockStackPiece | null;
  linesCleared: number;
  dropSpeed: number;
}

export class BlockStackGame extends EventEmitter implements IGame {
  public static config = BLOCK_STACK_CONFIG;

  public canvas: HTMLCanvasElement | null;
  private ctx: CanvasRenderingContext2D | null;
  private _state: BlockStackState;
  private lastTime = 0;
  private dropTime = 0;
  private animationFrameId: number | null = null;
  private keyEventListener: (e: KeyboardEvent) => void;
  
  private readonly BOARD_WIDTH = 10;
  private readonly BOARD_HEIGHT = 20;
  
  private readonly PIECES = [
    { shape: [[1,1,1,1]], color: '#00FFFF' }, // I-piece -> Line
    { shape: [[1,1],[1,1]], color: '#FFFF00' }, // O-piece -> Square  
    { shape: [[0,1,0],[1,1,1]], color: '#800080' }, // T-piece -> Tee
    { shape: [[0,1,1],[1,1,0]], color: '#00FF00' }, // S-piece -> Zigzag
    { shape: [[1,1,0],[0,1,1]], color: '#FF0000' }, // Z-piece -> ReverseZig
    { shape: [[1,0,0],[1,1,1]], color: '#FF7F00' }, // J-piece -> LeftL
    { shape: [[0,0,1],[1,1,1]], color: '#0000FF' }  // L-piece -> RightL
  ];

  constructor() {
    super();
    this.canvas = null;
    this.ctx = null;
    
    this._state = this.initializeState();
    this.keyEventListener = this.handleKeyDown.bind(this);
    this.setupEventListeners();
  }

  public initializeCanvas(canvas: HTMLCanvasElement, width: number, height: number): void {
    console.log('initializeCanvas called', { canvas, width, height });
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    if (!this.ctx) {
      throw new Error('Failed to get 2D context from canvas');
    }
    
    canvas.width = width;
    canvas.height = height;
    
    console.log('Canvas initialized successfully', { canvas: this.canvas, ctx: this.ctx });
  }

  public get state(): BlockStackState {
    return { ...this._state };
  }

  private initializeState(): BlockStackState {
    return {
      score: 0,
      level: 1,
      lives: 1,
      isPlaying: false,
      isPaused: false,
      gameOver: false,
      timeElapsed: 0,
      board: Array(this.BOARD_HEIGHT).fill(null).map(() => Array(this.BOARD_WIDTH).fill(null)),
      currentPiece: null,
      nextPiece: null,
      linesCleared: 0,
      dropSpeed: 1000
    };
  }

  private setupEventListeners(): void {
    document.addEventListener('keydown', this.keyEventListener);
  }

  private removeEventListeners(): void {
    document.removeEventListener('keydown', this.keyEventListener);
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    if (!this._state.isPlaying || this._state.isPaused) return;
    
    const gameKeys = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' ', 'Escape', 'a', 'A', 'd', 'D', 's', 'S', 'w', 'W', 'p', 'P'];
    if (gameKeys.includes(e.key)) {
      e.preventDefault();
    }
    
    switch(e.key) {
      case 'ArrowLeft':
      case 'a':
      case 'A':
        this.handleAction('moveLeft');
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        this.handleAction('moveRight');
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        this.handleAction('softDrop');
        break;
      case 'ArrowUp':
      case 'w':
      case 'W':
        this.handleAction('rotate');
        break;
      case ' ':
        this.handleAction('hardDrop');
        break;
      case 'Escape':
      case 'p':
      case 'P':
        this.handleAction('pause');
        break;
    }
  };

  public handleAction(action: string): void {
    if (!this._state.isPlaying || this._state.isPaused) {
        if(action === 'pause') {
            this.pause();
        }
        return;
    }

    switch(action) {
        case 'moveLeft':
            this.movePiece(-1, 0);
            break;
        case 'moveRight':
            this.movePiece(1, 0);
            break;
        case 'softDrop':
            this.movePiece(0, 1);
            break;
        case 'rotate':
            this.rotatePiece();
            break;
        case 'hardDrop':
            this.hardDrop();
            break;
        case 'pause':
            this.pause();
            break;
    }
  }

  public start(): void {
    console.log('start called', { canvas: this.canvas, ctx: this.ctx });
    if (!this.canvas || !this.ctx) {
      console.error('Cannot start game: Canvas not initialized');
      return;
    }
    
    this.setState({ 
      ...this.initializeState(),
      isPlaying: true, 
    });
    
    this.spawnPiece();
    this.gameLoop();
  }

  public pause(): void {
    this.setState({ isPaused: !this._state.isPaused });
  }

  public stop(): void {
    this.setState({ isPlaying: false, gameOver: true });
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public destroy(): void {
    this.stop();
    this.removeEventListeners();
    this.canvas = null;
    this.ctx = null;
    this.removeAllListeners();
  }

  private gameLoop = (time: number = 0): void => {
    if (!this._state.isPlaying) {
      this.animationFrameId = null;
      return;
    }
    
    const deltaTime = time - this.lastTime;
    this.lastTime = time;
    
    if (!this._state.isPaused) {
      this.update(deltaTime);
      this.render();
    }
    
    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };

  private update(deltaTime: number): void {
    this.setState({ timeElapsed: this._state.timeElapsed + deltaTime });
    this.dropTime += deltaTime;
    
    if (this.dropTime > this._state.dropSpeed) {
      this.movePiece(0, 1);
      this.dropTime = 0;
    }
  }

  private render(): void {
    if (!this.canvas || !this.ctx) {
      return; 
    }
    
    // Clear canvas
    this.ctx.fillStyle = '#000011';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.drawBoard();
    
    if (this.state.currentPiece) {
      this.drawGhostPiece(this.state.currentPiece);
      this.drawPiece(this.state.currentPiece);
    }
  }

  private drawBoard(): void {
    if (!this.canvas || !this.ctx) return;
    
    const cellSize = Math.min(this.canvas.width / this.BOARD_WIDTH, this.canvas.height / this.BOARD_HEIGHT);
  
    for (let y = 0; y < this.BOARD_HEIGHT; y++) {
      for (let x = 0; x < this.BOARD_WIDTH; x++) {
        const cell = this.state.board[y][x];
        
        // Draw grid lines
        this.ctx.strokeStyle = '#333333';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
        
        // Draw filled cells
        if (cell) {
          this.ctx.fillStyle = cell;
          this.ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }
  }

  private drawPiece(piece: BlockStackPiece): void {
    if (!this.canvas || !this.ctx) return;
    
    const cellSize = Math.min(this.canvas.width / this.BOARD_WIDTH, this.canvas.height / this.BOARD_HEIGHT);
  
    this.ctx.fillStyle = piece.color;
    piece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell && this.ctx) {
          this.ctx.fillRect(
            (piece.x + x) * cellSize,
            (piece.y + y) * cellSize,
            cellSize,
            cellSize
          );
          
          // Draw border
          this.ctx.strokeStyle = '#000000';
          this.ctx.lineWidth = 1;
          this.ctx.strokeRect(
            (piece.x + x) * cellSize,
            (piece.y + y) * cellSize,
            cellSize,
            cellSize
          );
        }
      });
    });
  }

  private drawGhostPiece(piece: BlockStackPiece): void {
    if (!this.canvas || !this.ctx) return;
    
    const ghostPiece = { ...piece, shape: piece.shape.map(r => [...r]) };
    while (!this.checkCollision(ghostPiece, 0, 1)) {
      ghostPiece.y++;
    }
    
    const cellSize = Math.min(this.canvas.width / this.BOARD_WIDTH, this.canvas.height / this.BOARD_HEIGHT);

    this.ctx.strokeStyle = piece.color;
    this.ctx.lineWidth = 2;
    this.ctx.globalAlpha = 0.3;
    
    ghostPiece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell && this.ctx) {
          this.ctx.strokeRect(
            (ghostPiece.x + x) * cellSize,
            (ghostPiece.y + y) * cellSize,
            cellSize - 1,
            cellSize - 1
          );
        }
      });
    });
    
    this.ctx.globalAlpha = 1.0;
  }

  public drawNextPiece(canvas: HTMLCanvasElement, width: number, height: number): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, width, height);

    if (this._state.nextPiece) {
      const piece = this._state.nextPiece;
      const maxDimension = Math.max(piece.shape.length, piece.shape[0].length);
      const cellSize = Math.min(width, height) / (maxDimension + 1);
      const xOffset = (width - piece.shape[0].length * cellSize) / 2;
      const yOffset = (height - piece.shape.length * cellSize) / 2;

      ctx.fillStyle = piece.color;
      piece.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell) {
            ctx.fillRect(
              xOffset + x * cellSize,
              yOffset + y * cellSize,
              cellSize - 1,
              cellSize - 1
            );
          }
        });
      });
    }
  }

  private spawnPiece(): void {
    let currentPiece = this._state.nextPiece;
    if (currentPiece) {
      currentPiece = { ...currentPiece, shape: currentPiece.shape.map(r => [...r]) };
    } else {
      currentPiece = this.createRandomPiece();
    }
    
    const nextPiece = this.createRandomPiece();
    
    currentPiece.x = Math.floor((this.BOARD_WIDTH - currentPiece.shape[0].length) / 2);
    currentPiece.y = 0;
    
    this.setState({ currentPiece, nextPiece });
    
    if (this.checkCollision(currentPiece, 0, 0)) {
      this.setState({ gameOver: true, isPlaying: false });
    }
  }

  private createRandomPiece(): BlockStackPiece {
    const piece = this.PIECES[Math.floor(Math.random() * this.PIECES.length)];
    return {
      shape: piece.shape.map(row => [...row]),
      color: piece.color,
      x: 0,
      y: 0
    };
  }

  private movePiece(dx: number, dy: number): boolean {
    if (!this._state.currentPiece) return false;
    
    if (!this.checkCollision(this._state.currentPiece, dx, dy)) {
      this.setState({ 
        currentPiece: {
          ...this._state.currentPiece,
          x: this._state.currentPiece.x + dx,
          y: this._state.currentPiece.y + dy,
        }
      });
      return true;
    }
    
    if (dy > 0) {
      this.placePiece();
    }
    
    return false;
  }

  private rotatePiece(): void {
    if (!this._state.currentPiece) return;
    
    const rotated = this.rotateMatrix(this._state.currentPiece.shape);
    
    const tempPiece = { ...this._state.currentPiece, shape: rotated };
    
    const wallKicks = [
      [0, 0], [-1, 0], [1, 0], [-2, 0], [2, 0],
      [0, -1], [-1, -1], [1, -1]
    ];
    
    for (const [kickX, kickY] of wallKicks) {
      if (!this.checkCollision(tempPiece, kickX, kickY)) {
        this.setState({ 
          currentPiece: {
            ...tempPiece,
            x: tempPiece.x + kickX,
            y: tempPiece.y + kickY
          }
        });
        return;
      }
    }
  }

  private rotateMatrix(matrix: number[][]): number[][] {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const rotated = Array(cols).fill(null).map(() => Array(rows).fill(0));
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        rotated[j][rows - 1 - i] = matrix[i][j];
      }
    }
    
    return rotated;
  }

  private hardDrop(): void {
    if (!this._state.currentPiece) return;
    
    let dropDistance = 0;
    while (this.movePiece(0, 1)) {
      dropDistance++;
    }
    this.setState({ score: this._state.score + dropDistance * 2 });
  }

  private checkCollision(piece: BlockStackPiece, dx: number, dy: number): boolean {
    const newX = piece.x + dx;
    const newY = piece.y + dy;
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardX = newX + x;
          const boardY = newY + y;
          
          if (boardX < 0 || boardX >= this.BOARD_WIDTH || boardY >= this.BOARD_HEIGHT) {
            return true;
          }
          
          if (boardY >= 0 && this._state.board[boardY][boardX]) {
            return true;
          }
        }
      }
    }
    
    return false;
  }

  private placePiece(): void {
    if (!this._state.currentPiece) return;
    
    const board = this._state.board.map(row => [...row]);
    
    this._state.currentPiece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const boardY = this._state.currentPiece!.y + y;
          const boardX = this._state.currentPiece!.x + x;
          if (boardY >= 0) {
            board[boardY][boardX] = this._state.currentPiece!.color;
          }
        }
      });
    });
    
    // Award points for placing a piece
    this.setState({ 
      board,
      score: this._state.score + 10 * this._state.level
    });
    
    this.clearLines();
    this.spawnPiece();
  }

  private clearLines(): void {
    let linesCleared = 0;
    const board = this._state.board.map(row => [...row]);
    
    for (let y = this.BOARD_HEIGHT - 1; y >= 0; y--) {
      if (board[y].every(cell => cell !== null)) {
        board.splice(y, 1);
        board.unshift(Array(this.BOARD_WIDTH).fill(null));
        linesCleared++;
        y++;
      }
    }
    
    if (linesCleared > 0) {
      const score = this._state.score + this.calculateScore(linesCleared);
      const linesClearedTotal = this._state.linesCleared + linesCleared;
      const level = Math.floor(linesClearedTotal / 10) + 1;
      const dropSpeed = Math.max(50, 1000 - (level - 1) * 100);
      
      this.setState({ 
        board,
        score, 
        linesCleared: linesClearedTotal, 
        level, 
        dropSpeed 
      });
    }
  }

  private calculateScore(lines: number): number {
    const baseScore = [0, 100, 300, 500, 800][lines] || 0;
    return baseScore * this._state.level;
  }

  private setState(newState: Partial<BlockStackState>): void {
    this._state = { ...this._state, ...newState };
    this.emit('gameStateChanged', this._state);
  }
}
