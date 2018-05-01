import { Component, Input } from "@angular/core";
import { Gratitude } from "./gratitude.model";
import { GratitudeService } from "./gratitude.service";
import { GratitudeDialogComponent } from "./gratitude-dialog.component";
import { MatDialog } from "@angular/material";

@Component({
    selector: 'app-gratitude-card',
    templateUrl: './gratitude-card.component.html',
    styleUrls: ['./gratitude-card.component.css']
})
export class GratitudeCardComponent {
    @Input() gratitude: Gratitude;

    //Inject services
    constructor(
        private gratitudeService: GratitudeService,
        public editGratitudeDialog: MatDialog
    ){}

    /**
     * Open edit gratitude dialog
     * 
     * @memberof GratitudeCardComponent
     */
    editGratitude() {
        this.editGratitudeDialog.open(GratitudeDialogComponent, {
            width: '500px',
            data: {
                areEditing: true,
                gratitude: this.gratitude
            }
        })
    }

    deleteGratitude() {
        console.log('Deleting gratitude...');
    }

}