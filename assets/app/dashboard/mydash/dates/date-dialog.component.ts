import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { DateObj } from './dateObj.model';
import { MessagesService } from '../messages/messages.service';
import { DateService } from './date.service';
import { Relationship } from '../../../relationships/relationship.model';

@Component({
    selector: 'app-date-dialog',
    templateUrl: './date-dialog.component.html',
    styleUrls: ['./date-dialog.component.css']
})
export class DateDialogComponent implements OnInit{

    //Initialize form controls
    title = new FormControl (null, Validators.required);
    location = new FormControl(null, Validators.required);
    hour = new FormControl(null, [Validators.required,
        Validators.pattern('^(2[0-3]|[01]?[0-9])$')]);
    minute = new FormControl(null, [Validators.required,
        Validators.pattern('^([012345]?[0-9])$')]);
    dateDate = new FormControl(null, Validators.required);

    //Inject services
    constructor(
        public dialogRef: MatDialogRef<DateDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private messagesService: MessagesService,
        private dateService: DateService) {}

    ngOnInit() {
        //Prepopulate fields if editing
        this.checkEditTitle();
        this.checkEditLocation();
        this.checkEditHour();
        this.checkEditMinute();
        this.checkEditDate();
    }

    /**
     * Call date service to add new date to database using form data
     * 
     * @memberof DateDialogComponent
     */
    onSubmitCreate() {
        var date = new DateObj(
            this.title.value,
            this.location.value,
            this.hour.value,
            this.minute.value,
            this.dateDate.value,
            undefined,
            this.data.relationship.relationshipId
        );
        this.dateService.saveDate(date)
            .subscribe((response: any) => {
                console.log('Saved Date...');
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
        this.data.date.hour = this.hour.value;
        this.data.date.minute = this.minute.value;
        this.data.date.date = this.dateDate.value;
        console.log("Date before sent to date service edit: ", this.data.date);
        this.dateService.editDate(this.data.date)
            .subscribe((response: any) => {
                this.dateService.dateEditedEmitter.emit();
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
     * Display error message if Hour field invalid
     * 
     * @returns Error
     * @memberof DateDialogComponent
     */
    getHourErrorMessage() {
        return this.hour.hasError('required') ? 'You must enter an hour' :
        this.hour.hasError('pattern') ? 'Not a valid hour' :
            '';
    }

    /**
     * Display error message if Minute field invalid
     * 
     * @returns Error
     * @memberof DateDialogComponent
     */
    getMinuteErrorMessage() {
        return this.minute.hasError('required') ? 'You must enter a minute' :
        this.minute.hasError('pattern') ? 'Not a valid minute' :
            '';
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

    /**
     * If we are editing, prepopulate dialog with hour of date
     * 
     * @memberof DateDialogComponent
     */
    checkEditHour() {
        if(this.data.editHour) {
            this.hour.setValue(this.data.editHour);
        }
    }

    /**
     * If we are editing, prepopulate dialog with minute of date
     * 
     * @memberof DateDialogComponent
     */
    checkEditMinute() {
        if(this.data.editMinute) {
            this.minute.setValue(this.data.editMinute);
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

    /**
     * Return true if we are editing a date, false if creating
     * 
     * @returns 
     * @memberof DateDialogComponent
     */
    areEditing() {
        return this.data.areEditing;
    }

    // getDatepickerErrorMessage() {
    //     return this.datepicker.hasError('required') ? 
    //         'You must pick a valid date' :
    //         '';
    // }    

    isDateValid() {
        return this.title.valid &&
            this.location.valid &&
            this.hour.valid &&
            this.minute.valid &&
            this.dateDate.valid;
    }
    

}