import { Component, Input, EventEmitter } from "@angular/core";
import { Relationship } from "./relationship.model";
import { RelationshipService } from "./relationship.service";

/**
 * Representation of a relationship in the app. Displays as a card.
 * 
 * @export
 * @class RelationshipComponent
 */
@Component({
    selector: 'app-relationship',
    templateUrl: './relationship.component.html',
    styles: [`
        .author {
            display: inline-block;
            font-style: italic;
            font-size: 12px;
            width: 80%;
        }
        .config {
            display: inline-block;
            text-align: right;
            font-size: 12px;
            width: 19%;
        }
    `]
})
export class RelationshipComponent {
    @Input() relationship: Relationship;

    //Inject RelationshipService
    constructor(private relationshipService: RelationshipService) {}

    /**
     * Send signal to toggle invite component visibility and set relationship
     * 
     * @memberof RelationshipComponent
     */
    showInvite() {
        this.relationshipService.setInviteRelationship(this.relationship);
        this.relationshipService.toggleInvite();
    }



}