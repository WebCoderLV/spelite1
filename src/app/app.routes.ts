import { Routes } from '@angular/router';
import { Main } from './main/main';
import { Login } from './login/login';
import { NotFound } from './not-found/not-found';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: Login, title: 'Login' },
    { path: 'main', component: Main, title: 'Play The Game!' },
    { path: '**', component: NotFound, title: 'Not Found' }
];
