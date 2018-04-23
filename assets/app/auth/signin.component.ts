import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from "./auth.service";
import { User } from "./user.model";
import { Router } from "@angular/router";

/**
 * LoginComponent represents the login screen of the app
 */
@Component({
    selector: 'app-login',
    templateUrl: './signin.component.html'
})
export class SignInComponent implements OnInit {
    //Create a form property to bind to in HTML
    signinForm: FormGroup;

    //Inject auth service
    constructor(private authService: AuthService, private router: Router) {}

    //Create form in init
    ngOnInit() {
        this.signinForm = new FormGroup({
            email: new FormControl(null,
                [
                    Validators.required,
                    Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
                ]),
            password: new FormControl(null, Validators.required)
        })
    }

    /**
     * Called when sign-in button pressed. Checks if user exists in database. If they do,
     * they will be navigated to their dashboard.
     * 
     * @memberof SignInComponent
     */
    onSubmit() {
        //Will need to post to login route to see if user exists in db
        var user = new User(
            this.signinForm.value.email,
            this.signinForm.value.password
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
        this.signinForm.reset();
    }
    
}