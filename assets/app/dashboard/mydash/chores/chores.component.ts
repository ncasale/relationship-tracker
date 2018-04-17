import { Component, OnInit } from "@angular/core";
import { ChoreDialogComponent } from "./chore-dialog.component";
import { MatDialog } from "@angular/material";
import { Relationship } from "../../../relationships/relationship.model";
import { MessagesService } from "../messages/messages.service";

@Component({
    selector: 'app-chores',
    templateUrl: './chores.component.html'
})
export class ChoresComponent implements OnInit{
    //The relationship to which these chores are attached
    relationship: Relationship;

    //Inject services
    constructor(private createChoreDialog: MatDialog, private messagesService: MessagesService) {}

    ngOnInit(){
        //Get current mydash relationship and get all chores for relationship
        this.messagesService.currentMyDashRelationshipEmitter.subscribe(
            (response: Relationship) => {
                this.relationship = response;
                //Get chores for this relationship from Chores Service
            });
    }

    onSubmit() {
        console.log('Chore added...');
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
              relationship: this.relationship,
              areEditing: false
            }
        });        
      }  

}