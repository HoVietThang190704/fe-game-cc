export type MatchFoundPayload = {
  matchId: string;
  pinCode: string;
  opponent: {
    username: string;
    elo: number;
  };
};

export type MatchJoinedPayload = {
  matchId: string;
  pinCode: string;
  players: Array<{
    userId: string;
    displayName: string;
    rank: number;
    isReady: boolean;
  }>;
};

export type GameStartPayload = {
  matchId: string;
  boardSize: { rows: number; cols: number; bombs: number };
  firstTurn: string;
};

export type PlayerLeftPayload = {
  userId: string;
};

export type ErrorPayload = {
  code: string;
  message: string;
};
