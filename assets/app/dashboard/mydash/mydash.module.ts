import { NgModule } from "@angular/core";
import { MyDashComponent } from "./mydash.component";
import { RelationshipModule } from "../../relationships/relationship.module";
import { MessagesComponent } from "./messages.component";
import { mydashRouting } from "./mydash.routing";
import { DatesComponent } from "./dates.component";
import { ChoresComponent } from "./chores.component";
import { FightsComponent } from "./fights.component";
import { MatSidenavModule, MatToolbar, MatToolbarModule, MatListModule } from "@angular/material"
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [
        MyDashComponent,
        MessagesComponent,
        DatesComponent,
        ChoresComponent,
        FightsComponent
        
    ],
    imports: [
        RelationshipModule,
        mydashRouting,
        CommonModule,
        MatSidenavModule,
        MatToolbarModule,
        MatListModule
    ],
    exports: [
        MyDashComponent
    ]

})
export class MyDashModule {

}