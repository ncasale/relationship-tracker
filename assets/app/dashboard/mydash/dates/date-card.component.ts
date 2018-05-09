import { Component, Input, OnInit } from "@angular/core";
import { DateObj } from "./dateObj.model";
import { DatePipe } from "@angular/common";
import { DateService } from "./date.service";
import { MatDialog } from "@angular/material";
import { Relationship } from "../../../relationships/relationship.model";
import { DateDialogComponent } from "./date-dialog.component";
import { DeleteItemDialogComponent } from "../common/delete-item-dialog.component";
import { MyDashService } from "../mydash.service";

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
    constructor(
        private datePipe: DatePipe, 
        private dateService: DateService, 
        private dateDialog: MatDialog,
        private deleteDialog: MatDialog,
        private myDashService: MyDashService
    ) {}

    ngOnInit() {
        //Set meetingDate in correct format
        this.meetingDate = this.datePipe.transform(this.date.date, this.meetingDateFormat);
        this.dateService.dateEditedEmitter.subscribe(
            (response: any) => {
                this.meetingDate = this.datePipe.transform(this.date.date, this.meetingDateFormat);
            }
        )

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
        //Open delete item dialog
        var dialogRef = this.deleteDialog.open(DeleteItemDialogComponent, {
            width: '500px'
        })
        dialogRef.afterClosed().subscribe(
            result => {
                if(result) {
                    this.dateService.deleteDate(this.date.dateId)
                        .subscribe(
                            (response: any) => {
                                this.dateService.dateDeletedEmitter.emit(this.date);
                                this.myDashService.openSnackBar(this.dateOrEvent() + ' Deleted.', 'close');
                            }
                        );
                    
                }
            }
        )
    }

    dateOrEvent() {
        return this.relationship.isPlatonic ? 'Event' : 'Date';
    }




}