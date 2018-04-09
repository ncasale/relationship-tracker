import { NgModule } from "@angular/core";
import { MyDashComponent } from "./mydash.component";
import { RelationshipModule } from "../../relationships/relationship.module";
import { MessagesComponent } from "./messages.component";
import { mydashRouting } from "./mydash.routing";
import { DatesComponent } from "./dates.component";
import { ChoresComponent } from "./chores.component";
import { FightsComponent } from "./fights.component";

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
        mydashRouting
    ],
    exports: [
        MyDashComponent
    ]

})
export class MyDashModule {

}