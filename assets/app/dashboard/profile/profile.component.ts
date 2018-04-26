import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { ChangePasswordDialogComponent } from "./change-password-dialog.component";
import { User } from "../../auth/user.model";
import { AuthService } from "../../auth/auth.service";
import { DatePipe } from "@angular/common";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
    user: User = new User(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
    );

    joinDate: string = "";
    joinDateFormat: string = "MM/dd/yyyy";

    //Inject services
    constructor(
        public changePasswordDialog: MatDialog,
        private authService: AuthService,
        private datePipe: DatePipe
    ){}

    ngOnInit() {
        //Get the user object
        this.authService.getUser(localStorage.getItem('userId')).subscribe(
            (response: User) => {
                this.user = response;
                this.joinDate = this.datePipe.transform(this.user.createTimestamp, this.joinDateFormat);
            }
        )
    }

    openChangePasswordDialog() {
        this.changePasswordDialog.open(ChangePasswordDialogComponent, {
            width: '750px'
        })
    }

}