import { NgModule } from "@angular/core";
import { MyDashComponent } from "./mydash.component";
import { RelationshipModule } from "../../relationships/relationship.module";
import { mydashRouting } from "./mydash.routing";
import { DatesComponent } from "./dates/dates.component";
import { ChoresComponent } from "./chores/chores.component";
import { FightsComponent } from "./fights/fights.component";
import { MatSidenavModule, MatToolbar, MatToolbarModule, MatListModule, MatCalendar, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatDialogModule, MatSnackBar, MatSnackBarModule, MatButtonModule, MatCardModule, MatIconModule } from "@angular/material"
import { CommonModule, DatePipe } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MessagesComponent } from "./messages/messages.component";
import { MessageCardComponent } from "./messages/message-card.component";
import { ngMaterialDatePicker } from 'ng-material-datetimepicker'
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime'
import { SettingsComponent } from "./settings/settings.component";
import { MessageEditComponent } from "./messages/message-edit.component";
import { DateCardComponent } from "./dates/date-card.component";
import { DateDialogComponent } from "./dates/date-dialog.component";
import { ChoreDialogComponent } from "./chores/chore-dialog.component";
import { ChoreCardComponent } from "./chores/chore-card.component";
import { FightDialogComponent } from "./fights/fight-dialog.component";
import { FightCardComponent } from "./fights/fight-card.component";
import { InviteDialogComponent } from "./settings/invite-dialog.component";
import { FightAppendDialogComponent } from "./fights/fight-append-dialog.component";
import { FightDisplayDialogComponent } from "./fights/fight-display-dialog.component";
import { DeleteItemDialogComponent } from "./common/delete-item-dialog.component";
import { MyDashService } from "./mydash.service";
import { LeaveDialogComponent } from "./settings/leave-dialog.component";
import { GratitudesComponent } from "./gratitudes/gratitudes.component";
import { GratitudeCardComponent } from "./gratitudes/gratitude-card.component";
import { GratitudeDialogComponent } from "./gratitudes/gratitude-dialog.component";

@NgModule({
    declarations: [
        MyDashComponent,
        MessagesComponent,
        DatesComponent,
        ChoresComponent,
        FightsComponent,
        MessageCardComponent,
        SettingsComponent,
        MessageEditComponent,
        DateCardComponent,
        DateDialogComponent,
        ChoreDialogComponent,
        ChoreCardComponent,
        FightDialogComponent,
        FightCardComponent,
        InviteDialogComponent,
        FightAppendDialogComponent,
        FightDisplayDialogComponent,
        DeleteItemDialogComponent,
        LeaveDialogComponent,
        GratitudesComponent,
        GratitudeCardComponent,
        GratitudeDialogComponent     
    ],
    imports: [
        RelationshipModule,
        mydashRouting,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatDialogModule,
        MatSnackBarModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule
    ],
    entryComponents: [
        MessageEditComponent,
        DateDialogComponent,
        ChoreDialogComponent,
        FightDialogComponent,
        InviteDialogComponent,
        FightAppendDialogComponent,
        FightDisplayDialogComponent,
        DeleteItemDialogComponent,
        LeaveDialogComponent,
        GratitudeDialogComponent
    ],
    providers: [
        DatePipe
    ],
    exports: [
        MyDashComponent
    ]

})
export class MyDashModule {

}