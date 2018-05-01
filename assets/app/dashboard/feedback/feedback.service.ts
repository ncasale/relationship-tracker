import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Feedback } from './feedback.model'
import { ErrorService } from "../../error/error.service";
import { Observable } from 'rxjs/Observable';
import { MatSnackBar } from "@angular/material";

@Injectable() 
export class FeedbackService {
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