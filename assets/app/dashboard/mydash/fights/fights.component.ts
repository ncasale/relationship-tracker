import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatDialog } from "@angular/material";
import { FightDialogComponent } from "./fight-dialog.component";
import { Relationship } from "../../../relationships/relationship.model";
import { MessagesService } from "../messages/messages.service";
import { FightService } from "./fight.service";
import { Fight } from "./fight.model";
import { Subscription } from "rxjs/Subscription";
import { MyDashService } from "../mydash.service";

@Component({
    selector: 'app-fights',
    templateUrl: './fights.component.html',
    styleUrls: ['./fights.component.css']
})
export class FightsComponent implements OnInit, OnDestroy{
    //The currently selected relationship
    relationship: Relationship;
    //The list of fights for currently selected relationships
    fights: Fight[];
    //Subscription to current relationship in mydash
    currentRelationshipSubscription: Subscription;

    
    //Inject services
    constructor(
        private createFightDialog: MatDialog,
        private messagesService: MessagesService,
        private fightService: FightService,
        private myDashService: MyDashService
    ) {}

    ngOnInit() {
        //Get current mydash relationship and get all chores for relationship
        this.currentRelationshipSubscription = this.myDashService.getCurrentRelationship()
            .subscribe(
                relationship => {
                    this.relationship = relationship;
                    //Get Fights for this relationship from Fights Service
                    this.fightService.getFights(this.relationship.relationshipId)
                    .subscribe(
                        (fights: Fight[]) => {
                            this.fights = fights;
                        }
                    )
                }
            )
        
        //Resend observable since we subscribe after it is initially sent upon tab click
        this.myDashService.conditionallyEmitRelationship();

        //Subscribe to emitter that deletes fight from fights array
        this.fightService.deleteFightFromFightsEmitter.subscribe(
            (fight: Fight) => {
                //Find index of fight 
                var index = this.fights.indexOf(fight);
                if(index != -1) {
                    this.fights.splice(index, 1);
                }
            }
        )

        //Subscribe to emitter that adds fight to fights array when one is created
        this.fightService.fightCreated.subscribe(
            (fight: Fight) => {
                //Add fight to fights
                this.fights.push(fight);
            }
        )
    }

    ngOnDestroy() {
        this.currentRelationshipSubscription.unsubscribe();
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