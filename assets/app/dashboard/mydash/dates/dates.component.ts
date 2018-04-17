import { Component, OnInit } from "@angular/core";
import { Relationship } from "../../../relationships/relationship.model";
import { MessagesService } from "../messages/messages.service";
import { DateService } from "./date.service";
import { DateObj } from "./dateObj.model";
import { MatDialog } from "@angular/material";
import { DateDialogComponent } from "./date-dialog.component";

@Component({
  selector: 'app-dates',
  templateUrl: './dates.component.html'
})
export class DatesComponent implements OnInit {
  relationship: Relationship;
  dates: DateObj[] = [];

  //Inject services
  constructor(private messagesService: MessagesService, private dateService: DateService, public addDialog: MatDialog) {}


  ngOnInit() {
    //Get current mydash relationship and get all dates for relationship
    this.messagesService.currentMyDashRelationshipEmitter.subscribe(
      (response: Relationship) => {
          this.relationship = response;
          //Get dates for this relationship from Dates Service
          this.dateService.getDates(this.relationship.relationshipId)
            .subscribe(
              (dates: DateObj[]) => {
                console.log('Dates: ', dates);
                this.dates = dates;
              }
            )
      });

      //When a message is deleted, delete it from the messages list
      this.dateService.dateDeletedEmitter.subscribe(
        (date: DateObj) => {
            //Find array of message within messages
            var index = this.dates.indexOf(date);
            if(index != -1) {
                this.dates.splice(index, 1);
            }
        });
  }
  

  /**
   * Opens date dialog as a create date dialog
   * 
   * @memberof DatesComponent
   */
  openCreateDateDialog(): void {
    let dialogRef = this.addDialog.open(DateDialogComponent, {
        width: '500px',
        data: {
          relationship: this.relationship,
          areEditing: false
        }
    });        
  }  

}