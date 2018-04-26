import { Component, Inject, Input } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from "@angular/material";
import { FormControl, Validators } from "@angular/forms";
import { RelationshipService } from "../../../relationships/relationship.service";
import { Router } from "@angular/router";
import { MyDashService } from "../mydash.service";

@Component({
    selector: 'app-leave-relationship-dialog',
    templateUrl: './leave-dialog.component.html',
    styleUrls: ['./leave-dialog.component.css']
})
export class LeaveDialogComponent {
    nameConfirmationFC = new FormControl(null, Validators.required);

    //Inject services
    constructor(
        public dialogRef: MatDialogRef<LeaveDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private relationshipService: RelationshipService,
        private router: Router,
        private myDashService: MyDashService,
        public snackBar: MatSnackBar
    ) {}

    /**
     * Does a string compare of new password and confirm password
     * 
     * @returns true if confirm matches new, false otherwise
     * @memberof LeaveDialogComponent
     */
    compareName() {
        return this.nameConfirmationFC.value == this.data.relationship.title;
    }

    /**
     * Call relationship service to leave this relationship. Route user to dashboard
     * 
     * @memberof LeaveDialogComponent
     */
    leaveRelationship() {
        this.dialogRef.close();
        this.relationshipService.leaveRelationship(this.data.relationship.relationshipId)
            .subscribe(
                (response: any) => {
                    this.myDashService.updateMyDashRelationships.emit(null);
                    this.router.navigateByUrl('/dashboard');
                }
            )
        //Open snackbar alert
        this.myDashService.openSnackBar('Left Relationship', 'close');
    }
}