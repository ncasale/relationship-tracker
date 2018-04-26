import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { ChangePasswordDialogComponent } from "./change-password-dialog.component";
import { User } from "../../auth/user.model";
import { AuthService } from "../../auth/auth.service";

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
        undefined
    );

    //Inject services
    constructor(
        public changePasswordDialog: MatDialog,
        private authService: AuthService
    ){}

    ngOnInit() {
        //Get the user object
        this.authService.getUser(localStorage.getItem('userId')).subscribe(
            (response: User) => {
                this.user = response;
            }
        )
    }

    openChangePasswordDialog() {
        this.changePasswordDialog.open(ChangePasswordDialogComponent, {
            width: '750px'
        })
    }

}