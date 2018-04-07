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
import { RelationshipListComponent } from './relationships/relationship-list.component';
import { ErrorService } from './error/error.service';
import { ErrorComponent } from './error/error.component';

@NgModule({
    declarations: [
        AppComponent,
        AuthComponent,
        DashboardComponent,
        ErrorComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        RelationshipModule,
        routing
    ],
    providers: [
        AuthService,
        RelationshipService,
        ErrorService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

}