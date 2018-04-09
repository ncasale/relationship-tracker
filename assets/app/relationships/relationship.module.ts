import { NgModule } from "@angular/core";
import { RelationshipComponent } from "./relationship.component";
import { CommonModule } from "@angular/common";
import { InviteComponent } from "./invite.component";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [
        RelationshipComponent,
        InviteComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    exports: [
        InviteComponent
    ]
})
export class RelationshipModule {

}