import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { RelationshipService } from "../../../relationships/relationship.service";
import { MatSnackBar, MatDialog } from "@angular/material";
import { InviteDialogComponent } from "./invite-dialog.component";
import { MessagesService } from "../messages/messages.service";
import { Relationship } from "../../../relationships/relationship.model";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit{
    relationship: Relationship;
    
    //Inject services
    constructor(
        private relationshipService: RelationshipService,
        private messsagesService: MessagesService,
        public snackBar: MatSnackBar,
        private inviteDialog: MatDialog) {}

        ngOnInit() {
            this.messsagesService.currentMyDashRelationshipEmitter.subscribe(
                (relationship: Relationship) => {
                    this.relationship = relationship;
                }
            )
        }

    toggleInvite() {
        this.relationshipService.toggleInvite();
    }

    showInviteDialog() {
        let dialogRef = this.inviteDialog.open(InviteDialogComponent, {
            width: "500px",
            data: {
                relationship: this.relationship
            }
        })
    }
}