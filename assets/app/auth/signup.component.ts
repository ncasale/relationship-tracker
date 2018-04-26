import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from "./auth.service";
import { User } from "./user.model"
import { Router } from "@angular/router";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit{
    signupForm: FormGroup;

    //Inject the auth service
    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit() {
        //Instantiate form
        this.signupForm = new FormGroup({
            firstname: new FormControl(null, Validators.required),
            lastname: new FormControl(null, Validators.required),
            email: new FormControl(null, [Validators.required, 
                Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")]),
            password: new FormControl(null, Validators.required)
        })

        //Try to login user if their token already exists
        if(localStorage.getItem('token')) {
            this.authService.loginWithToken().subscribe(
                (response: any) => {
                    if(response.valid) {
                        localStorage.setItem('token', response.token);
                        localStorage.setItem('userId', response.userId);
                        this.router.navigateByUrl('/dashboard');
                    }
                }
            )
        }
    }

    /**
     * Called when sign-up button clicked. Will create a user object and save it in the database.
     * 
     * @memberof SignupComponent
     */
    onSubmit() {
        //Use form values to create a new user
        var user = new User(
            this.signupForm.value.email,
            this.signupForm.value.password,
            this.signupForm.value.firstname,
            this.signupForm.value.lastname
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
        this.signupForm.reset();
        
    }

    /**
     * Checks if all fields required for signup are valid.
     * 
     * @returns true if all signup fields valid, false otherwise
     * @memberof SignupComponent
     */
    isFormValid() {
        return this.signupForm.valid;
    }

}