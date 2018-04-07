import { Routes, RouterModule } from "@angular/router";

import { AuthComponent } from "./auth/auth.component";
import { DashboardComponent } from "./dashboard/dashboard.component";

const APP_ROUTES: Routes = [
    { path: '', redirectTo: 'auth', pathMatch: 'full' },
    { path: 'auth', component: AuthComponent, loadChildren: './auth/auth.module#AuthModule' },
    { path: 'dashboard', component: DashboardComponent, loadChildren: './dashboard/dashboard.module#DashboardModule' }
];

export const routing = RouterModule.forRoot(APP_ROUTES);