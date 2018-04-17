import { Component, Input, OnInit } from "@angular/core";
import { DateObj } from "./dateObj.model";
import { DatePipe } from "@angular/common";
import { DateService } from "./date.service";

@Component({
    selector: 'app-date-card',
    templateUrl: './date-card.component.html',
    styleUrls: ['./date-card.component.css']
})
export class DateCardComponent implements OnInit{
    @Input() date: DateObj;

    //The timestamp of the message
    meetingDate: string;
    meetingDateFormat: string = 'MM/dd/yyyy';

    //Inject Services
    constructor(private datePipe: DatePipe, private dateService: DateService) {}

    ngOnInit() {
        //Set meetingDate in correct format
        this.meetingDate = this.datePipe.transform(this.date.date, this.meetingDateFormat);

        //Format Hour/Minute
        this.formatTime();
    }

    /**
     * Adds a leading 0 to single digit minute/hour values
     * 
     * @memberof DateCardComponent
     */
    formatTime() {
        if(this.date.minute.length === 1) {
            this.date.minute = '0' + this.date.minute;
        }

        if(this.date.hour.length === 1) {
            this.date.hour = '0' + this.date.hour;
        }
    }

    editDate() {
        //Open up our edit dialog
        this.date.title = "Edited Title...";
        this.date.hour = '23';
        this.date.minute = '41';
        this.date.location = 'A new location for our date';

        this.dateService.editDate(this.date)
            .subscribe(
                (response: any) => {
                    console.log('Edited Date: ', response);
                }
            )
    }

    deleteDate() {
        console.log('Deleting Date...');
    }




}