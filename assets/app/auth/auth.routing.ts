import { Routes, RouterModule } from "@angular/router";

import { SignupComponent } from "./signup.component";
import { SignInComponent } from "./signin.component";

const AUTH_ROUTES: Routes = [
    { path: '', redirectTo: 'signup', pathMatch: 'full' },
    { path: 'signup', component: SignupComponent },
    { path: 'login', component: SignInComponent }
];

export const authRouting = RouterModule.forChild(AUTH_ROUTES);