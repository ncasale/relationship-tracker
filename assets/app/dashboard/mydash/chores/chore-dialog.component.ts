import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { Relationship } from '../../../relationships/relationship.model';
import { RelationshipService } from '../../../relationships/relationship.service';
import { User } from '../../../auth/user.model';
import { AuthService } from '../../../auth/auth.service';

@Component({
    selector: 'app-chore-dialog',
    templateUrl: './chore-dialog.component.html',
    styleUrls: ['./chore-dialog.component.css']
})
export class ChoreDialogComponent implements OnInit{

    //Initialize form controls
    title = new FormControl (null, Validators.required);
    assignedUserId = new FormControl(null, Validators.required);

    //Array of possible users to assign chore to
    assignedUsers: User[] = [];

    //REMOVE
    foods = [
        {value: 'steak-0', viewValue: 'Steak'},
        {value: 'pizza-1', viewValue: 'Pizza'},
        {value: 'tacos-2', viewValue: 'Tacos'}
      ];

    constructor(
        public dialogRef: MatDialogRef<ChoreDialogComponent>,
        private relationshipService: RelationshipService,
        private authService: AuthService,
        @Inject(MAT_DIALOG_DATA) public data: any) {}

    ngOnInit() {
        //Prepopulate fields if editing
        this.checkEditTitle();

        //Get array of users for this relationship
        this.relationshipService.getRelationshipUsers(this.data.relationship.relationshipId)
            .subscribe(
                (userIds: string[]) => {
                    console.log('Relationship User IDs: ', userIds);
                    for(let userId of userIds) {
                        this.authService.getUser(userId)
                            .subscribe(
                                (response: User) => {
                                    this.assignedUsers.push(response);
                                }
                            )                            
                    }
                    //Assign this array to a local array and use to populate select menu
                }
            )
    }

    /**
     * Call date service to add new date to database using form data
     * 
     * @memberof DateDialogComponent
     */
    onSubmitCreate() {
        /*
        var date = new DateObj(
            this.title.value,
            new Date(),
            undefined,
            this.data.relationship.relationshipId
        );
        this.dateService.saveDate(date)
            .subscribe((response: any) => {
                console.log('Saved Date...');
            })
            */

        //Close the dialog
        this.dialogRef.close();
    }

    /**
     * Call Date Service to edit date in database
     * 
     * @memberof DateDialogComponent
     */
    onSubmitEdit() {
        //Alter date
        //this.data.date.title = this.title.value;
        /*
        this.dateService.editDate(this.data.date)
            .subscribe((response: any) => {
                console.log('Edited Date...');
            })
            */

        //Close the dialog
        this.dialogRef.close();

    }


    /**
     * Display error message if Title field invalid
     * 
     * @returns Error
     * @memberof DateDialogComponent
     */
    getTitleErrorMessage() {
        return this.title.hasError('required') ? 'You must enter a title' :
                '';
    }

    /**
     * Display error message if Title field invalid
     * 
     * @returns Error
     * @memberof DateDialogComponent
     */
    getAssignedUserErrorMessage() {
        return this.title.hasError('required') ? 'You must assign chore to a user' :
                '';
    }

    

    /**
     * If we are editing, prepopulate dialog with title of date
     * 
     * @memberof DateDialogComponent
     */
    checkEditTitle() {
        if(this.data.editTitle) {
            this.title.setValue(this.data.editTitle);
        }
    }

    

    /**
     * Return true if we are editing a date, false if creating
     * 
     * @returns 
     * @memberof DateDialogComponent
     */
    areEditing() {
        return this.data.areEditing;
    }

    // getDatepickerErrorMessage() {
    //     return this.datepicker.hasError('required') ? 
    //         'You must pick a valid date' :
    //         '';
    // }    

    isDateValid() {
        return this.title.valid &&
            this.assignedUserId.valid;
            
            //&&
            //this.datepicker.valid;
        //return (this.dateForm.valid && )
    }
    

}