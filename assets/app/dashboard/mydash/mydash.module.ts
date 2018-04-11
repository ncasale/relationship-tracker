import { NgModule } from "@angular/core";
import { MyDashComponent } from "./mydash.component";
import { RelationshipModule } from "../../relationships/relationship.module";
import { mydashRouting } from "./mydash.routing";
import { DatesComponent } from "./dates/dates.component";
import { ChoresComponent } from "./chores.component";
import { FightsComponent } from "./fights.component";
import { MatSidenavModule, MatToolbar, MatToolbarModule, MatListModule, MatCalendar, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule } from "@angular/material"
import { CommonModule, DatePipe } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MessagesComponent } from "./messages/messages.component";
import { MessageCardComponent } from "./messages/message-card.component";
import { ngMaterialDatePicker } from 'ng-material-datetimepicker'
import { DateInputComponent } from "./dates/date-input.component";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime'
import { SettingsComponent } from "./settings/settings.component";

@NgModule({
    declarations: [
        MyDashComponent,
        MessagesComponent,
        DatesComponent,
        DateInputComponent,
        ChoresComponent,
        FightsComponent,
        MessageCardComponent,
        SettingsComponent     
    ],
    imports: [
        RelationshipModule,
        mydashRouting,
        CommonModule,
        ReactiveFormsModule,
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule
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