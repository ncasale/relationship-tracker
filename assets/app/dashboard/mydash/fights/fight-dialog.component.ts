import { Component, Inject } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Fight } from "./fight.model";
import { FightService } from "./fight.service";

@Component({
    selector: 'app-fight-dialog',
    templateUrl: './fight-dialog.component.html', 
    styleUrls: ['./fight-dialog.component.css']
})
export class FightDialogComponent {
    //Initialize form controls
    titleFC = new FormControl(null, Validators.required);
    descriptionFC = new FormControl(null, Validators.required);
    causeFC = new FormControl(null, Validators.required);
    resolutionFC = new FormControl(null, Validators.required);
    fightDateFC = new FormControl(Date.now(), Validators.required);

    //Inject services
    constructor(
        public dialogRef: MatDialogRef<FightDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fightService: FightService
    ) {}

    /**
     * Submit a newly created fight to database
     * 
     * @memberof FightDialogComponent
     */
    onSubmitCreate() {
        //Create a new fight
        const userId = localStorage.getItem('userId');
        var fight = new Fight(
            this.titleFC.value,
            [{ text: this.descriptionFC.value, userId: userId }],
            [{ text: this.causeFC.value, userId: userId }],
            [{ text: this.resolutionFC.value, userId: userId }],
            this.fightDateFC.value,
            this.data.relationshipId
        );
        //Use fight service to add fight to db
        this.fightService.addFight(fight)
        .subscribe(
            (response: Fight) => {
                console.log('Added fight...');
            }
        )
        //Close dialog
        this.dialogRef.close();
    }
    
    /**
     * Submit an edit to an existing fight
     * 
     * @memberof FightDialogComponent
     */
    onSubmitEdit() {
        console.log('Submitting edit...');

        //Close dialog
        this.dialogRef.close();
    }

    /**
     * Return an error message if Title field not properly filled out
     * 
     * @returns Error
     * @memberof FightDialogComponent
     */
    getTitleErrorMessage() {
        return this.titleFC.hasError('required') ? 'You must enter a title for the fight' : '';
    }

    /**
     * Return an error message if Description field not properly filled out
     * 
     * @returns Error
     * @memberof FightDialogComponent
     */
    getDescriptionErrorMessage() {
        return this.descriptionFC.hasError('required') ? 'You must enter a description for the fight' : '';
    }

    /**
     * Return an error message if Cause field not properly filled out
     * 
     * @returns Error
     * @memberof FightDialogComponent
     */
    getCauseErrorMessage () {
        return this.causeFC.hasError('required') ? 'You must enter a cause for the fight' : '';
    }

    /**
     * Return an error message if Resolution field not properly filled out
     * 
     * @returns Error
     * @memberof FightDialogComponent
     */
    getResolutionErrorMessage() {
        return this.resolutionFC.hasError('required') ? 'You must enter a resolution for the fight' : '';
    }

    /**
     * Return an error message if Fight Date field not properly filled out
     * 
     * @returns Error
     * @memberof FightDialogComponent
     */
    getFightDateErrorMessage() {
        return this.fightDateFC.hasError('required') ? 'You must enter the date on which this fight happend' : '';
    }

    /**
     * Returns true if we are editing an existing fight, false otherwise
     * 
     * @returns boolean
     * @memberof FightDialogComponent
     */
    areEditing() {
        return this.data.areEditing;
    }

    /**
     * Returns true if all fields in fight form properly filled out
     * 
     * @returns boolean
     * @memberof FightDialogComponent
     */
    isFightValid() {
        return this.titleFC.valid &&
            this.descriptionFC.valid &&
            this.causeFC.valid &&
            this.resolutionFC.valid &&
            this.fightDateFC.valid;
    }


}