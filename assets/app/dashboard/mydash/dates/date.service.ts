import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { DateObj } from "./dateObj.model";
import { ErrorService } from "../../../error/error.service";

import "rxjs/Rx"
import { Observable } from "rxjs";

@Injectable()
export class DateService {
    //Inject services
    constructor(private http: Http, private errorService: ErrorService) {}

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
        //Get relationship Id

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
}