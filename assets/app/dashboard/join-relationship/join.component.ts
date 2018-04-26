import { Component, OnInit } from "@angular/core";
import { Relationship } from "../../relationships/relationship.model";
import { RelationshipService } from "../../relationships/relationship.service";
import { AuthService } from "../../auth/auth.service";

@Component({
    selector: 'app-join',
    templateUrl: './join.component.html'
})
export class JoinComponent implements OnInit{
    //List of relationships user is invited to
    relationships: Relationship[] = [];

    //Inject services
    constructor(
        private relationshipService: RelationshipService,
        private authService: AuthService
    ) {}
    
    /**
     * Get all relationships user is invited to, subscribe to invite deny signal
     * 
     * @memberof JoinComponent
     */
    ngOnInit() {
        //Use auth service to get list of relationship ids to which user is invited
        this.authService.getUserInvites().subscribe(
            (relationshipIds: string[]) => {
                //Using array of relationship ids, get the relationships
                this.relationshipService.getRelationshipsById(relationshipIds).subscribe(
                    (relationships: Relationship[]) => {
                        this.relationships = relationships;
                    }
                )
            }
        )

        //When a user declines an invite, remove it from the list
        this.relationshipService.removeInviteId.subscribe(
            (inviteId: string) => {
                var indexToRemove = -1;
                var relationshipLength = this.relationships.length;
                for(var i=0; i < relationshipLength; i++) {
                    if(this.relationships[i].relationshipId == inviteId) {
                        indexToRemove = i;
                        break;                        
                    }
                }
                this.relationships.splice(indexToRemove, 1);
            }
        )
    }
}