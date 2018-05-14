import { Injectable, EventEmitter } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Feedback } from './feedback.model'
import { ErrorService } from "../../error/error.service";
import { MatSnackBar } from "@angular/material";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable() 
export class FeedbackService {
    //Signal that fires when feedback resolved
    feedbackModifiedEmitter = new EventEmitter<Feedback>();

    //Inject services
    constructor(
        private http: Http,
        private errorService: ErrorService,
        public snackbar: MatSnackBar
    ){}

    /**
     * Method to add new feedback object to db
     * 
     * @param {Feedback} feedback feedback to add to db
     * @returns Feedback object
     * @memberof FeedbackService
     */
    addFeedback(feedback: Feedback) {
        //Create body
        const body = JSON.stringify(feedback);
        //Create headers
        const headers = new Headers({'Content-Type':'application/json'});
        //Get token
        const token = this.getToken();
        //Create request
        return this.http.post('http://localhost:3000/feedback/add' + token, body, {headers:headers})
            .map((response: Response) => {
                return response.json().obj;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            })
    }

    /**
     * Gets all feedback for site
     * 
     * @returns an array of feedback objects
     * @memberof FeedbackService
     */
    getFeedback() {
        //Create body
        const body = {};
        //Create headers
        const headers = new Headers({'Content-Type':'application/json'});
        //Get token
        const token = this.getToken();
        //Create request
        return this.http.post('http://localhost:3000/feedback/getfeedback' + token, body, {headers:headers})
            .map((response: Response) => {
                var feedbacks = response.json().obj;
                var transformedFeedback = [];
                for(let feedback of feedbacks) {
                    transformedFeedback.push(new Feedback(
                        feedback.title,
                        feedback.description,
                        feedback._id,
                        feedback.createUserId,
                        feedback.createTimestamp,
                        feedback.closed 
                    ));
                }
                return transformedFeedback;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            })
    }

    /**
     * Mark feedback as resolved
     * 
     * @param {string} feedbackId the id of the feedback to resolve
     * @param {boolean} closing true if we are to close feedback, false if we are re-opening
     * @returns the resolved feedback
     * @memberof FeedbackService
     */
    modifyFeedback(feedbackId: string, closing: boolean) {
        //Create body
        const body = {};
        //Create headers
        const headers = new Headers({'Content-Type':'application/json'});
        //Get token
        const token = this.getToken();
        //Create request
        return this.http.patch('http://localhost:3000/feedback/modify/' + feedbackId + '/' + closing + token, body, {headers:headers})
            .map((response: Response) => {
                //Return feedback object
                var feedback = response.json().obj;
                var transformedFeedback = new Feedback(
                    feedback.title,
                    feedback.description,
                    feedback._id,
                    feedback.createUserId,
                    feedback.createTimestamp,
                    feedback.closed
                );
                return transformedFeedback;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            })
    }

    /**
     * Method to get token from local storage
     * 
     * @returns 
     * @memberof FeedbackService
     */
    getToken() {
        return localStorage.getItem('token') ?
            '?token=' + localStorage.getItem('token') :
            '';
    }

    /**
     * Opens a snackbar with the passed message and action
     * 
     * @param {string} message the message to display
     * @param {string} action the action to use
     * @memberof FeedbackService
     */
    openSnackbar(message: string, action: string) {
        this.snackbar.open(message, action, {
            duration: 3500
        });
    }
}