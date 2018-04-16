import { Routes, RouterModule } from '@angular/router';

import { JoinComponent } from "./join.component";
import { CreateComponent } from "./create.component";
import { MyDashComponent } from './mydash/mydash.component';
import { LogoutComponent } from './logout/logout.component';

const DASHBOARD_ROUTES: Routes = [
    { path: '', redirectTo: 'mydash', pathMatch: 'full'},
    { path: 'join', component: JoinComponent },
    { path: 'create', component: CreateComponent },
    { path: 'mydash', component: MyDashComponent, loadChildren: './mydash/mydash.module#MyDashModule' },
    { path: 'logout', component: LogoutComponent}
]

export const dashboardRouting = RouterModule.forChild(DASHBOARD_ROUTES);