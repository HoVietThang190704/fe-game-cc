import { useCallback } from 'react';
import { useGameWebSocket } from './useGameWebSocket';
import { useGame, GameMove } from '@/src/lib/context/GameContext';

// Payload types for game events
interface StartGamePayload {
  currentTurn: string;
  turnTimeLimit?: number;
}

interface MoveResultPayload {
  x: number;
  y: number;
  userId: string;
  action: 'flag' | 'open';
  result: 'bomb' | 'empty' | 'shield_blocked';
  shieldBlocked?: boolean;
  revealedCells?: string[];
  health?: number;
}

interface TurnSwitchedPayload {
  currentTurn: string;
  turnTimeLimit?: number;
}

interface TurnTimeoutPayload {
  userId: string;
  nextTurnId?: string;
  health?: number;
}

interface GameOverPayload {
  winnerId: string;
  loser: string;
  timestamp: number;
  winnerEloDelta?: number;
  loserEloDelta?: number;
}

interface ReadyUpdatePayload {
  userId: string;
  isReady: boolean;
}

interface GameLogicOptions {
  onStartGame?: (payload: StartGamePayload) => void;
  onMoveResult?: (payload: MoveResultPayload) => void;
  onTurnSwitched?: (payload: TurnSwitchedPayload) => void;
  onTurnTimeout?: (payload: TurnTimeoutPayload) => void;
  onGameOver?: (payload: GameOverPayload) => void;
  onReadyUpdate?: (payload: ReadyUpdatePayload) => void;
}

export const useGameLogic = (matchId: string, userId: string, options: GameLogicOptions = {}) => {
  const { updateGameState, addMove } = useGame();
  const { send, isConnected } = useGameWebSocket({
    matchId,
    onConnect: () => {
      send('/app/join_room', { matchId });
    },
    onMessage: (message) => {
      const payload = message.payload ?? {};
      if (message.type === 'start_game') {
        options.onStartGame?.(payload as StartGamePayload);
      } else if (message.type === 'move_result') {
        options.onMoveResult?.(payload as MoveResultPayload);
      } else if (message.type === 'turn_switched') {
        options.onTurnSwitched?.(payload as TurnSwitchedPayload);
      } else if (message.type === 'turn_timeout') {
        options.onTurnTimeout?.(payload as TurnTimeoutPayload);
      } else if (message.type === 'game_over') {
        const gameOverPayload = payload as GameOverPayload;
        updateGameState({ status: 'FINISHED', winnerId: gameOverPayload.winnerId });
        options.onGameOver?.(gameOverPayload);
      } else if (message.type === 'ready_update') {
        options.onReadyUpdate?.(payload as ReadyUpdatePayload);
      }
    },
  });

  const placeBombs = useCallback(
    (bombs: Array<{ x: number; y: number }>) => {
      const move: GameMove = {
        matchId,
        userId,
        type: 'placeBombs',
        bombs,
        timestamp: Date.now(),
      };

      send('/app/place_bombs', {
        matchId,
        userId,
        bombs,
      });

      addMove(move);
    },
    [matchId, userId, send, addMove]
  );

  const revealCell = useCallback(
    (x: number, y: number) => {
      const move: GameMove = {
        matchId,
        userId,
        type: 'revealCell',
        x,
        y,
        timestamp: Date.now(),
      };

      send('/app/send_move', {
        matchId,
        userId,
        x,
        y,
        action: 'open',
      });

      addMove(move);
    },
    [matchId, userId, send, addMove]
  );

  const toggleFlag = useCallback(
    (x: number, y: number) => {
      const move: GameMove = {
        matchId,
        userId,
        type: 'toggleFlag',
        x,
        y,
        timestamp: Date.now(),
      };

      send('/app/send_move', {
        matchId,
        userId,
        x,
        y,
        action: 'flag',
      });

      addMove(move);
    },
    [matchId, userId, send, addMove]
  );

  return {
    isConnected,
    placeBombs,
    revealCell,
    toggleFlag,
  };
};
