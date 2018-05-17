import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { RelationshipService } from "../../../relationships/relationship.service";
import { MatSnackBar, MatDialog } from "@angular/material";
import { InviteDialogComponent } from "./invite-dialog.component";
import { MessagesService } from "../messages/messages.service";
import { Relationship } from "../../../relationships/relationship.model";
import { Subscription } from "rxjs/Subscription";
import { MyDashService } from "../mydash.service";
import { Router } from "@angular/router";
import { LeaveDialogComponent } from "./leave-dialog.component";
import { User } from "../../../auth/user.model";
import { AuthService } from "../../../auth/auth.service";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy{
    relationship: Relationship;
    currentRelationshipSubscription: Subscription;
    relationshipMembers: User[] = [];
    pendingInvitees: User[] = [];
    
    //Inject services
    constructor(
        private relationshipService: RelationshipService,
        private messsagesService: MessagesService,
        private inviteDialog: MatDialog,
        private myDashService: MyDashService,
        private authService: AuthService,
        private router: Router,
        public leaveDialog: MatDialog
    ) {}

    ngOnInit() {
        //Subscribe to current mydash relationship
        this.currentRelationshipSubscription = this.myDashService.getCurrentRelationship()
            .subscribe(
                relationship => {
                    this.relationship = relationship;
                    //Get relationship members
                    this.authService.getUsers(this.relationship.userIds).subscribe(
                        (response: User[]) => {
                            this.relationshipMembers = response;
                        }
                    )
                    //Get pending invitees
                    this.authService.getUsers(this.relationship.invitees).subscribe(
                        (response: User[]) => {
                            this.pendingInvitees = response;
                        }
                    )
                }
            )

        //Have to fire observable again since we subscribe after it is intially sent
        this.myDashService.conditionallyEmitRelationship();

    }

    ngOnDestroy() {
        this.currentRelationshipSubscription.unsubscribe();
    }

    /**
     * Show the dialog to invite a user to the relationship
     * 
     * @memberof SettingsComponent
     */
    showInviteDialog() {
        let dialogRef = this.inviteDialog.open(InviteDialogComponent, {
            position: {
                top: '10vh'
            },
            width: "500px",
            data: {
                relationship: this.relationship
            },
            autoFocus: false
        })
    }

    openLeaveRelationshipDialog() {
        let dialogRef = this.leaveDialog.open(LeaveDialogComponent, {
            width: '750px', 
            data: {
                relationship: this.relationship
            },
            autoFocus: false
        })
        
    }
}