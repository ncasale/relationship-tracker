import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SignInComponent } from "./signin.component";
import { SignupComponent } from "./signup.component";
import { authRouting } from "./auth.routing";

@NgModule({
    declarations: [
        SignInComponent,
        SignupComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        authRouting
    ]
})
export class AuthModule {

}