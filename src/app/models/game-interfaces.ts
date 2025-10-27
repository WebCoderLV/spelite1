export interface GameResult {
    gameId: number;
    p: number;
    a: number;
    win: boolean;
}

export interface GameInterface {
    id?: number | null;
    userId?: number | null;
    number1: number;
    number2: number;
    number3: number;
    number4: number;
}

export interface GameAttempt {
    result: GameResult;
    inputNumbers: number[];
}