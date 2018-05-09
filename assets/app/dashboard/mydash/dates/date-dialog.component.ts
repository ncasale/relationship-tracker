import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { DateObj } from './dateObj.model';
import { MessagesService } from '../messages/messages.service';
import { DateService } from './date.service';
import { Relationship } from '../../../relationships/relationship.model';
import { MyDashService } from '../mydash.service';

@Component({
    selector: 'app-date-dialog',
    templateUrl: './date-dialog.component.html',
    styleUrls: ['./date-dialog.component.css']
})
export class DateDialogComponent implements OnInit{
    possibleTimes = [];

    //Form controls
    title = new FormControl (null, Validators.required);
    location = new FormControl(null, Validators.required);
    dateTime = new FormControl(null, Validators.required);
    dateDate = new FormControl(new Date(), Validators.required);

    //Inject services
    constructor(
        public dialogRef: MatDialogRef<DateDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private messagesService: MessagesService,
        private dateService: DateService,
        private myDashService: MyDashService
    ) {}

    ngOnInit() {
        //Prepopulate fields if editing
        this.checkEditTitle();
        this.checkEditLocation();
        this.checkEditTime();
        this.checkEditDate();

        //Create array of times that user can select from
        this.generatePossibleTimes();
    }

    /**
     * Call date service to add new date to database using form data
     * 
     * @memberof DateDialogComponent
     */
    onSubmitCreate() {
        var splitTime = this.dateTime.value.split(':', 2);
        console.log(splitTime);
        var date = new DateObj(
            this.title.value,
            this.location.value,
            splitTime[0],
            splitTime[1],
            this.dateDate.value,
            undefined,
            this.data.relationship.relationshipId
        );
        this.dateService.saveDate(date)
            .subscribe((date: DateObj) => {
                this.dateService.dateCreatedEmitter.emit(date);
                this.myDashService.openSnackBar('Date Created.', 'close');
            })

        //Close the dialog
        this.dialogRef.close();
    }

    /**
     * Call Date Service to edit date in database
     * 
     * @memberof DateDialogComponent
     */
    onSubmitEdit() {
        //Alter date
        this.data.date.title = this.title.value;
        this.data.date.location = this.location.value;
        var splitTime = this.dateTime.value.split(':', 2);
        this.data.date.hour = splitTime[0];
        this.data.date.minute = splitTime[1];
        this.data.date.date = this.dateDate.value;
        this.dateService.editDate(this.data.date)
            .subscribe((response: any) => {
                this.dateService.dateEditedEmitter.emit();
                this.myDashService.openSnackBar('Date Edited.', 'close');
            })

        //Close the dialog
        this.dialogRef.close();

    }

    /**
     * Display error message if Title field invalid
     * 
     * @returns Error
     * @memberof DateDialogComponent
     */
    getTitleErrorMessage() {
        return this.title.hasError('required') ? 'You must enter a title' :
                '';
    }

    /**
     * Display error message if Location field invalid
     * 
     * @returns Error
     * @memberof DateDialogComponent
     */
    getLocationErrorMessage() {
        return this.location.hasError('required') ? 'You must enter a location' :
                '';
    }

    /**
     * Display error message if Time field invalid
     * 
     * @returns Error
     * @memberof DateDialogComponent
     */
    getTimeErrorMessage() {
        return this.dateTime.hasError('required') ? 'You must select a time' : '';
    }


    /**
     * Display error message if Date field invalid
     * 
     * @returns Error
     * @memberof DateDialogComponent
     */
    getDateErrorMessage() {
        return this.dateDate.hasError('required') ? 'You must enter a date' :
            '';
    }

    /**
     * If we are editing, prepopulate dialog with title of date
     * 
     * @memberof DateDialogComponent
     */
    checkEditTitle() {
        if(this.data.editTitle) {
            this.title.setValue(this.data.editTitle);
        }
    }

    /**
     * If we are editing, prepopulate dialog with location of date
     * 
     * @memberof DateDialogComponent
     */
    checkEditLocation() {
        if(this.data.editLocation) {
            this.location.setValue(this.data.editLocation);
        }
    }

    checkEditTime() {
        if(this.data.editHour && this.data.editMinute) {
            this.dateTime.setValue(this.data.editHour + ':' + this.data.editMinute);
        }
    }

    /**
     * If we are editing, populate date field with existing date for date
     * 
     * @memberof DateDialogComponent
     */
    checkEditDate() {
        if(this.data.areEditing) {
            this.dateDate.setValue(this.data.date.date);
        }
    }

    dateOrEvent() {
        if(this.data.relationship.isPlatonic) {
            return "Event";
        } else {
            return "Date";
        }
    }

    generatePossibleTimes() {
        //Create array of times
        var currHour = 0;
        var currMin = 0;
        var currHourStr = '';
        var currMinStr = '';
        while(currHour < 24) {
            //Convert hour to string
            if(currHour < 9) {
                currHourStr = '0' + currHour.toString();
            } else {
                currHourStr = currHour.toString();
            }
            //Convert minute to string
            if(currMin < 9) {
                currMinStr = '0' + currMin.toString();
            } else {
                currMinStr = currMin.toString();
            }
            //Add time to array
            this.possibleTimes.push(currHourStr + ':' + currMinStr);
            //Increment time by 15 minutes
            if(currMin === 45) {
                currMin = 0;
                currHour += 1;
            } else {
                currMin += 15;
            }
        }

    }

    /**
     * Return true if we are editing a date, false if creating
     * 
     * @returns 
     * @memberof DateDialogComponent
     */
    areEditing() {
        return this.data.areEditing;
    } 

    /**
     * Checks that all form fields required for date are valid.
     * 
     * @returns true if all date fields valid, false otherwise.
     * @memberof DateDialogComponent
     */
    isDateValid() {
        return this.title.valid &&
            this.location.valid &&
            this.dateTime.valid &&
            this.dateDate.valid;
    }
    

}