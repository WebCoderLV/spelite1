import { Injectable, signal } from "@angular/core";
import { UserInterface } from "../models/user-interface";

@Injectable({
    providedIn: 'root'
})
export class UserGlobalSignal {

    public user = signal<UserInterface>({
        id: null,
        name: '',
        password: '',
    });

}
