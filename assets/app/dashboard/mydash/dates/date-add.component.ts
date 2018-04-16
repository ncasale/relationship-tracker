import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { DateObj } from './dateObj.model';
import { MessagesService } from '../messages/messages.service';
import { DateService } from './date.service';
import { Relationship } from '../../../relationships/relationship.model';

@Component({
    selector: 'app-date-add',
    templateUrl: './date-add.component.html',
    styleUrls: ['./date-add.component.css']
})
export class DateAddComponent {

    //Initialize form controls
    title = new FormControl (null, Validators.required);
    location = new FormControl(null, Validators.required);
    hour = new FormControl(null, [Validators.required,
        Validators.pattern('^(2[0-3]|[01]?[0-9])$')]);
    minute = new FormControl(null, [Validators.required,
        Validators.pattern('^([012345]?[0-9])$')]);

    constructor(
        public dialogRef: MatDialogRef<DateAddComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private messagesService: MessagesService,
        private dateService: DateService) {}

    onSubmit() {
        //Call Date Service to add new date to database
        var date = new DateObj(
            this.title.value,
            this.location.value,
            this.hour.value,
            this.minute.value,
            new Date(),
            this.data.relationship.relationshipId
        );
        this.dateService.saveDate(date)
            .subscribe((response: any) => {
                console.log('Saved Date...');
            })

        //Close the dialog
        this.dialogRef.close();
    
    }


    getTitleErrorMessage() {
        return this.title.hasError('required') ? 'You must enter a title' :
                '';
    }

    getLocationErrorMessage() {
        return this.location.hasError('required') ? 'You must enter a location' :
                '';
    }

    getHourErrorMessage() {
        return this.hour.hasError('required') ? 'You must enter an hour' :
        this.hour.hasError('pattern') ? 'Not a valid hour' :
            '';
    }

    getMinuteErrorMessage() {
        return this.minute.hasError('required') ? 'You must enter a minute' :
        this.minute.hasError('pattern') ? 'Not a valid minute' :
            '';
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
            this.minute.valid 
            //&&
            //this.datepicker.valid;
        //return (this.dateForm.valid && )
    }
    

}