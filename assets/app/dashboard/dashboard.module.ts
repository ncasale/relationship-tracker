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
import { MatInputModule, MatDialogModule, MatCheckboxModule, MatToolbarModule, MatButtonModule, MatSnackBarModule } from '@angular/material';
import { DashboardComponent } from './dashboard.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { FeedbackDialogComponent } from './feedback/feedback-dialog.component';

@NgModule({
    declarations: [
        JoinComponent,
        CreateComponent,
        JoinCardComponent,
        LogoutComponent,
        ProfileComponent,
        ChangePasswordDialogComponent,
        DashboardComponent,
        FeedbackComponent,
        FeedbackDialogComponent
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
        MatCheckboxModule,
        MatToolbarModule,
        MatButtonModule,
        MatSnackBarModule      
    ],
    entryComponents: [
        ChangePasswordDialogComponent,
        FeedbackDialogComponent
    ]

})
export class DashboardModule {

}