import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material";

@Injectable()
export class MyDashService {

    constructor(
        public snackBar: MatSnackBar
    ){}
    
    /**
     * Open a snackbar with the passed message and action
     * 
     * @param {string} message The message to display on the snackbar
     * @param {string} action The action text to display next to the message
     * @memberof MyDashService
     */
    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
          duration: 3500,
        });
    }
}