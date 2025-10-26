import { Injectable, signal } from "@angular/core";
import { UserInterface } from './user-interface';

@Injectable({
    providedIn: 'root'
})
export class UserGlobalSignal {

    public user = signal<UserInterface>({
        name: '',
        password: '',
    });

}
