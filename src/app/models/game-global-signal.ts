import { Inject, Injectable, signal } from "@angular/core";

interface GameInterface {
    id?: number | null;
    userId?: number | null;
    number1: number;
    number2: number;
    number3: number;
    number4: number;
}

@Injectable({
    providedIn: 'root'
})
export class GameGlobalSignal {
    public game = signal<GameInterface>({
        number1: 0,
        number2: 0,
        number3: 0,
        number4: 0
    });
}
