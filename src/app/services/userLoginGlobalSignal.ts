import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class UserLoginGlobalSignal {
    public userLogedIn = signal<boolean>(false);
}