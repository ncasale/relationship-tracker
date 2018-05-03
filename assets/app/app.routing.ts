import { Routes, RouterModule } from "@angular/router";

import { AuthComponent } from "./auth/auth.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LandingComponent } from "./landing/landing.component";

const APP_ROUTES: Routes = [
    { path: '', redirectTo: 'landing', pathMatch: 'full' },
    { path: 'landing', component: LandingComponent, loadChildren: './landing/landing.module#LandingModule'},
    { path: 'auth', component: AuthComponent, loadChildren: './auth/auth.module#AuthModule' },
    { path: 'dashboard', component: DashboardComponent, loadChildren: './dashboard/dashboard.module#DashboardModule' }
];

export const routing = RouterModule.forRoot(APP_ROUTES);