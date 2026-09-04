import { getData } from '../utils/dataHelper';

import gameInfo from '@/data/game_info.json'

export const checkGame = (game) => gameInfo?.[game] ? true : false