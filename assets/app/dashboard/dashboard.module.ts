import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { dashboardRouting } from './dashboard.routing';
import { JoinComponent } from './join-relationship/join.component';
import { CreateComponent } from './create-relationship/create.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RelationshipModule } from '../relationships/relationship.module';
import { JoinCardComponent } from './join-relationship/join-card.component';
import { MyDashModule } from './mydash/mydash.module';
import { LogoutComponent } from './logout/logout.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordDialogComponent } from './profile/change-password-dialog.component';
import { MatInputModule, MatDialogModule, MatCheckboxModule } from '@angular/material';

@NgModule({
    declarations: [
        JoinComponent,
        CreateComponent,
        JoinCardComponent,
        LogoutComponent,
        ProfileComponent,
        ChangePasswordDialogComponent
    ],
    imports: [
        CommonModule,
        dashboardRouting,
        FormsModule,
        ReactiveFormsModule,
        RelationshipModule,
        MyDashModule,
        MatInputModule,
        MatDialogModule,
        MatCheckboxModule       
    ],
    entryComponents: [
        ChangePasswordDialogComponent
    ]

})
export class DashboardModule {

}