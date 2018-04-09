import { Component } from "@angular/core";
import { Relationship } from "../../relationships/relationship.model";
import { RelationshipService } from "../../relationships/relationship.service";
import { MessagesService } from "./messages/messages.service";

@Component({
    selector: 'app-mydash',
    templateUrl: './mydash.component.html',
    styleUrls: ['./mydash.component.css']
})
export class MyDashComponent {
    selectedRelationship: Relationship;
    relationships: Relationship[] = [];

    constructor(private relationshipService: RelationshipService, private messageService: MessagesService) {}

    /**
     * On init, contact RelationshipService to get a list of relationships
     * 
     * @memberof MyDashComponent
     */
    ngOnInit() {
        this.relationshipService.getRelationships()
            .subscribe(
                (relationships: Relationship[]) => {
                    this.relationships = relationships;
                }
            )

    }

    /**
     * Set the currently selected relationship in MyDash
     * 
     * @param {Relationship} relationship 
     * @memberof MyDashComponent
     */
    setCurrentRelationship(relationship: Relationship) {
        this.selectedRelationship = relationship;
        //Emit signal to update relationship in message service
        this.messageService.currentMyDashRelationshipEmitter.emit(this.selectedRelationship);
    }
}