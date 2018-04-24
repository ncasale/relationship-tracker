import { Component, OnInit, OnDestroy } from "@angular/core";
import { Relationship } from "../../../relationships/relationship.model";
import { MessagesService } from "../messages/messages.service";
import { DateService } from "./date.service";
import { DateObj } from "./dateObj.model";
import { MatDialog } from "@angular/material";
import { DateDialogComponent } from "./date-dialog.component";
import { Subscription } from "rxjs/Subscription";
import { MyDashService } from "../mydash.service";

@Component({
  selector: 'app-dates',
  templateUrl: './dates.component.html'
})
export class DatesComponent implements OnInit, OnDestroy {
  relationship: Relationship;
  dates: DateObj[] = [];
  currentRelationshipSubscription: Subscription;

  //Inject services
  constructor(
    private messagesService: MessagesService,
    private dateService: DateService,
    public addDialog: MatDialog,
    private myDashService: MyDashService
  ) {}


  ngOnInit() {
    //Get current mydash relationship and get all dates for relationship
    this.currentRelationshipSubscription = this.myDashService.getCurrentRelationship()
      .subscribe(
        relationship => {
          this.relationship = relationship;
          //Get dates for this relationship from Dates Service
          this.dateService.getDates(this.relationship.relationshipId)
            .subscribe(
              (dates: DateObj[]) => {
                this.dates = dates;
              }
            )
        }
      )

    //Re-send observable since we subscribe after it is initally sent on tab click
    this.myDashService.conditionallyEmitRelationship();

    //When a date is deleted, delete it from the dates array
    this.dateService.dateDeletedEmitter.subscribe(
      (date: DateObj) => {
        //Find array of message within messages
        var index = this.dates.indexOf(date);
        if (index != -1) {
          this.dates.splice(index, 1);
        }
      });

    //When date saved, add it to dates array
    this.dateService.dateCreatedEmitter.subscribe(
      (date: DateObj) => {
        //Push to dates array
        this.dates.push(date);
      }
    )
  }

  ngOnDestroy() {
    this.currentRelationshipSubscription.unsubscribe();
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