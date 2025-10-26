import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class UserLoginGlobalSignal {
    public logedIn = signal<boolean>(false);
}