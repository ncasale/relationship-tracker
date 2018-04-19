import { Component, Input } from "@angular/core";
import { Fight } from "./fight.model";

@Component({
    selector: 'app-fight-card',
    templateUrl: './fight-card.component.html',
    styleUrls: ['./fight-card.component.css']
})
export class FightCardComponent {
    //The fight displayed on this card
    @Input() fight: Fight;

    editFight() {
        console.log("Editing fight...");
    }

    deleteFight() {
        console.log('Deleting Fight...');
    }

}