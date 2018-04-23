import { Component, Input } from "@angular/core";
import { Relationship } from "../../relationships/relationship.model";
import { RelationshipService } from "../../relationships/relationship.service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-join-card',
    templateUrl: './join-card.component.html'
})
export class JoinCardComponent {
    //The relationship to join from this card
    @Input() relationship: Relationship;

    //Inject services
    constructor(private relationshipService: RelationshipService, private router: Router) {}

    /**
     * Call relationship service to accept a relationship invite
     * 
     * @memberof JoinCardComponent
     */
    acceptInvite() {
        this.relationshipService.removeInviteId.emit(this.relationship.relationshipId);
        this.relationshipService.acceptRelationshipInvite(this.relationship.relationshipId)
            .subscribe();
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
            .subscribe();        
        this.router.navigateByUrl('dashboard/join');
    }

}