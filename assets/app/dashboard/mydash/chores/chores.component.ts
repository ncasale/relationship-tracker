import { Component, OnInit, OnDestroy } from "@angular/core";
import { ChoreDialogComponent } from "./chore-dialog.component";
import { MatDialog } from "@angular/material";
import { Relationship } from "../../../relationships/relationship.model";
import { MessagesService } from "../messages/messages.service";
import { ChoreService } from "./chore.service";
import { Chore } from "./chore.model";
import { Subscription } from "rxjs/Subscription";
import { MyDashService } from "../mydash.service";
import { ChoreFilterDialogComponent } from "./chore-filter-dialog.component";

@Component({
    selector: 'app-chores',
    templateUrl: './chores.component.html',
    styleUrls: ['./chores.component.css']
})
export class ChoresComponent implements OnInit, OnDestroy{
    //The relationship to which these chores are attached
    relationship: Relationship;
    //List of chores to display
    chores: Chore[] = [];
    //Subscription to current relationship subject in mydash
    currentRelationshipSubscription: Subscription;
    //Filtering
    unfilteredChores: Chore[] = [];
    filtered: boolean = false;
    showCompleted = false;

    //Inject services
    constructor(private createChoreDialog: MatDialog,
        private filterChoreDialog: MatDialog,
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

        //Update frontend when chores filtered
        this.choreService.choresFiltered.subscribe(
            (filteredChores: Chore[]) => {
                this.chores = Object.assign([], filteredChores);
                this.filtered = true;
                console.log('Chores Filtered: ', this.chores);
            }
        )
        
        //Log old chores when filtering applied so we can revert
        this.choreService.recordOriginalChores.subscribe(
            (originalChores: Chore[]) => {
                this.unfilteredChores = Object.assign([], originalChores);
                console.log("Unfiltered Chores: ", this.unfilteredChores);
            }
        )

        //Show completed chores
        this.choreService.showCompletedChores.subscribe(
            (response: boolean) => {
                this.showCompleted = response;
            }
        )
        
    } 

    /**
     * Unsubscribe from all observables
     * 
     * @memberof ChoresComponent
     */
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
            position: {
                top: '10vh'
            },
            width: '500px',
            data: {
              relationshipId: this.relationship.relationshipId,
              areEditing: false
            },
            autoFocus: false
        });        
    }
    
    /**
     * Open dialog where filters can be selected
     * 
     * @memberof ChoresComponent
     */
    openFilterChoreDialog() : void {
        let dialogRef = this.filterChoreDialog.open(ChoreFilterDialogComponent, {
            position: {
                top: '10vh'
            },
            width: '500px',
            data: {
                relationship: this.relationship,
                chores: this.chores,
                unfilteredChores: this.unfilteredChores,
                filtered: this.filtered
            },
            autoFocus: false
        })
    }

    /**
     * Clear the filter on chores
     * 
     * @memberof ChoresComponent
     */
    unfilterChores() {
        this.filtered = false;
        this.chores = Object.assign([], this.unfilteredChores);
        this.showCompleted = false;
    }

}