import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { dashboardRouting } from './dashboard.routing';
import { JoinComponent } from './join-relationship/join.component';
import { CreateComponent } from './create-relationship/create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RelationshipModule } from '../relationships/relationship.module';
import { JoinCardComponent } from './join-relationship/join-card.component';
import { LogoutComponent } from './logout/logout.component';
import { MyDashModule } from './mydash/mydash.module';

@NgModule({
    declarations: [
        JoinComponent,
        CreateComponent,
        JoinCardComponent,
        LogoutComponent
    ],
    imports: [
        CommonModule,
        dashboardRouting,
        ReactiveFormsModule,
        RelationshipModule,
        MyDashModule       
    ]

})
export class DashboardModule {

}