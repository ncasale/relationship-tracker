import { Component, OnInit, Input } from "@angular/core";
import { Chore } from "./chore.model";
import { DatePipe } from "@angular/common";
import { AuthService } from "../../../auth/auth.service";
import { User } from "../../../auth/user.model";
import { MatDialog } from "@angular/material";
import { ChoreDialogComponent } from "./chore-dialog.component";
import { ChoreService } from "./chore.service";

@Component({
    selector: 'app-chore-card',
    templateUrl: './chore-card.component.html',
    styleUrls: ['./chore-card.component.css']
})
export class ChoreCardComponent implements OnInit{
    //The chore to display on card
    @Input() chore: Chore;
    formattedDueDate: string;
    dueDateFormat: string = "MM/dd/yyyy";
    assignedUser: string = "";

    //Inject services
    constructor(
        private datePipe: DatePipe,
        private authService: AuthService,
        private choreService: ChoreService,
        private choreDialog: MatDialog) {};

    ngOnInit() {
        //Format due date
        this.formattedDueDate = this.datePipe.transform(this.chore.dueDate, this.dueDateFormat);
        //Get user first and last name from database
        this.setAssignedUser();
        //Update due date/assigned user whenever chore edited
        this.choreService.choreEdited.subscribe(
            (response: any) => {
                this.formattedDueDate = this.datePipe.transform(this.chore.dueDate, this.dueDateFormat);
                this.setAssignedUser();
            }
        )

    }

    /**
     * Find assigned user for chore, and use to display first and last name on card
     * 
     * @memberof ChoreCardComponent
     */
    setAssignedUser() {
        this.authService.getUser(this.chore.assignedUserId)
            .subscribe(
                (user: User) => {
                    //Set assignedUser to the first/last name of retrieved user
                    this.assignedUser = user.firstname + ' ' + user.lastname;
                }
            )       
    }

    /**
     * Open up Chore Dialog to edit mode and pass along necessary data to prepopulate fields
     * 
     * @memberof ChoreCardComponent
     */
    editChore() {
        let dialogRef = this.choreDialog.open(ChoreDialogComponent, {
            width: "500px",
            data: {
                chore: this.chore,
                relationshipId: this.chore.relationshipId,
                areEditing: true
            }
        })
        
    }

    /**
     * Call chore service to delete this chore
     * 
     * @memberof ChoreCardComponent
     */
    deleteChore() {
        this.choreService.deleteChore(this.chore.choreId)
            .subscribe(
                (response: any) => {
                    console.log("Chore deleted...");
                }
            )
    }

}