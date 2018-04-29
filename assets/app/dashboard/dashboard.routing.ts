import { Routes, RouterModule } from '@angular/router';

import { JoinComponent } from "./join-relationship/join.component";
import { CreateComponent } from "./create-relationship/create.component";
import { MyDashComponent } from './mydash/mydash.component';
import { LogoutComponent } from './logout/logout.component';
import { ProfileComponent } from './profile/profile.component';

const DASHBOARD_ROUTES: Routes = [
    { path: '', redirectTo: 'profile', pathMatch: 'full'},
    { path: 'join', component: JoinComponent },
    { path: 'create', component: CreateComponent },
    { path: 'mydash', component: MyDashComponent, loadChildren: './mydash/mydash.module#MyDashModule' },
    { path: 'profile', component: ProfileComponent}
]

export const dashboardRouting = RouterModule.forChild(DASHBOARD_ROUTES);