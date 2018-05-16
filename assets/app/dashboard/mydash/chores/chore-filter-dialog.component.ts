import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormControl } from "@angular/forms";
import { User } from "../../../auth/user.model";
import { RelationshipService } from "../../../relationships/relationship.service";
import { AuthService } from "../../../auth/auth.service";
import { ChoreService } from "./chore.service";
import { Chore } from "./chore.model";

@Component({
    selector: 'app-chore-filter-dialog',
    templateUrl: './chore-filter-dialog.component.html',
    styleUrls: ['./chore-filter-dialog.component.css']
})
export class ChoreFilterDialogComponent implements OnInit{
    //Initialize form controls
    assignedUserId = new FormControl(null);
    dueDateBefore = new FormControl(null);
    dueDateAfter = new FormControl(null);

    //Array of possible users to assign to
    assignedUsers: User[] = [];

    //Local copies of chores
    chores: Chore[] = [];
    unfilteredChores: Chore[] = [];

    constructor(
        public dialogRef: MatDialogRef<ChoreFilterDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private relationshipService: RelationshipService,
        private authService: AuthService,
        private choreService: ChoreService
    ){}

    ngOnInit() {
        //Get array of users for this relationship
        this.relationshipService.getRelationshipUsers(this.data.relationship.relationshipId)
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
     * Called when apply button hit. Apply any filtering that has been selected
     * 
     * @memberof ChoreFilterDialogComponent
     */
    onSubmitFilter() {
        //Log old chores
        this.unfilteredChores = Object.assign([], this.data.chores);
        this.chores = Object.assign([], this.data.chores);
        //Apply filters
        this.filterByAssignee();
        this.filterByDateBefore();
        this.filterByDateAfter();
        //If we applied any filters, update frontend
        if(this.data.filtered) {
            this.choreService.recordOriginalChores.emit(this.unfilteredChores);
            this.choreService.choresFiltered.emit(this.chores);
        }
        //Close dialog
        this.dialogRef.close();
    }

    /**
     * Apply dueDateBefore filter if necessary
     * 
     * @memberof ChoreFilterDialogComponent
     */
    filterByDateBefore() {
        if(this.dueDateBefore.value != null) {
            this.data.filtered = true;
            this.chores = this.chores.filter(
                (chore) => Date.parse(chore.dueDate.toString()) < Date.parse(this.dueDateBefore.value)
            );
        }        
    }

    /**
     * Apply Date After filter if necessary
     * 
     * @memberof ChoreFilterDialogComponent
     */
    filterByDateAfter() {
        if(this.dueDateAfter.value != null) {
            this.data.filtered = true;
            this.chores = this.chores.filter(
                (chore) => Date.parse(chore.dueDate.toString()) > Date.parse(this.dueDateAfter.value)
            );
        }
    }

    /**
     * Aply assignee filter if necessary
     * 
     * @memberof ChoreFilterDialogComponent
     */
    filterByAssignee() {
        if(this.assignedUserId.value != null) {
            this.data.filtered = true;
            this.chores = this.data.chores.filter((chore) => {
                return chore.assignedUserId == this.assignedUserId.value
            });
        }
    }

    getMinimumAfterDate() {
        if(this.dueDateBefore.value != null) {
            return this.dueDateBefore.value;
        } else {
            return null;
        }
    }

    getMaximumBeforeDate() {
        if(this.dueDateAfter.value != null) {
            return this.dueDateAfter.value;
        } else {
            return null;
        }
    }


}