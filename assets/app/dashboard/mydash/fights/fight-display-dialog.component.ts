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
    userInfoObjs = [];
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
                    this.userInfoObjs.push(userObj);
                    this.userDataRetrieved = true;
                }
            )
        }
    }

    getUserIds() {
        var userIds = [];
        for(let description of this.data.fight.descriptions) {
            userIds.push(description.userId);
        }
        return userIds;
    }

    getUserDescription(userId) {
        for(let description of this.data.fight.descriptions) {
            if(description.userId == userId) {
                return description.text;
            }
        }
    }

    getUserCause(userId) {
        for(let cause of this.data.fight.causes) {
            if(cause.userId == userId) {
                return cause.text;
            }
        }
    }

    getUserResolution(userId) {
        for(let resolution of this.data.fight.resolutions) {
            if(resolution.userId == userId) {
                return resolution.text;
            }
        }
    }

    populateUserNames(userObj) {
        //Get user info from auth service
        this.authService.getUser(userObj.userId)
            .subscribe(
                (response: any) => {
                    userObj.firstName = response.firstname;
                    userObj.lastName = response.lastname;
                }
            )
    }



}