import { PlayerProfile } from '../types';
export class GameStorage {
    private static readonly STORAGE_KEY = 'retro-arcade';
  
    static savePlayerProfile(profile: PlayerProfile): void {
      const data = this.getData();
      data.profile = profile;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }
  
    static getPlayerProfile(): PlayerProfile | null {
      const data = this.getData();
      return data.profile || null;
    }
  
    static saveHighScore(gameId: string, score: number): void {
      const data = this.getData();
      if (!data.highScores) data.highScores = {};
      
      if (!data.highScores[gameId] || data.highScores[gameId] < score) {
        data.highScores[gameId] = score;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      }
    }
  
    static getHighScore(gameId: string): number {
      const data = this.getData();
      return data.highScores?.[gameId] || 0;
    }
  
    static saveGameProgress(gameId: string, progress: any): void {
      const data = this.getData();
      if (!data.progress) data.progress = {};
      data.progress[gameId] = progress;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }
  
    static getGameProgress(gameId: string): any {
      const data = this.getData();
      return data.progress?.[gameId] || null;
    }
  
    private static getData(): any {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
      } catch {
        return {};
      }
    }
  }