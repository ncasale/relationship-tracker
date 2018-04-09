import { NgModule } from "@angular/core";
import { MyDashComponent } from "./mydash.component";
import { RelationshipModule } from "../../relationships/relationship.module";

@NgModule({
    declarations: [
        MyDashComponent
    ],
    imports: [
        RelationshipModule

    ],
    exports: [
        MyDashComponent
    ]

})
export class MyDashModule {

}