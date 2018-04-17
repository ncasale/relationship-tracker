import { Component, Input, OnInit } from "@angular/core";
import { DateObj } from "./dateObj.model";
import { DatePipe } from "@angular/common";
import { DateService } from "./date.service";
import { MatDialog } from "@angular/material";
import { Relationship } from "../../../relationships/relationship.model";
import { DateDialogComponent } from "./date-dialog.component";

@Component({
    selector: 'app-date-card',
    templateUrl: './date-card.component.html',
    styleUrls: ['./date-card.component.css']
})
export class DateCardComponent implements OnInit{
    @Input() date: DateObj;
    @Input() relationship: Relationship;

    //The timestamp of the message
    meetingDate: string;
    meetingDateFormat: string = 'MM/dd/yyyy';

    //Inject Services
    constructor(private datePipe: DatePipe, private dateService: DateService, private dateDialog: MatDialog) {}

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

    /**
     * Open date dialog for editing
     * 
     * @memberof DateCardComponent
     */
    editDate() {
        //Open up our edit dialog
        let dialogRef = this.dateDialog.open(DateDialogComponent, {
            width: '500px',
            data: {
              relationship: this.relationship,
              areEditing: true,
              editTitle: this.date.title,
              editLocation: this.date.location,
              editHour: this.date.hour,
              editMinute: this.date.minute,
              date: this.date
            }
        });
    }

    /**
     * Call date service to delete this date, emit date deleted signal
     * 
     * @memberof DateCardComponent
     */
    deleteDate() {
        this.dateService.deleteDate(this.date.dateId)
            .subscribe(
                (response: any) => {
                    console.log("Deleted message...", response);
                }
            );
        
        this.dateService.dateDeletedEmitter.emit(this.date);
    }




}