import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from "@angular/material";
import { RelationshipService } from "../../../relationships/relationship.service";
import { Relationship } from "../../../relationships/relationship.model";
import { Router } from "@angular/router";

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
        public snackBar: MatSnackBar
    ) {}

    ngOnInit() {
        //Subscribe to relationship set signal
        this.relationship = this.data.relationship;
    }

    sendInvite() {
        this.relationshipService.inviteToRelationship(this.relationship, this.emailFC.value)
        .subscribe(
            data => {
                this.openSnackBar('User invited', 'close');
                this.dialogRef.close();
            }, 
            error => this.openSnackBar('Invalid email or User already a member of relationship', 'close')
        );       
    }

    getEmailErrorMessage() {
        return this.emailFC.hasError('required') ? 'You must enter a valid email' : '';
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
          duration: 3500,
        });
    }
}