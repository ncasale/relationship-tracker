import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from "@angular/material";
import { RelationshipService } from "../../../relationships/relationship.service";
import { Relationship } from "../../../relationships/relationship.model";
import { Router } from "@angular/router";
import { MyDashService } from "../mydash.service";

@Component({
    selector: 'app-invite-dialog',
    templateUrl: './invite-dialog.component.html',
    styleUrls: ['./invite-dialog.component.css']
})
export class InviteDialogComponent implements OnInit{
    relationship: Relationship;
    emailFC = new FormControl(null, Validators.required);

    constructor(
        public dialogRef: MatDialogRef<InviteDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private relationshipService: RelationshipService,
        private router: Router,
        private myDashService: MyDashService
    ) {}

    ngOnInit() {
        //Subscribe to relationship set signal
        this.relationship = this.data.relationship;
    }

    /**
     * Send an invite to the current relationship to the email in the email form
     * 
     * @memberof InviteDialogComponent
     */
    sendInvite() {
        this.relationshipService.inviteToRelationship(this.relationship, this.emailFC.value)
        .subscribe(
            data => {
                this.myDashService.openSnackBar('User invited', 'close');
                this.dialogRef.close();
            }, 
            error => this.myDashService.openSnackBar('Invalid email or User already a member of relationship', 'close')
        );       
    }

    /**
     * Returns error message if email form isn't filled out properly
     * 
     * @returns Error
     * @memberof InviteDialogComponent
     */
    getEmailErrorMessage() {
        return this.emailFC.hasError('required') ? 'You must enter a valid email' : '';
    }
}