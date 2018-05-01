import { Component } from "@angular/core";
import { MatDialog } from "@angular/material";
import { FeedbackDialogComponent } from "./feedback-dialog.component";

@Component({
    selector: 'app-feedback',
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent {
    //Inject services
    constructor(
        public feedbackDialog: MatDialog
    ){}

    /**
     * Open Feedback dialog
     * 
     * @memberof FeedbackComponent
     */
    openFeedbackDialog() {
        this.feedbackDialog.open(FeedbackDialogComponent, {
            width: '500px'
        });
    }
}