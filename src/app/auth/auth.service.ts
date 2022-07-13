import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

import { environment } from "../../environments/environment";
import { User } from "./user.model";

export interface AuthResponse {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

// const API_KEY = 'AIzaSyBkCubcoxxkZm5V1rRDUY7LjJVawTJab24';

@Injectable({ providedIn: 'root' })
export class AuthService {

    user = new BehaviorSubject<User>(null);
    private tokenExiprationTimer: any;

    constructor(private http: HttpClient,
        private router: Router) { }

    signUp(email: string, password: string) {
        return this.http.post<AuthResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.API_key,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        )
            .pipe(
                catchError(this.handleError),
                tap(response => {
                    this.handleAuthentication(response.email, response.localId, response.idToken, +response.expiresIn);//expiresIn a string in seconds
                })
            )
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.API_key,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        )
            .pipe(
                catchError(this.handleError),
                tap(response => {
                    this.handleAuthentication(response.email, response.localId, response.idToken, +response.expiresIn);//expiresIn a string in seconds
                })
            )
    }

    autoLogin() {
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExipirationDate: string
        } = JSON.parse(localStorage.getItem('recipeBookUser'));
        if (!userData) {
            return;
        }
        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExipirationDate));
        if (loadedUser.token) { //getter checks for expiration
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExipirationDate).getTime() - new Date().getTime()
            this.autoLogout(expirationDuration);
        }
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('recipeBookUser');
        if (this.tokenExiprationTimer) {
            clearTimeout(this.tokenExiprationTimer);
        }
        this.tokenExiprationTimer = null;
    }

    autoLogout(expirationDuration: number) {
        this.tokenExiprationTimer = setTimeout(() => {
            this.logout()
        }, expirationDuration);
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        const exiprationDate = new Date(new Date().getTime() + (expiresIn * 1000));
        const user = new User(email, userId, token, exiprationDate);
        this.user.next(user);
        this.autoLogout(expiresIn * 1000); //send milliseconds
        localStorage.setItem('recipeBookUser', JSON.stringify(user));
    }

    private handleError(errorResponse: HttpErrorResponse) {
        let errorMessage = 'An unknown error occured!'; //default value
        if (!errorResponse.error || !errorResponse.error.error) {
            return throwError(() => errorMessage);
        }
        switch (errorResponse.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email ID exists already';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email ID does not exist.';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'This password is incorrect.';
                break;
        }
        return throwError(() => errorMessage);
    }

}