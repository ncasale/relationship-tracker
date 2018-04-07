import { Component, OnInit } from "@angular/core";
import { RelationshipService } from "./relationship.service";
import { Relationship } from "./relationship.model";

/**
 * Represents a list of relationships in the app
 * 
 * @export
 * @class RelationshipListComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-relationship-list',
    templateUrl: './relationship-list.component.html'
})
export class RelationshipListComponent implements OnInit{
    relationships : Relationship[];
    //Inject RelationshipService
    constructor(private relationshipService: RelationshipService) {}

    /**
     * On init, contact RelationshipService to get a list of relationships
     * 
     * @memberof RelationshipListComponent
     */
    ngOnInit() {
        this.relationshipService.getRelationships()
            .subscribe(
                (relationships: Relationship[]) => {
                    this.relationships = relationships;
                }
            )

    }

}