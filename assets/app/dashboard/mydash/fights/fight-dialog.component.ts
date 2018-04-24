import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Fight } from "./fight.model";
import { FightService } from "./fight.service";
import { MyDashService } from "../mydash.service";

@Component({
    selector: 'app-fight-dialog',
    templateUrl: './fight-dialog.component.html', 
    styleUrls: ['./fight-dialog.component.css']
})
export class FightDialogComponent implements OnInit{
    //Initialize form controls
    titleFC = new FormControl(null, Validators.required);
    descriptionFC = new FormControl(null, Validators.required);
    causeFC = new FormControl(null, Validators.required);
    resolutionFC = new FormControl(null, Validators.required);
    fightDateFC = new FormControl(new Date(), Validators.required);

    //Inject services
    constructor(
        public dialogRef: MatDialogRef<FightDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fightService: FightService,
        private myDashSerice: MyDashService
    ) {}

    ngOnInit() {
        this.prepopulateEditFields();
    }

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
                this.fightService.fightCreated.emit(response);
                this.myDashSerice.openSnackBar('Fight Created.', 'close');
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
        //Apply edits to fight
        this.data.fight.title = this.titleFC.value;
        this.applyDescriptionsEdit();
        this.applyCausesEdit();
        this.applyResolutionsEdit();
        this.data.fight.fightDate = this.fightDateFC.value;

        //Call fight service to edit fight in database
        this.fightService.editFight(this.data.fight)
            .subscribe(
                (response: any) => {
                    console.log('Finished editing fight...');
                    this.myDashSerice.openSnackBar('Edited Fight', 'close');
                }
            )
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
     * If we are editing, pre-populate fields with existing values for fight
     * 
     * @memberof FightDialogComponent
     */
    prepopulateEditFields() {
        if(this.data.areEditing) {
            this.titleFC.setValue(this.data.fight.title);
            this.descriptionFC.setValue(this.findUserDescription().text);
            this.causeFC.setValue(this.findUserCause().text);
            this.resolutionFC.setValue(this.findUserResolution().text);
            this.fightDateFC.setValue(this.data.fight.fightDate);
        }
    }

    /**
     * Find the description this user provided for the fight
     * 
     * @returns 
     * @memberof FightDialogComponent
     */
    findUserDescription() {
        if(this.data.fight.descriptions) {
            //Iterate through descriptions and return the one belonging to user
            for(let description of this.data.fight.descriptions) {
                if(description.userId == localStorage.getItem('userId')) {
                    return description;
                }
            }
        }
    }

    /**
     * Find the cause this user provided for the fight
     * 
     * @returns 
     * @memberof FightDialogComponent
     */
    findUserCause() {
        if(this.data.fight.causes) {
            for(let cause of this.data.fight.causes) {
                if(cause.userId == localStorage.getItem('userId')) {
                    return cause;
                }
            }
        }
    }

    /**
     * Find the resolution this user provided for the fight
     * 
     * @returns 
     * @memberof FightDialogComponent
     */
    findUserResolution() {
        if(this.data.fight.resolutions) {
            for(let resolution of this.data.fight.resolutions) {
                if(resolution.userId == localStorage.getItem('userId')) {
                    return resolution;
                }
            }
        }
    }

    /**
     * Apply edits to description to fight descriptions
     * 
     * @memberof FightDialogComponent
     */
    applyDescriptionsEdit() {
        if(this.data.fight.descriptions) {
            //Iterate through descriptions and update the users description
            for(let description of this.data.fight.descriptions) {
                if(description.userId == localStorage.getItem('userId')) {
                    description.text = this.descriptionFC.value;
                }
            }
        }
    }

    /**
     * Apply edits to cause to fight causes
     * 
     * @memberof FightDialogComponent
     */
    applyCausesEdit() {
        if(this.data.fight.causes) {
            //Iterate through causes and update the user's cause
            for(let cause of this.data.fight.causes) {
                if(cause.userId == localStorage.getItem('userId')) {
                    cause.text = this.causeFC.value;
                }
            }
        }
    }

    /**
     * Apply edits to resolution to fight resolutions
     * 
     * @memberof FightDialogComponent
     */
    applyResolutionsEdit() {
        if(this.data.fight.resolutions) {
            //Iterate through resolutions and update the user's resolution
            for(let resolution of this.data.fight.resolutions) {
                if(resolution.userId == localStorage.getItem('userId')) {
                    resolution.text = this.resolutionFC.value;
                }
            }
        }
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