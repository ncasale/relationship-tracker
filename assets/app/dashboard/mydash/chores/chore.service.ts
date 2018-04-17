import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Chore } from "./chore.model";

import "rxjs/Rx";
import { Observable } from "rxjs";
import { ErrorService } from "../../../error/error.service";


@Injectable()
export class ChoreService {

    //Inject services
    constructor(private http: Http, private errorService: ErrorService) {}

    /**
     * Add a passed chore to the database
     * 
     * @param {Chore} chore the chore to be added to the database
     * @returns JSON representation of saved chore
     * @memberof ChoreService
     */
    addChore(chore: Chore) {
        //Create body
        const body = JSON.stringify(chore);
        //Create headers
        const headers = new Headers({'Content-Type':'application/json'});
        //Get token
        const token = localStorage.getItem('token') ?
            '?token=' + localStorage.getItem('token') :
            '';
        //Create request
        return this.http.post('http://localhost:3000/chore/add' + token, body, {headers:headers})
            .map((response: Response) => {
                return response.json().obj;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            })
    }
}