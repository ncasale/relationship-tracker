import { Routes, RouterModule } from "@angular/router";
import { DatesComponent } from "./dates/dates.component";
import { ChoresComponent } from "./chores/chores.component";
import { FightsComponent } from "./fights/fights.component";
import { MessagesComponent } from "./messages/messages.component";
import { SettingsComponent } from "./settings/settings.component";
import { GratitudesComponent } from "./gratitudes/gratitudes.component";
import { MyDashComponent } from "./mydash.component";

const MYDASH_ROUTES: Routes = [
    { path: 'messages', component: MessagesComponent},
    { path: 'dates', component: DatesComponent},
    { path: 'chores', component: ChoresComponent},
    { path: 'gratitudes', component: GratitudesComponent},
    { path: 'fights', component: FightsComponent},
    { path: 'settings', component: SettingsComponent}
]


export const mydashRouting = RouterModule.forChild(MYDASH_ROUTES);