import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from "./auth.service";
import { User } from "./user.model"

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit{
    signupForm: FormGroup;

    //Inject the auth service
    constructor(private authService: AuthService) {}

    ngOnInit() {
        //Instantiate form
        this.signupForm = new FormGroup({
            firstname: new FormControl(null, Validators.required),
            lastname: new FormControl(null, Validators.required),
            email: new FormControl(null, [Validators.required, 
                Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")]),
            password: new FormControl(null, Validators.required)
        })
    }

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
                data => console.log(data),
                error => console.error(error)
            )
        //Clear form
        this.signupForm.reset();
        
    }

    isFormValid() {
        return this.signupForm.valid;
    }

}