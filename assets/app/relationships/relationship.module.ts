import { NgModule } from "@angular/core";
import { RelationshipComponent } from "./relationship.component";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [
        RelationshipComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule
    ]
})
export class RelationshipModule {

}