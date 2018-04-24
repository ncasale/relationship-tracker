import { Component, Input } from "@angular/core";
import { Relationship } from "../../relationships/relationship.model";
import { RelationshipService } from "../../relationships/relationship.service";
import { Router } from "@angular/router";
import { MyDashService } from "../mydash/mydash.service";

@Component({
    selector: 'app-join-card',
    templateUrl: './join-card.component.html'
})
export class JoinCardComponent {
    //The relationship to join from this card
    @Input() relationship: Relationship;

    //Inject services
    constructor(
        private relationshipService: RelationshipService,
        private router: Router,
        private myDashService: MyDashService    
    ) {}

    /**
     * Call relationship service to accept a relationship invite
     * 
     * @memberof JoinCardComponent
     */
    acceptInvite() {
        this.relationshipService.removeInviteId.emit(this.relationship.relationshipId);
        this.relationshipService.acceptRelationshipInvite(this.relationship.relationshipId)
            .subscribe(
                (response: any) => {
                    this.myDashService.openSnackBar('Invite Accepted.', 'close');
                }
            );
        this.router.navigateByUrl('dashboard/join');
    }

    /**
     * Call relationship service to decline a relationship invite
     * 
     * @memberof JoinCardComponent
     */
    declineInvite() {
        this.relationshipService.removeInviteId.emit(this.relationship.relationshipId);
        this.relationshipService.declineRelationshipInvite(this.relationship.relationshipId)
            .subscribe(
                (response: any) => {
                    this.myDashService.openSnackBar('Invite Declined.', 'close');
                }
            );        
        this.router.navigateByUrl('dashboard/join');
    }

}