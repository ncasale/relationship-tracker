import { Component, Inject, OnInit } from "@angular/core";
import { GratitudeService } from "./gratitude.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormControl, Validators } from "@angular/forms";
import { Relationship } from "../../../relationships/relationship.model";
import { Gratitude } from "./gratitude.model";
import { MyDashService } from "../mydash.service";

@Component({
    selector: 'app-gratitude-dialog',
    templateUrl: './gratitude-dialog.component.html',
    styleUrls: ['./gratitude-dialog.component.css']
})
export class GratitudeDialogComponent implements OnInit{
    //Form Controls
    titleFC = new FormControl(null, Validators.required);
    textFC = new FormControl(null, Validators.required);

    relationship: Relationship;

    //Inject services
    constructor(
        private gratitudeService: GratitudeService,
        private myDashService: MyDashService,
        public dialogRef: MatDialogRef<GratitudeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ){}

    ngOnInit() {
        //Prepopulate fields on edit
        this.populateTitleOnEdit();
        this.populateTextOnEdit();
    }

    /**
     * Call gratitude service to submit gratitude object to db
     * 
     * @memberof GratitudeDialogComponent
     */
    onSubmitCreate() {
        //Create gratitude object
        var gratitude = new Gratitude(
            this.titleFC.value,
            this.textFC.value,
            undefined,
            this.data.relationship.relationshipId
        );
        //Call gratitude service to add gratitude to db
        this.gratitudeService.addGratitude(gratitude)
            .subscribe(
                (response: Gratitude) => {
                    //Add gratitude to the front end
                    this.gratitudeService.gratitudeCreatedEmitter.emit(response);
                    this.myDashService.openSnackBar('Gratitude Created', 'close');
                } 
            )
        //Close dialog
        this.dialogRef.close();
    }

    /**
     * Call gratitude service to edit gratitude object in db
     * 
     * @memberof GratitudeDialogComponent
     */
    onSubmitEdit() {
        //Modify gratitude object
        this.data.gratitude.title = this.titleFC.value;
        this.data.gratitude.text = this.textFC.value;        
        //Call gratitude service to edit gratitude in db
        this.gratitudeService.editGratitude(this.data.gratitude)
            .subscribe(
                (response: Gratitude) => {
                    this.gratitudeService.gratitudeEditedEmitter.emit();
                    this.myDashService.openSnackBar('Gratitude Edited', 'close');
                }
            )
        //Close dialog
        this.dialogRef.close();
    }

    /**
     * Prepopulate title field of dialog if editing
     * 
     * @memberof GratitudeDialogComponent
     */
    populateTitleOnEdit() {
        if(this.data.areEditing) {
            this.titleFC.setValue(this.data.gratitude.title);
        }
    }

    /**
     * Prepopulate text field of dialog if editing
     * 
     * @memberof GratitudeDialogComponent
     */
    populateTextOnEdit() {
        if(this.data.areEditing) {
            this.textFC.setValue(this.data.gratitude.text);
        }
    }


    /**
     * Return error message for title form control
     * 
     * @returns Error
     * @memberof GratitudeDialogComponent
     */
    getTitleErrorMessage() {
        return this.titleFC.hasError('required') ? 'You must enter a title' : '';
    }

    /**
     * Return error message for text form control
     * 
     * @returns Error
     * @memberof GratitudeDialogComponent
     */
    getTextErrorMessage() {
        return this.textFC.hasError('required') ? 'You must enter some text' : '';
    }

    /**
     * Returns whether or not we are editing or creating a new gratitude
     * 
     * @returns true if editing, false if creating
     * @memberof GratitudeDialogComponent
     */
    areEditing() {
        return this.data.areEditing;
    }
    /**
     * Checks if the form for a new gratitude is valid
     * 
     * @returns true if valid, false otherwise
     * @memberof GratitudeDialogComponent
     */
    isGratitudeValid() {
        return this.titleFC.valid &&
            this.textFC.valid;
    }

    
}