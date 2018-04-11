import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { RelationshipService } from "../../../relationships/relationship.service";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit{
    
    //Inject services
    constructor(private relationshipService: RelationshipService) {}

    //Toggle invite modal when initialized. Relationship to invite to is set by mydash.
    ngOnInit() {
        this.relationshipService.toggleInvite();
    }
}