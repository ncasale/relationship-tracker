import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from "@angular/material";
import { FormControl, Validators } from "@angular/forms";
import { FightService } from "./fight.service";

@Component({
    selector: 'app-fight-append-dialog',
    templateUrl: './fight-append-dialog.component.html',
    styleUrls: ['./fight-append-dialog.component.css']
})
export class FightAppendDialogComponent {
    //Form Controls
    descriptionFC = new FormControl(null, Validators.required);
    causeFC = new FormControl(null, Validators.required);
    resolutionFC = new FormControl(null, Validators.required);

    //Inject services
    constructor(
        public dialogRef: MatDialogRef<FightAppendDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fightService: FightService,
        public snackBar: MatSnackBar
    ) {}

    /**
     * Return an error message if description field not properly filled out
     * 
     * @returns Error 
     * @memberof FightAppendDialogComponent
     */
    getDescriptionErrorMessage() {
        return this.descriptionFC.hasError('required') ? 'You must enter a description' : '';
    }

    /**
     * Return an error message if cause field not properly filled out
     * 
     * @returns Error 
     * @memberof FightAppendDialogComponent
     */
    getCauseErrorMessage() {
        return this.causeFC.hasError('required') ? 'You must enter a cause' : '';
    }

    /**
     * Return an error message if resolution field not properly filled out
     * 
     * @returns Error 
     * @memberof FightAppendDialogComponent
     */
    getResolutionErrorMessage() {
        return this.resolutionFC.hasError('required') ? 'You must enter a resolution' : '';
    }

    /**
     * Check if form filled out correctly
     * 
     * @returns boolean - true if form valid, false otherwise
     * @memberof FightAppendDialogComponent
     */
    isAppendValid() {
        return this.descriptionFC.valid &&
            this.causeFC.valid &&
            this.resolutionFC.valid;
    }

    /**
     * Append newly entered information to existing fight in database
     * 
     * @memberof FightAppendDialogComponent
     */
    onSubmitAppend() {
        //Append to existing fight
        this.data.fight.descriptions.push({
            text: this.descriptionFC.value,
            userId: localStorage.getItem('userId')
        });
        this.data.fight.causes.push({
            text: this.causeFC.value,
            userId: localStorage.getItem('userId')
        });
        this.data.fight.resolutions.push({
            text: this.resolutionFC.value,
            userId: localStorage.getItem('userId')
        })
        //Call fight service to send edited fight to database
        this.fightService.editFight(this.data.fight)
            .subscribe(
                (response: any) => {
                    //Show snackbar
                    var snackBarMessage = "Submission Successful. Please reload page to see fight.";
                    this.openSnackBar(snackBarMessage, 'close');
                }
            );
        //Close dialog
        this.dialogRef.close();
    }

    /**
     * Open a snackbar message
     * 
     * @param {string} message the message to display
     * @param {string} action the action text
     * @memberof FightAppendDialogComponent
     */
    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
          duration: 3500,
        });
    }
}