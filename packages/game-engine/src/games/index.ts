import { IGameConstructor } from '../types';
import { BlockStackGame } from './blockstack';

export const games: { [key: string]: IGameConstructor } = {
  'block-stack': BlockStackGame,
};

export const getGame = (id: string): IGameConstructor | undefined => {
  return games[id];
};
