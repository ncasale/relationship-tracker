import { Routes, RouterModule } from "@angular/router";
import { DatesComponent } from "./dates/dates.component";
import { ChoresComponent } from "./chores/chores.component";
import { FightsComponent } from "./fights.component";
import { MessagesComponent } from "./messages/messages.component";
import { SettingsComponent } from "./settings/settings.component";

const MYDASH_ROUTES: Routes = [
    { path: '', redirectTo: 'messages', pathMatch: 'full'},
    { path: 'messages', component: MessagesComponent},
    { path: 'dates', component: DatesComponent},
    { path: 'chores', component: ChoresComponent},
    { path: 'fights', component: FightsComponent},
    { path: 'settings', component: SettingsComponent}
]


export const mydashRouting = RouterModule.forChild(MYDASH_ROUTES);