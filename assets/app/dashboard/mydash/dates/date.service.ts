import { Injectable, EventEmitter } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { DateObj } from "./dateObj.model";
import { ErrorService } from "../../../error/error.service";

import "rxjs/Rx"
import { Observable } from "rxjs";

@Injectable()
export class DateService {
    //Inject services
    constructor(private http: Http, private errorService: ErrorService) {}

    //Signal that fires when a date is deleted
    dateDeletedEmitter = new EventEmitter<DateObj>();
    dateEditedEmitter = new EventEmitter<null>();

    /**
     * Save a date to the database
     * 
     * @param {DateObj} dateObj the date to save
     * @returns 
     * @memberof DateService
     */
    saveDate(dateObj: DateObj) {
        //Create the body
        const body = JSON.stringify(dateObj);
        //Create the headers
        const headers = new Headers({'Content-Type': 'application/json'});
        //Get token
        const token = localStorage.getItem('token') ?
            "?token=" + localStorage.getItem('token') :
            '';
        //Generate our request
        return this.http.post('http://localhost:3000/date/add/' + token, body, {headers:headers})
            .map((response: Response) => {
                console.log(response);
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            })
    }

    /**
     * Get all dates for a given relationship
     * 
     * @param {string} relationshipId id of relationship to get dates for
     * @returns 
     * @memberof DateService
     */
    getDates(relationshipId: string) {
        //Create body
        const body = {};
        //Create headers
        const headers = new Headers({'Content-Type': 'application/json'});
        //Get token
        const token = localStorage.getItem('token') ?
            '?token=' + localStorage.getItem('token') :
            '';
        //Generate request
        return this.http.post('http://localhost:3000/date/getdates/' + relationshipId + token, body, {headers:headers})
            .map((response: any) => {
                var dates = response.json().obj;
                var transformedDates = [];
                for(let date of dates) {
                    transformedDates.push(new DateObj(
                        date.title,
                        date.location,
                        date.hour,
                        date.minute,
                        date.date,
                        date._id,
                        date.relationshipId,
                        date.createUserId,
                        date.createTimestamp,
                        date.editTimestamp
                    ));
                }
                return transformedDates;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            })

    }

    /**
     * Edit the passed date in the database
     * 
     * @param {DateObj} date the edited version of the date
     * @returns 
     * @memberof DateService
     */
    editDate(date: DateObj) {
        //Create body
        const body = JSON.stringify(date);
        //Create headers
        const headers = new Headers({'Content-Type':'application/json'});
        //Get token
        const token = localStorage.getItem('token') ?
            '?token=' + localStorage.getItem('token') :
            '';
        //Create a request
        return this.http.patch('http://localhost:3000/date/edit' + token, body, {headers:headers})
            .map((response: Response) => {
                return response.json().obj;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            })
    }

    /**
     * Delete the date with the passed ID from the database
     * 
     * @param {string} dateId ID of date to delete
     * @returns 
     * @memberof DateService
     */
    deleteDate(dateId: string) {
        //Create headers
        const headers = new Headers({'Content-Type':'application/json'});
        //Get token
        const token = localStorage.getItem('token') ?
            "?token=" + localStorage.getItem('token') :
            '';
        //Create request
        return this.http.delete('http://localhost:3000/date/delete/' + dateId + token, {headers:headers})
            .map((response: Response) => {
                return response.json().obj;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            })
    }
}