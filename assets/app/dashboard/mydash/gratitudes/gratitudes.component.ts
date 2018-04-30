import { Component } from "@angular/core";
import { Gratitude } from "./gratitude.model";

@Component({
    selector: 'app-gratitudes',
    templateUrl: './gratitudes.component.html',
    styleUrls: ['./gratitudes.component.css']
})
export class GratitudesComponent {
    gratitudes: Gratitude[] = [];

}