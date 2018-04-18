import { Component, OnInit, Input } from "@angular/core";
import { Chore } from "./chore.model";

@Component({
    selector: 'app-chore-card',
    templateUrl: './chore-card.component.html',
    styleUrls: ['./chore-card.component.css']
})
export class ChoreCardComponent implements OnInit{
    //The chore to display on card
    @Input() chore: Chore;

    ngOnInit() {
        //
    }

    editChore() {
        console.log('Editing chore...');
    }

    deleteChore() {
        console.log('Deleting chore...');
    }

}