import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { FightDialogComponent } from "./fight-dialog.component";
import { Relationship } from "../../../relationships/relationship.model";
import { MessagesService } from "../messages/messages.service";
import { FightService } from "./fight.service";
import { Fight } from "./fight.model";

@Component({
    selector: 'app-fights',
    templateUrl: './fights.component.html'
})
export class FightsComponent implements OnInit{
    //The currently selected relationship
    relationship: Relationship;
    //The list of fights for currently selected relationships
    fights: Fight[];

    
    //Inject services
    constructor(
        private createFightDialog: MatDialog,
        private messagesService: MessagesService,
        private fightService: FightService
    ) {}

    ngOnInit() {
        //Get current mydash relationship and get all chores for relationship
        this.messagesService.currentMyDashRelationshipEmitter.subscribe(
            (response: Relationship) => {
                this.relationship = response;
                //Get Fights for this relationship from Fights Service
                this.fightService.getFights(this.relationship.relationshipId)
                    .subscribe(
                        (fights: Fight[]) => {
                            this.fights = fights;
                        }
                    )
            });
    }

    /**
     * Opens Fight Dialog in creation mode
     * 
     * @memberof FightsComponent
     */
    openCreateFightDialog() : void {
        let dialogRef = this.createFightDialog.open(FightDialogComponent , {
            width: '500px',
            data: {
              relationshipId: this.relationship.relationshipId,
              areEditing: false
            }
        });        
      }
}