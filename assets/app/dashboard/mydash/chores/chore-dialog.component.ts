import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { Relationship } from '../../../relationships/relationship.model';
import { RelationshipService } from '../../../relationships/relationship.service';
import { User } from '../../../auth/user.model';
import { AuthService } from '../../../auth/auth.service';
import { Chore } from './chore.model';
import { ChoreService } from './chore.service';

@Component({
    selector: 'app-chore-dialog',
    templateUrl: './chore-dialog.component.html',
    styleUrls: ['./chore-dialog.component.css']
})
export class ChoreDialogComponent implements OnInit{

    //Initialize form controls
    title = new FormControl (null, Validators.required);
    assignedUserId = new FormControl(null, Validators.required);
    selectedUser: string;

    //Array of possible users to assign chore to
    assignedUsers: User[] = [];

    constructor(
        public dialogRef: MatDialogRef<ChoreDialogComponent>,
        private relationshipService: RelationshipService,
        private authService: AuthService,
        private choreService: ChoreService,
        @Inject(MAT_DIALOG_DATA) public data: any) {}

    ngOnInit() {
        //Prepopulate fields if editing
        this.checkEditTitle();
        this.checkEditAssignedUser();


        //Get array of users for this relationship
        this.relationshipService.getRelationshipUsers(this.data.relationshipId)
            .subscribe(
                (userIds: string[]) => {
                    for(let userId of userIds) {
                        this.authService.getUser(userId)
                            .subscribe(
                                (response: User) => {
                                    response.userId = userId;
                                    this.assignedUsers.push(response);
                                }
                            )                            
                    }
                }
            )
    }

    /**
     * Call chore service to add new chore to database using form data
     * 
     * @memberof ChoreDialogComponent
     */
    onSubmitCreate() {
        //Create a chore
        var chore = new Chore(
            this.title.value,
            new Date(),
            this.assignedUserId.value,
            this.data.relationshipId
        );
        //Call chore service to save chore
        this.choreService.addChore(chore)
            .subscribe(
                (response: any) => {
                    //console.log(response);
                }
            )
        //Close the dialog
        this.dialogRef.close();
    }

    /**
     * Call Date Service to edit date in database
     * 
     * @memberof DateDialogComponent
     */
    onSubmitEdit() {
        //Alter chore object
        this.data.chore.title = this.title.value;
        this.data.chore.assignedUserId = this.assignedUserId.value;

        //Call edit chore service
        this.choreService.editChore(this.data.chore)
            .subscribe(
                (response: any) => {
                }
            )            
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
        return this.assignedUserId.hasError('required') ? 'You must assign chore to a user' :
                '';
    }

    

    /**
     * If we are editing, prepopulate dialog with title of date
     * 
     * @memberof DateDialogComponent
     */
    checkEditTitle() {
        if(this.data.areEditing) {
            this.title.setValue(this.data.chore.title);
        }
    }

    /**
     * If we are editing, pre-select user to which this chore was originally assigned
     * 
     * @memberof ChoreDialogComponent
     */
    checkEditAssignedUser() {
        if(this.data.areEditing) {
            this.selectedUser = this.data.chore.assignedUserId;
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

    isChoreValid() {
        return this.title.valid &&
            this.assignedUserId.valid;
            
            //&&
            //this.datepicker.valid;
        //return (this.dateForm.valid && )
    }
    

}