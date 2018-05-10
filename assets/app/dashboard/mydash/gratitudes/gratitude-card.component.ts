import { Component, Input } from "@angular/core";
import { Gratitude } from "./gratitude.model";
import { GratitudeService } from "./gratitude.service";
import { GratitudeDialogComponent } from "./gratitude-dialog.component";
import { MatDialog } from "@angular/material";
import { DeleteItemDialogComponent } from "../common/delete-item-dialog.component";
import { MyDashService } from "../mydash.service";

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
        private myDashService: MyDashService,
        public editGratitudeDialog: MatDialog,
        public deleteDialog: MatDialog
    ){}

    /**
     * Open edit gratitude dialog
     * 
     * @memberof GratitudeCardComponent
     */
    editGratitude() {
        let dialogRef = this.editGratitudeDialog.open(GratitudeDialogComponent, {
            width: '500px',
            data: {
                areEditing: true,
                gratitude: this.gratitude
            },
            autoFocus: false
        })
    }

    /**
     * Open delete dialog. If user confirms deletion, delete gratitude from db/frontend
     * 
     * @memberof GratitudeCardComponent
     */
    deleteGratitude() {
        let dialogRef = this.deleteDialog.open(DeleteItemDialogComponent, {
            width: '500px',
            autoFocus: false
        });

        dialogRef.afterClosed().subscribe(
            result => {
                if(result) {
                    this.gratitudeService.deleteGratitude(this.gratitude.gratitudeId)
                        .subscribe(
                            (response: any) => {
                                this.gratitudeService.gratitudeDeletedEmitter.emit(this.gratitude);
                                this.myDashService.openSnackBar('Gratitude Deleted.', 'close');
                            }
                        )
                }
            }
        )
    }
}