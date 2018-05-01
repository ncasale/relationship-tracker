import { Component, Input, OnInit } from "@angular/core";
import { Feedback } from "./feedback.model";
import { AuthService } from "../../auth/auth.service";
import { User } from "../../auth/user.model";
import { FeedbackService } from "./feedback.service";

@Component({
    selector: 'app-feedback-card',
    templateUrl: './feedback-card.component.html', 
    styleUrls: ['./feedback-card.component.css']
})
export class FeedbackCardComponent implements OnInit{
    @Input() feedback: Feedback = new Feedback(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        false
    );
    firstname: string = "";
    lastname: string = "";
    
    //Inject services
    constructor(
        private authService: AuthService,
        private feedbackService: FeedbackService
    ){}

    ngOnInit() {
        //Get user from auth service
        console.log(this.feedback);
        this.authService.getUser(this.feedback.createUserId)
            .subscribe(
                (response: User) => {
                    this.firstname = response.firstname;
                    this.lastname = response.lastname;
                }
            )
    }

    modifyFeedback(closing: boolean) {
        this.feedbackService.modifyFeedback(this.feedback.feedbackId, closing)
            .subscribe(
                (response: Feedback) => {
                    //Change feedback to resolved
                    this.feedback.closed = closing;
                    this.feedbackService.feedbackModifiedEmitter.emit(response);
                }
            )
    }
}