import { Component, Input } from "@angular/core";
import { Gratitude } from "./gratitude.model";

@Component({
    selector: 'app-gratitude-card',
    templateUrl: './gratitude-card.component.html',
    styleUrls: ['./gratitude-card.component.css']
})
export class GratitudeCardComponent {
    @Input() gratitude: Gratitude;

    editGratitude() {
        console.log('Editing gratitude...');
    }

    deleteGratitude() {
        console.log('Deleting gratitude...');
    }

}