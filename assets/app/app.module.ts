import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AppComponent } from "./app.component";
import { AuthComponent } from './auth/auth.component';
import { routing } from './app.routing';
import { AuthService } from './auth/auth.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RelationshipService } from './relationships/relationship.service';
import { RelationshipModule } from './relationships/relationship.module';
import { ErrorService } from './error/error.service';
import { ErrorComponent } from './error/error.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import 'style-loader!../../node_modules/@angular/material/prebuilt-themes/indigo-pink.css'
import { MessagesService } from './dashboard/mydash/messages/messages.service';
import { DatePipe } from '@angular/common';
import { DateService } from './dashboard/mydash/dates/date.service';
import { ChoreService } from './dashboard/mydash/chores/chore.service';
import { FightService } from './dashboard/mydash/fights/fight.service';
import { MyDashService } from './dashboard/mydash/mydash.service';
import { MatSnackBarModule } from '@angular/material';
import { DashboardModule } from './dashboard/dashboard.module';
import { GratitudeService } from './dashboard/mydash/gratitudes/gratitude.service';
import { FeedbackService } from './dashboard/feedback/feedback.service';
import { LandingModule } from './landing/landing.module';
import { AuthModule } from './auth/auth.module';

@NgModule({
    declarations: [
        AppComponent,        
        ErrorComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        LandingModule,
        AuthModule,
        RelationshipModule,
        routing,
        MatSnackBarModule,
        DashboardModule
    ],
    providers: [
        AuthService,
        RelationshipService,
        ErrorService,
        MessagesService,
        DateService,
        DatePipe,
        ChoreService,
        FightService,
        MyDashService,
        GratitudeService,
        FeedbackService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

}