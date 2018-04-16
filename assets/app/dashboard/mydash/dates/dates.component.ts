import { Component, OnInit } from "@angular/core";
import { Relationship } from "../../../relationships/relationship.model";
import { MessagesService } from "../messages/messages.service";
import { DateService } from "./date.service";
import { DateObj } from "./dateObj.model";
import { MatDialog } from "@angular/material";
import { DateAddComponent } from "./date-add.component";

@Component({
  selector: 'app-dates',
  templateUrl: './dates.component.html'
})
export class DatesComponent implements OnInit{
  relationship: Relationship;
  dates: DateObj[] = [];

  //Inject services
  constructor(private messagesService: MessagesService, private dateService: DateService, public addDialog: MatDialog) {}


  ngOnInit() {
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
      }
  )
  }

  openAddDateDialog(): void {
    let dialogRef = this.addDialog.open(DateAddComponent, {
        width: '500px',
        data: {relationship: this.relationship}
    });        
}

}