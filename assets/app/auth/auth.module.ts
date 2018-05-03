import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SignInComponent } from "./signin.component";
import { SignupComponent } from "./signup.component";
import { authRouting } from "./auth.routing";
import { AuthComponent } from './auth.component';

@NgModule({
    declarations: [
        AuthComponent,
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