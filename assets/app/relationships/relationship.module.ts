import { NgModule } from "@angular/core";
import { RelationshipComponent } from "./relationship.component";
import { CommonModule } from "@angular/common";
import { RelationshipListComponent } from "./relationship-list.component";
import { InviteComponent } from "./invite.component";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [
        RelationshipComponent,
        RelationshipListComponent,
        InviteComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    exports: [
        RelationshipListComponent,
        InviteComponent
    ]
})
export class RelationshipModule {

}