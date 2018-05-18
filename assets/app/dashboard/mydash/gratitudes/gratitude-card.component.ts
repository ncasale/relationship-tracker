import { Component, Input, OnInit } from "@angular/core";
import { Gratitude } from "./gratitude.model";
import { GratitudeService } from "./gratitude.service";
import { GratitudeDialogComponent } from "./gratitude-dialog.component";
import { MatDialog } from "@angular/material";
import { DeleteItemDialogComponent } from "../common/delete-item-dialog.component";
import { MyDashService } from "../mydash.service";
import { AuthService } from "../../../auth/auth.service";
import { User } from "../../../auth/user.model";
import { DatePipe } from "@angular/common";

@Component({
    selector: 'app-gratitude-card',
    templateUrl: './gratitude-card.component.html',
    styleUrls: ['./gratitude-card.component.css']
})
export class GratitudeCardComponent implements OnInit{
    @Input() gratitude: Gratitude;

    //First and last name of user who created gratitude
    firstname: string = '';
    lastname: string = '';
    timestamp: string = '';
    timestampFormat: 'MM/dd/yy';

    //Inject services
    constructor(
        private gratitudeService: GratitudeService,
        private myDashService: MyDashService,
        private authService: AuthService,
        private datePipe: DatePipe,
        public editGratitudeDialog: MatDialog,
        public deleteDialog: MatDialog
    ){}

    ngOnInit() {
        //Get first and last name of user
        this.authService.getUser(this.gratitude.createUser).subscribe(
            (user: User) => {
                this.firstname = user.firstname;
                this.lastname = user.lastname;
            }
        )

        //Format timestamp
        if(!this.gratitude.editTimestamp) {
            this.timestamp = this.datePipe.transform(this.gratitude.createTimestamp, this.timestampFormat);
        } else {
            this.timestamp = this.datePipe.transform(this.gratitude.editTimestamp, this.timestampFormat) + ' *';
        }
    }

    /**
     * Open edit gratitude dialog
     * 
     * @memberof GratitudeCardComponent
     */
    editGratitude() {
        let dialogRef = this.editGratitudeDialog.open(GratitudeDialogComponent, {
            width: '500px',
            data: {
                areEditing: true,
                gratitude: this.gratitude
            },
            autoFocus: false
        })
    }

    /**
     * Open delete dialog. If user confirms deletion, delete gratitude from db/frontend
     * 
     * @memberof GratitudeCardComponent
     */
    deleteGratitude() {
        let dialogRef = this.deleteDialog.open(DeleteItemDialogComponent, {
            width: '500px',
            autoFocus: false
        });

        dialogRef.afterClosed().subscribe(
            result => {
                if(result) {
                    this.gratitudeService.deleteGratitude(this.gratitude.gratitudeId)
                        .subscribe(
                            (response: any) => {
                                this.gratitudeService.gratitudeDeletedEmitter.emit(this.gratitude);
                                this.myDashService.openSnackBar('Gratitude Deleted.', 'close');
                            }
                        )
                }
            }
        )
    }

    /**
     * Checks if this gratitude belongs to the current user
     * 
     * @returns true if gratitude belongs to user, false otherwise
     * @memberof GratitudeCardComponent
     */
    isMyGratitude() {
        return this.gratitude.createUser == localStorage.getItem('userId');
    }
}