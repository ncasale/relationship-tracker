import { Component, OnInit, OnDestroy } from "@angular/core";
import { ChoreDialogComponent } from "./chore-dialog.component";
import { MatDialog } from "@angular/material";
import { Relationship } from "../../../relationships/relationship.model";
import { MessagesService } from "../messages/messages.service";
import { ChoreService } from "./chore.service";
import { Chore } from "./chore.model";
import { Subscription } from "rxjs/Subscription";
import { MyDashService } from "../mydash.service";

@Component({
    selector: 'app-chores',
    templateUrl: './chores.component.html'
})
export class ChoresComponent implements OnInit, OnDestroy{
    //The relationship to which these chores are attached
    relationship: Relationship;
    //List of chores to display
    chores: Chore[] = [];
    //Subscription to current relationship subject in mydash
    currentRelationshipSubscription: Subscription;

    //Inject services
    constructor(private createChoreDialog: MatDialog,
        private messagesService: MessagesService,
        private choreService: ChoreService,
        private myDashService: MyDashService
    ) {}

    ngOnInit(){
        //Get current mydash relationship and get all chores for relationship
        this.currentRelationshipSubscription = this.myDashService.getCurrentRelationship()
            .subscribe(
                relationship => {
                    this.relationship = relationship;
                    console.log("Relationship in Chores: ", this.relationship);
                    //Get chores for this relationship from Chores Service
                    if(this.relationship) {
                        this.choreService.getChores(this.relationship.relationshipId)
                        .subscribe(
                            (chores: Chore[]) => {
                                this.chores = chores;
                            }
                        )
                    }
                }
            )
        
        //Re-send observable since we subscribe to it after it is initally sent on tab click
        this.myDashService.conditionallyEmitRelationship();
    
        //Update frontend when chores are deleted
        this.choreService.choreDeleted.subscribe(
            (chore: Chore) => {
                //Find chore in chores
                var index = this.chores.indexOf(chore);
                if(index != -1) {
                    this.chores.splice(index, 1);
                }
            }
        )

        //Update frontend when chores created
        this.choreService.choreCreatedEmitter.subscribe(
            (chore: Chore) => {
                this.chores.push(chore);
            }
        )
        
    } 

    ngOnDestroy() {
        this.currentRelationshipSubscription.unsubscribe();
    }
    
    /**
     * Open chore dialog for chore creation
     * 
     * @memberof ChoresComponent
     */
    openCreateChoreDialog() : void {
        let dialogRef = this.createChoreDialog.open(ChoreDialogComponent , {
            width: '500px',
            data: {
              relationshipId: this.relationship.relationshipId,
              areEditing: false
            }
        });        
      }  

}