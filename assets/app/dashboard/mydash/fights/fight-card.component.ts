import { Component, Input, OnInit } from "@angular/core";
import { Fight } from "./fight.model";
import { MatDialog } from "@angular/material";
import { FightDialogComponent } from "./fight-dialog.component";
import { FightService } from "./fight.service";

@Component({
    selector: 'app-fight-card',
    templateUrl: './fight-card.component.html',
    styleUrls: ['./fight-card.component.css']
})
export class FightCardComponent implements OnInit{
    //The fight displayed on this card
    @Input() fight: Fight;
    description: string;
    cause: string;
    resolution: string;

    //Inject services
    constructor(
        private fightDialog: MatDialog,
        private fightService: FightService
    ) {}

    ngOnInit() {
        //Grab text for description/cause/resolution
        this.getUserDescription();
        this.getUserCause();
        this.getUserResolution();
        
    }

    /**
     * Iterate through fight descriptions and find the one for this user
     * 
     * @memberof FightCardComponent
     */
    getUserDescription() {
        
        for(let description of this.fight.descriptions) {
            if(description.userId == localStorage.getItem('userId')) {
                this.description = description.text;
            }
        }
    }

    /**
     * Iterate through fight causes and find the one for this user
     * 
     * @memberof FightCardComponent
     */
    getUserCause() {
        //Iterate through fight causes and find the one for this user
        for(let cause of this.fight.causes) {
            if(cause.userId == localStorage.getItem('userId')) {
                this.cause = cause.text;
            }
        }
    }

    /**
     * Iterate through fight resolutions and find the one for this user
     * 
     * @memberof FightCardComponent
     */
    getUserResolution() {
        //Iterate through fight resolutions and find the one for this user
        for(let resolution of this.fight.resolutions) {
            if(resolution.userId == localStorage.getItem('userId')) {
                this.resolution = resolution.text;
            }
        }
    }
    
    /**
     * Open Fight Dialog in edit mode
     * 
     * @memberof FightCardComponent
     */
    openEditFightDialog() {
        let dialogRef = this.fightDialog.open(FightDialogComponent, {
            width: "500px",
            data:{
                fight: this.fight,
                relationshipId: this.fight.relationshipId,
                areEditing: true
            }
        }) 
    }

    /**
     * Delete this fight from the database and frontend
     * 
     * @memberof FightCardComponent
     */
    deleteFight() {
        //Use fight service to delete fight from database
        this.fightService.deleteFight(this.fight.fightId)
            .subscribe(
                (response: any) => {
                    //Emit signal to delete fight from fights component
                    this.fightService.deleteFightFromFightsEmitter.emit(this.fight);
                }
            )
    }

}