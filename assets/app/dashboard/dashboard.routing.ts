import { Routes, RouterModule } from '@angular/router';

import { JoinComponent } from "./join.component";
import { CreateComponent } from "./create.component";
import { MyDashComponent } from './mydash.component';

const DASHBOARD_ROUTES: Routes = [
    { path: '', redirectTo: 'mydash', pathMatch: 'full'},
    { path: 'join', component: JoinComponent },
    { path: 'create', component: CreateComponent },
    { path: 'mydash', component: MyDashComponent}
]

export const dashboardRouting = RouterModule.forChild(DASHBOARD_ROUTES);