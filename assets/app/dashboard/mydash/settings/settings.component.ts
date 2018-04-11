import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { RelationshipService } from "../../../relationships/relationship.service";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
    
    //Inject services
    constructor(private relationshipService: RelationshipService) {}

    toggleInvite() {
        this.relationshipService.toggleInvite();
    }
}