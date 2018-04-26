import { Component } from "@angular/core";
import { Relationship } from "../../relationships/relationship.model";
import { RelationshipService } from "../../relationships/relationship.service";
import { MessagesService } from "./messages/messages.service";
import { MyDashService } from "./mydash.service";

import { Subscription } from "rxjs/Subscription";
import { Router } from "@angular/router";

@Component({
    selector: 'app-mydash',
    templateUrl: './mydash.component.html',
    styleUrls: ['./mydash.component.css']
})
export class MyDashComponent {
    selectedRelationship: Relationship;
    relationships: Relationship[] = [];
    relationshipSubscription: Subscription;
    noRelationships = false;

    constructor(
        private relationshipService: RelationshipService, 
        private messageService: MessagesService,
        private myDashService: MyDashService,
        private router: Router
    ) {}

    /**
     * On init, contact RelationshipService to get a list of relationships
     * 
     * @memberof MyDashComponent
     */
    ngOnInit() {
        //Get user relationships
        this.refreshRelationships();
    
        //Update relationships if necessary
        this.myDashService.updateMyDashRelationships.subscribe(
            (response: any) => {
                this.refreshRelationships();
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
        //Set selected relationship in my dash
        this.selectedRelationship = relationship;
        //this.myDashService.setCurrentRelationship(relationship);
        
        //Allow relationship service to invite to this relationship
        this.relationshipService.setInviteRelationship(this.selectedRelationship);
        //Emit signal to update relationship in message service
        //this.messageService.currentMyDashRelationshipEmitter.emit(this.selectedRelationship);
    }

    sideNavClicked(relationship: Relationship) {
        this.selectedRelationship = relationship;
        this.myDashService.setCurrentRelationship(this.selectedRelationship);
    }

    

    /**
     * Called whenever a nav-pill tab is clicked
     * 
     * @memberof MyDashComponent
     */
    tabClicked() {
        this.myDashService.setCurrentRelationship(this.selectedRelationship);
    }

    

    /**
     * Checks if the passed relationship is the currently selected relationship on the dashboard
     * 
     * @param {Relationship} relationship The relationship to compare to the selected relationship
     * @returns true if relationships are the same, false otherwise
     * @memberof MyDashComponent
     */
    isCurrentRelationship(relationship: Relationship) {
        return relationship == this.selectedRelationship;
    }

    /**
     * Navigate to create relationship page
     * 
     * @memberof MyDashComponent
     */
    navigateToCreateRelationship() {
        this.router.navigateByUrl('/dashboard/create');
    }

    userNotInRelationship() {
        return this.relationships.length == 0;
    }

    onMyDashHome() {
        return this.router.url == '/dashboard/mydash';
    }

    refreshRelationships() {
        this.relationshipService.getRelationships()
            .subscribe(
                (relationships: Relationship[]) => {
                    this.relationships = relationships;
                    //Set selected relationship to first in relationship list, if it exists
                    if(this.relationships.length > 0) {
                        //Sort Relationships
                        this.relationships.sort(function(r1, r2) {
                            if(r1.createTimestamp < r2.createTimestamp) {
                                return -1;
                            } else if (r1.createTimestamp > r2.createTimestamp){
                                return 1;
                            } else {
                                return 0;
                            }
                        })
                        this.router.navigateByUrl('/dashboard/mydash/messages');
                        this.selectedRelationship = this.relationships[0];
                        this.myDashService.setCurrentRelationship(this.selectedRelationship);
                        this.noRelationships = false;
                    }
                    else {
                        this.noRelationships = true;
                    }
                }
            )
    }
}