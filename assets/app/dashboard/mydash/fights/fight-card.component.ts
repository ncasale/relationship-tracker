import { Component, Input, OnInit } from "@angular/core";
import { Fight } from "./fight.model";
import { MatDialog, MatDialogRef } from "@angular/material";
import { FightDialogComponent } from "./fight-dialog.component";
import { FightService } from "./fight.service";
import { DatePipe } from "@angular/common";
import { FightAppendDialogComponent } from "./fight-append-dialog.component";
import { FightDisplayDialogComponent } from "./fight-display-dialog.component";
import { MyDashService } from "../mydash.service";
import { DeleteItemDialogComponent } from "../common/delete-item-dialog.component";

@Component({
    selector: 'app-fight-card',
    templateUrl: './fight-card.component.html',
    styleUrls: ['./fight-card.component.css']
})
export class FightCardComponent implements OnInit{
    //The fight displayed on this card
    @Input() fight: Fight;
    fightDate
    description: string;
    cause: string;
    resolution: string;
    viewingFight: boolean;

    //Format for date
    dateFormat: string = "MM/dd/yyyy";

    //Inject services
    constructor(
        private fightDialog: MatDialog,
        private fightAppendDialog: MatDialog,
        private fightDisplayDialog: MatDialog,
        private fightService: FightService,
        private myDashService: MyDashService,
        private datePipe: DatePipe,
        public deleteDialog: MatDialog
    ) {}

    ngOnInit() {
        //Grab text for description/cause/resolution
        this.getUserDescription();
        this.getUserCause();
        this.getUserResolution();

        //Format date
        this.fightDate = this.datePipe.transform(this.fight.fightDate, this.dateFormat);
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
     * Open fight append dialog for user who has not entered info for an existing fight
     * 
     * @memberof FightCardComponent
     */
    openAppendFightDialog() {
        let dialogRef = this.fightAppendDialog.open(FightAppendDialogComponent, {
            width: "750px",
            data: {
                fight: this.fight
            }
        })
    }

    /**
     * Open fight display dialog to show details of this fight
     * 
     * @memberof FightCardComponent
     */
    openDisplayFightDialog() {
        let dialogRef = this.fightDisplayDialog.open(FightDisplayDialogComponent, {
            width: '750px',
            height: '750px',
            data: {
                fight: this.fight
            }
        })
    }

    

    /**
     * Delete this fight from the database and frontend
     * 
     * @memberof FightCardComponent
     */
    deleteFight() {
        //Open delete confirm dialog
        var dialogRef = this.deleteDialog.open(DeleteItemDialogComponent, {
            width: '500px'
        })
        dialogRef.afterClosed().subscribe(
            result => {
                //If we confirm our deletion
                if(result) {
                    //Use fight service to delete fight from database
                    this.fightService.deleteFight(this.fight.fightId)
                        .subscribe(
                            (response: any) => {
                                //Emit signal to delete fight from fights component
                                this.fightService.deleteFightFromFightsEmitter.emit(this.fight);
                                this.myDashService.openSnackBar('Fight Deleted', 'close');
                            }
                        )
                }
            }
            
        )
    }

    /**
     * View the fight card for this fight
     * 
     * @memberof FightCardComponent
     */
    viewFight() {
        if(this.haveSubmitted()) {
            this.viewingFight = true;
        } else {
            //User hasn't submitted information, prompt them to
            this.openAppendFightDialog();
        }

    }

    /**
     * Close the fight card for this fight
     * 
     * @memberof FightCardComponent
     */
    closeFight() {
        this.viewingFight = false;
    }

    /**
     * Check if a user has submitted their desc, cause, etc. for this fight. Return true
     * if they have.
     * 
     * @returns true if user has submitted information for this fight
     * @memberof FightCardComponent
     */
    haveSubmitted() {
        //Iterate through descriptions and see if user matches any
        for(let description of this.fight.descriptions) {
            if(description.userId == localStorage.getItem('userId')) {
                return true;
            }
        }
        return false;
    }

}