import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

import { AuthService, AuthResponse } from "./auth.service";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent {

    isLoading = false;
    isLoginMode = true;
    error = null;
    

    constructor(private authService: AuthService, private router: Router) { }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(authForm: NgForm) {
        let authObservable: Observable<AuthResponse>;
        if (!authForm.valid)
            return;
        const email = authForm.value.email;
        const password = authForm.value.password;
        this.isLoading = true;

        if (this.isLoginMode) {
            authObservable = this.authService.login(email, password);
        } else {
            authObservable = this.authService.signUp(email, password);
        }

        authObservable.subscribe({
            next: (response) => {
                console.log(response);
                this.isLoading = false;
                this.router.navigate(['/recipes']);
            },
            error: (errMsg) => {
                console.log(errMsg);
                this.error = errMsg;
                this.isLoading = false;
            }
        })
        authForm.reset();
    }
}