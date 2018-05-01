import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { FormControl, Validators } from "@angular/forms";
import { Feedback } from "./feedback.model";
import { FeedbackService } from "./feedback.service";

@Component({
    selector: 'app-feedback-dialog',
    templateUrl: './feedback-dialog.component.html',
    styleUrls: ['./feedback-dialog.component.css']
})
export class FeedbackDialogComponent {
    //Form Controls
    titleFC = new FormControl(null, Validators.required);
    descriptionFC = new FormControl(null, Validators.required);

    //Inject services
    constructor(
        public dialogRef: MatDialogRef<FeedbackDialogComponent>,
        private feedbackService: FeedbackService
    ){}

    /**
     * Called when feedback is submitted
     * 
     * @memberof FeedbackDialogComponent
     */
    onSubmit() {
        //Create feedback object
        var feedback = new Feedback(
            this.titleFC.value,
            this.descriptionFC.value
        );
        //Call Feedback service to send to db
        this.feedbackService.addFeedback(feedback)
            .subscribe(
                (response: any) => {
                    //Open snackbar to tell of successful feedback
                    this.feedbackService.openSnackbar('Feedback Received', 'close');
                }
            )
        //Close dialog
        this.dialogRef.close();
    }

    /**
     * Returns error message for title form
     * 
     * @returns Error
     * @memberof FeedbackDialogComponent
     */
    getTitleErrorMessage() {
        return this.titleFC.hasError('required') ? 'You must enter a title' : '';
    }

    /**
     * Returns error message for description form
     * 
     * @returns Error
     * @memberof FeedbackDialogComponent
     */
    getDescriptionErrorMessage () {
        return this.descriptionFC.hasError('required') ? 'You must enter a description' : '';
    }

    /**
     * Checks if the feedback form is filled out correctly
     * 
     * @returns {boolean} true if feedback form correct, false otherwise
     * @memberof FeedbackDialogComponent
     */
    isFeedbackValid() : boolean {
        return this.titleFC.valid &&
            this.descriptionFC.valid;
    }
    

}