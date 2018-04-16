import { Component, OnInit } from "@angular/core";
import { Relationship } from "../../../relationships/relationship.model";
import { MessagesService } from "../messages/messages.service";

@Component({
  selector: 'app-dates',
  templateUrl: './dates.component.html'
})
export class DatesComponent implements OnInit{
  relationship: Relationship;

  //Inject services
  constructor(private messagesService: MessagesService) {}


  ngOnInit() {
    this.messagesService.currentMyDashRelationshipEmitter.subscribe(
      (response: Relationship) => {
          this.relationship = response;
          //Get dates for this relationship from Dates Service
      }
  )
  }

}