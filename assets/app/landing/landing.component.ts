import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { FormControl, Validators } from "@angular/forms";
import { AuthService } from "../auth/auth.service";
import { User } from "../auth/user.model";

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.css']
})
export class LandingComponent {
    //Form Controls -- Signup
    signupFirstnameFC = new FormControl(null, Validators. required);
    signupLastnameFC = new FormControl(null, Validators.required);
    signupEmailFC = new FormControl(null, Validators.required);
    signupPasswordFC = new FormControl(null, Validators.required);

    //Form Controls -- login
    loginEmailFC = new FormControl(null, Validators.required);
    loginPasswordFC = new FormControl(null, Validators.required);

    //UI Flags
    areLoggingIn: boolean = false;
    areSigningUp: boolean = false;

    //Text for buttons
    loginText: string = 'LOGIN';
    signupText: string = 'SIGNUP'


    //Inject services
    constructor(
        private router: Router,
        private authService: AuthService
    ){}
    
    goToSignup() {
        this.areLoggingIn = false;
        this.areSigningUp = true;
        this.loginText = 'LOGIN';
        this.signupText = 'CREATE!';
    }

    goToLogin() {
        this.areLoggingIn = true;
        this.areSigningUp = false;
        this.loginText = 'GO!';
        this.signupText = 'SIGNUP';
    }

    login() {
        //If we aren't already logging in, show the login box
        if(!this.areLoggingIn) {
            this.goToLogin();
        } else {
            //Otherwise, submit information in the login form
            var user = new User(
                this.loginEmailFC.value,
                this.loginPasswordFC.value
            );    
            //Use AuthService to log user in
            this.authService.loginUser(user)
                .subscribe(
                    data => {
                        localStorage.setItem('token', data.token);
                        localStorage.setItem('userId', data.userId);
                        this.router.navigateByUrl('/dashboard');
                    },
                    error => console.error(error)
                )
            //Reset the form
            this.loginEmailFC.reset();
            this.loginPasswordFC.reset();
        }


    }

    signup() {
        if(!this.areSigningUp) {
            this.goToSignup();
        } else {
            //Use form values to create a new user
        var user = new User(
            this.signupEmailFC.value,
            this.signupPasswordFC.value,
            this.signupFirstnameFC.value,
            this.signupLastnameFC.value
        );
        //Create user using AuthService
        this.authService.saveUser(user)
            .subscribe(
                (response: Response) => {
                    //Log the user in
                    //Use AuthService to log user in
                    this.authService.loginUser(user)
                    .subscribe(
                        (response: any) => {
                            localStorage.setItem('token', response.token);
                            localStorage.setItem('userId', response.userId);
                            this.router.navigateByUrl('/dashboard');
                    }        
                    )
                }
            )
        //Clear form
        this.signupEmailFC.reset();
        this.signupPasswordFC.reset();
        this.signupFirstnameFC.reset();
        this.signupLastnameFC.reset();

        }
    }

    onSubmitSignup() {
        console.log('Sigining up...');
    }

    //Login Error Functions
    getLoginEmailErrorMessage() {
        return this.loginEmailFC.hasError('required') ? 'You must enter your username' : '';
    }

    getLoginPasswordErrorMessage() {
        return this.loginPasswordFC.hasError('required') ? 'You must enter your password' : '';
    }

    //Signup Error Functions
    getSignupFirstnameErrorMessage() {
        return this.signupFirstnameFC.hasError('required') ? 'Please enter your first name' : '';
    }

    getSignupLastnameErrorMessage() {
        return this.signupLastnameFC.hasError('required') ? 'Please enter your last name' : '';
    }

    getSignupEmailErrorMessage() {
        return this.signupEmailFC.hasError('required') ? 'Please enter your email' : '';
    }

    getSignupPasswordErrorMessage() {
        return this.signupPasswordFC.hasError('required') ? 'Please enter a password' : '';
    }

    isSignupValid() {
        return this.signupPasswordFC.valid &&
            this.signupEmailFC.valid &&
            this.signupFirstnameFC.valid &&
            this.signupLastnameFC.valid
    }

    isLoginValid() {
        return this.loginPasswordFC.valid &&
            this.loginEmailFC.valid
    }
}