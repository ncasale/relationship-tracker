import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from "@angular/material";
import { FormControl, Validators } from "@angular/forms";
import { AuthService } from "../../auth/auth.service";

@Component({
    selector: 'app-change-password-dialog',
    templateUrl: './change-password-dialog.component.html',
    styleUrls: ['./change-password-dialog.component.css']
})
export class ChangePasswordDialogComponent {
    //Form Controls
    oldPassFC = new FormControl(null, Validators.required);
    newPassFC = new FormControl(null, Validators.required);
    confirmPassFC = new FormControl(null, Validators.required);

    //Inject services
    constructor(
        public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private authService: AuthService,
        public snackbar: MatSnackBar
    ){}

    getOldPassErrorMessage() {
        return this.oldPassFC.hasError('required') ? 'You must enter your old password' : '';
    }

    getNewPassErrorMessage() {
        return this.newPassFC.hasError('required') ? 'You must enter a new password' : '';
    }

    getConfirmPassErrorMessage() {
        return this.confirmPassFC.hasError('required') ? 'You must confirm the new password' : '';
    }

    isPasswordFormValid() {
        //Check that all forms filled out and new password matches cofirm password
        return this.oldPassFC.valid &&
            this.newPassFC.valid &&
            this.confirmPassFC.valid &&
            this.newPassFC.value === this.confirmPassFC.value;
    }

    changePassword() {
        //Call Auth service to change password
        this.authService.changePassword(
            this.oldPassFC.value,
            this.newPassFC.value
        ).subscribe(
            (response: boolean) => {
                if(response) {
                    //Open snackbar
                    this.snackbar.open('Password Changed', 'close', {
                        duration: 3500
                    })
                } else {
                    this.snackbar.open('Invalid Password Change', 'close', {
                        duration: 3500
                    })
                }
            }
        )
        this.oldPassFC.reset();
        this.newPassFC.reset();
        this.confirmPassFC.reset();
        this.dialogRef.close();
    }


}