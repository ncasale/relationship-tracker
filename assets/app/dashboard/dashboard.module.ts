import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { dashboardRouting } from './dashboard.routing';
import { JoinComponent } from './join.component';
import { CreateComponent } from './create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MyDashComponent } from './mydash.component';
import { RelationshipModule } from '../relationships/relationship.module';
import { JoinCardComponent } from './join-card.component';

@NgModule({
    declarations: [
        JoinComponent,
        CreateComponent,
        MyDashComponent,
        JoinCardComponent
    ],
    imports: [
        CommonModule,
        dashboardRouting,
        ReactiveFormsModule,
        RelationshipModule        
    ]

})
export class DashboardModule {

}