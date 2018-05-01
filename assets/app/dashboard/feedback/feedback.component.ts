import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { FeedbackDialogComponent } from "./feedback-dialog.component";
import { AuthService } from "../../auth/auth.service";
import { FeedbackService } from "./feedback.service";
import { Feedback } from "./feedback.model";

@Component({
    selector: 'app-feedback',
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit{
    isAdmin: boolean = false;
    feedbacks: Feedback[] = [];

    //Inject services
    constructor(
        public feedbackDialog: MatDialog,
        private authService: AuthService,
        private feedbackService: FeedbackService
    ){}

    ngOnInit() {
        //Check if user is an admin
        this.authService.isUserAdmin().subscribe(
            (response: boolean) => {
                this.isAdmin = response;
            }
        )

        //Get feedback
        this.feedbackService.getFeedback().subscribe(
            (response: Feedback[]) => {
                this.feedbacks = response;
            }
        )

        //Update feedback when resolved or re-opened
        this.feedbackService.feedbackModifiedEmitter.subscribe(
            (response: Feedback) => {
                //Find feedback in feedbacks
                for(let feedback of this.feedbacks) {
                    if(feedback.feedbackId == response.feedbackId) {
                        feedback.closed = response.closed;
                    }
                }
            }
        )
    }
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