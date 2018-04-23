import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { AuthService } from "../../../auth/auth.service";
import { DatePipe } from "@angular/common";

@Component({
    selector: 'app-fight-display-dialog',
    templateUrl: './fight-display-dialog.component.html',
    styleUrls: ['./fight-display-dialog.component.css']
})
export class FightDisplayDialogComponent implements OnInit{

    fightTitle: string;
    fightDate: string;
    fightDateFormat: string = "MM/dd/yyyy";
    
    //Array of objects representing each user's interpretation of a fight.
    userInfoObjs = [];
    //A boolean which is false while waiting for database to return user info.
    userDataRetrieved = false;

    //Inject services
    constructor(
        public dialogRef: MatDialogRef<FightDisplayDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private authService: AuthService,
        private datePipe: DatePipe
    ){}

    ngOnInit() {
        if(this.data.fight) {
            //Set title
            this.fightTitle = this.data.fight.title;
            //Set date
            this.fightDate = this.datePipe.transform(this.data.fight.fightDate, this.fightDateFormat);
            //Create json objects for each user's info
            this.generateUserInfoObjs();
        }
    }

    /**
     * Generates JSON objects to represent each user's interpretation of a fight. This includes
     * their description, cause, and resolution. The object also contains the userId and first/last
     * names of the user.
     * 
     * @memberof FightDisplayDialogComponent
     */
    generateUserInfoObjs() {
        var userIds = this.getUserIds();
        for(let userId of userIds) {
            //Get first and last names for user
            //Get user info from auth service
            this.authService.getUser(userId)
            .subscribe(
                (response: any) => {
                    var userObj = {
                        userId: userId,
                        firstName: response.firstname,
                        lastName: response.lastname,
                        description: this.getUserDescription(userId),
                        cause: this.getUserCause(userId),
                        resolution: this.getUserResolution(userId)                    
                    }
                    //Push user info into array
                    this.userInfoObjs.push(userObj);
                    //Set flag stating that user info has been returned (hide loading screen)
                    this.userDataRetrieved = true;
                }
            )
        }
    }

    /**
     * Gets the userIds of all those who have filled in information about this fight.
     * 
     * @returns An array of userIds (strings)
     * @memberof FightDisplayDialogComponent
     */
    getUserIds() {
        var userIds = [];
        for(let description of this.data.fight.descriptions) {
            userIds.push(description.userId);
        }
        return userIds;
    }

    /**
     * Gets a user's description of this fight.
     * 
     * @param {any} userId The Id of the user
     * @returns The description text (string) if it exists, blank string otherwise
     * @memberof FightDisplayDialogComponent
     */
    getUserDescription(userId) {
        for(let description of this.data.fight.descriptions) {
            if(description.userId == userId) {
                return description.text;
            }
        } 
        return "";
    }

    /**
     * Gets a user's cause of this fight
     * 
     * @param {any} userId the Id of the user
     * @returns The cause text (string) if it exists, blank string otherwise
     * @memberof FightDisplayDialogComponent
     */
    getUserCause(userId) {
        for(let cause of this.data.fight.causes) {
            if(cause.userId == userId) {
                return cause.text;
            }
        }
    }

    /**
     * Gets a user's resolution of this fight
     * 
     * @param {any} userId the Id of the user
     * @returns The resolution text (string) if it exists, blank string otherwise
     * @memberof FightDisplayDialogComponent
     */
    getUserResolution(userId) {
        for(let resolution of this.data.fight.resolutions) {
            if(resolution.userId == userId) {
                return resolution.text;
            }
        }
    }
}