import { Component, OnInit } from "@angular/core";
import { Gratitude } from "./gratitude.model";
import { GratitudeService } from "./gratitude.service";
import { MyDashService } from "../mydash.service";
import { Subscription } from "rxjs/Subscription";
import { Relationship } from "../../../relationships/relationship.model";
import { MatDialog } from "@angular/material";
import { GratitudeDialogComponent } from "./gratitude-dialog.component";

@Component({
    selector: 'app-gratitudes',
    templateUrl: './gratitudes.component.html',
    styleUrls: ['./gratitudes.component.css']
})
export class GratitudesComponent implements OnInit{
    relationship: Relationship;
    gratitudes: Gratitude[] = [];
    currentRelationshipSubscription = new Subscription();

    //Inject services
    constructor(
        private gratitudeService: GratitudeService,
        private myDashService: MyDashService,
        public gratitudeDialog: MatDialog
    ){}

    ngOnInit() {
        //Get current mydash relationship and get all gratitudes for relationship
        this.currentRelationshipSubscription = this.myDashService.getCurrentRelationship()
        .subscribe(
          relationship => {
            this.relationship = relationship;
            //Get dates for this relationship from Dates Service
            this.gratitudeService.getGratitudes(this.relationship.relationshipId)
              .subscribe(
                (gratitudes: Gratitude[]) => {
                  this.gratitudes = gratitudes;
                }
              )
          }
        )
    
      //Re-send observable since we subscribe after it is initally sent on tab click
      this.myDashService.conditionallyEmitRelationship();

      //When a gratitude is saved, add it to local array
      this.gratitudeService.gratitudeCreatedEmitter.subscribe(
          (gratitude: Gratitude) => {
              this.gratitudes.push(gratitude);
          }
      )
    }

    /**
     * Open gratitude dialog for creation
     * 
     * @memberof GratitudesComponent
     */
    openCreateGratitudeDialog() {
        this.gratitudeDialog.open(GratitudeDialogComponent, {
            width: '500px',
            data: {
                areEditing: false,
                relationship: this.relationship
            }
        })
    }
}