import { Routes, RouterModule } from '@angular/router';

import { JoinComponent } from "./join-relationship/join.component";
import { CreateComponent } from "./create-relationship/create.component";
import { MyDashComponent } from './mydash/mydash.component';
import { LogoutComponent } from './logout/logout.component';
import { ProfileComponent } from './profile/profile.component';
import { FeedbackComponent } from './feedback/feedback.component';

const DASHBOARD_ROUTES: Routes = [
    { path: '', redirectTo: 'mydash/messages', pathMatch: 'full'},
    { path: 'join', component: JoinComponent },
    { path: 'create', component: CreateComponent },
    { path: 'mydash', component: MyDashComponent, loadChildren: './mydash/mydash.module#MyDashModule' },
    { path: 'profile', component: ProfileComponent},
    { path: 'feedback', component: FeedbackComponent}
]

export const dashboardRouting = RouterModule.forChild(DASHBOARD_ROUTES);