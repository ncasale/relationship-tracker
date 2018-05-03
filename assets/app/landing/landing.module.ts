import { NgModule } from "@angular/core";
import { LandingComponent } from "./landing.component";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { landingRouting } from "./landing.routing";
import { MatInputModule, MatButtonModule } from "@angular/material";

@NgModule({
    declarations: [
        LandingComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        landingRouting,
        MatInputModule,
        MatButtonModule
    ]

})
export class LandingModule {

}