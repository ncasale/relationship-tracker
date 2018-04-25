import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { RelationshipService } from "../../../relationships/relationship.service";
import { MatSnackBar, MatDialog } from "@angular/material";
import { InviteDialogComponent } from "./invite-dialog.component";
import { MessagesService } from "../messages/messages.service";
import { Relationship } from "../../../relationships/relationship.model";
import { Subscription } from "rxjs/Subscription";
import { MyDashService } from "../mydash.service";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy{
    relationship: Relationship;
    currentRelationshipSubscription: Subscription;
    
    //Inject services
    constructor(
        private relationshipService: RelationshipService,
        private messsagesService: MessagesService,
        private inviteDialog: MatDialog,
        private myDashService: MyDashService
    ) {}

    ngOnInit() {
        //Subscribe to current mydash relationship
        this.currentRelationshipSubscription = this.myDashService.getCurrentRelationship()
            .subscribe(
                relationship => {
                    this.relationship = relationship;
                }
            )

        //Have to fire observable again since we subscribe after it is intially sent
        this.myDashService.conditionallyEmitRelationship();

    }

    ngOnDestroy() {
        console.log('Settings unsubscribed...');
        this.currentRelationshipSubscription.unsubscribe();
    }

    /**
     * Show the dialog to invite a user to the relationship
     * 
     * @memberof SettingsComponent
     */
    showInviteDialog() {
        let dialogRef = this.inviteDialog.open(InviteDialogComponent, {
            width: "500px",
            data: {
                relationship: this.relationship
            }
        })
    }
}