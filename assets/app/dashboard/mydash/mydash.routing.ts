import { Routes, RouterModule } from "@angular/router";
import { DatesComponent } from "./dates.component";
import { ChoresComponent } from "./chores.component";
import { FightsComponent } from "./fights.component";
import { MessagesComponent } from "./messages/messages.component";

const MYDASH_ROUTES: Routes = [
    { path: '', redirectTo: 'messages', pathMatch: 'full'},
    { path: 'messages', component: MessagesComponent},
    { path: 'dates', component: DatesComponent},
    { path: 'chores', component: ChoresComponent},
    { path: 'fights', component: FightsComponent}
]


export const mydashRouting = RouterModule.forChild(MYDASH_ROUTES);