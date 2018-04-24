import { Component, OnInit } from "@angular/core";
import { ChoreDialogComponent } from "./chore-dialog.component";
import { MatDialog } from "@angular/material";
import { Relationship } from "../../../relationships/relationship.model";
import { MessagesService } from "../messages/messages.service";
import { ChoreService } from "./chore.service";
import { Chore } from "./chore.model";

@Component({
    selector: 'app-chores',
    templateUrl: './chores.component.html'
})
export class ChoresComponent implements OnInit{
    //The relationship to which these chores are attached
    relationship: Relationship;

    //List of chores to display
    chores: Chore[] = [];

    //Inject services
    constructor(private createChoreDialog: MatDialog,
        private messagesService: MessagesService,
        private choreService: ChoreService) {}

    ngOnInit(){
        //Get current mydash relationship and get all chores for relationship
        this.messagesService.currentMyDashRelationshipEmitter.subscribe(
            (response: Relationship) => {
                this.relationship = response;
                //Get chores for this relationship from Chores Service
                this.choreService.getChores(this.relationship.relationshipId)
                    .subscribe(
                        (chores: Chore[]) => {
                            this.chores = chores;
                        }
                    )
            });
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