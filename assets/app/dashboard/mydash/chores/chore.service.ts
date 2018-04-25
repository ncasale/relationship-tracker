import { Injectable, EventEmitter } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Chore } from "./chore.model";

import "rxjs/Rx";
import { Observable } from "rxjs";
import { ErrorService } from "../../../error/error.service";


@Injectable()
export class ChoreService {

    //Inject services
    constructor(private http: Http, private errorService: ErrorService) {}

    //Signals to update date on card if chore edited/deleted
    choreEdited = new EventEmitter<null>();
    choreDeleted = new EventEmitter<Chore>();
    choreCreatedEmitter = new EventEmitter<Chore>();

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
        const token = this.getToken();
        //Create request
        return this.http.post('http://localhost:3000/chore/add' + token, body, {headers:headers})
            .map((response: Response) => {
                var chore = response.json().obj;
                return new Chore(
                    chore.title,
                    chore.dueDate,
                    chore.assignedUserId,
                    chore.relationshipId,
                    chore._id,
                    chore.createUserId,
                    chore.createTimestamp,
                    chore.editUserId,
                    chore.editTimestamp
                );
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            })
    }

    /**
     * Get chores associated with passed relationship Id
     * 
     * @param {string} relationshipId ID of relationship to get chores for
     * @returns 
     * @memberof ChoreService
     */
    getChores(relationshipId: string) {
        //Create body
        const body = {};
        //Create headers
        const headers = new Headers({'Content-Type':'application/json'});
        //Get token
        const token = this.getToken();
        //Create request
        return this.http.post('http://localhost:3000/chore/getchores/' + relationshipId + token, body, {headers:headers})
            .map((response: Response) => {
                var chores = response.json().obj;
                var transformedChores = [];
                for(let chore of chores) {
                    transformedChores.push(new Chore(
                        chore.title,
                        chore.dueDate,
                        chore.assignedUserId,
                        chore.relationshipId,
                        chore._id,
                        chore.createUserId,
                        chore.createTimestamp,
                        chore.editUserId,
                        chore.editTimestamp
                    ))
                }              
                return transformedChores;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            })

    }

    /**
     * Edit a passed chore in the database
     * 
     * @param {Chore} chore the edited version of the chore
     * @returns 
     * @memberof ChoreService
     */
    editChore(chore: Chore) {
        //Create body
        const body = JSON.stringify(chore);
        //Create headers
        const headers = new Headers({'Content-Type':'application/json'});
        //Get token
        const token = this.getToken();
        //Create request
        return this.http.patch('http://localhost:3000/chore/editchore' + token, body, {headers:headers})
            .map((response: Response) => {
                return response.json().obj;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            })
    }

    /**
     * Delete a specified chore from the database
     * 
     * @param {string} choreId Id of chore to delete from the database
     * @returns A JSON representation of the chore that was just deleted
     * @memberof ChoreService
     */
    deleteChore(choreId: string) {
        //Create headers
        const headers = new Headers({'Content-Type':'application/json'});
        //Get token
        const token = this.getToken();
        //Create request
        return this.http.delete('http://localhost:3000/chore/delete/' + choreId + token, {headers:headers})
            .map((response: Response) => {
                return response.json().obj;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            })
    }

    /**
     * Returns the local storage token if it exists
     * 
     * @returns string - local storage token
     * @memberof RelationshipService
     */
    getToken() {
        return localStorage.getItem('token') ?
            '?token' + localStorage.getItem('token') :
            '';
    }
}