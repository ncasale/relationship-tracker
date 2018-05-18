import { Injectable, EventEmitter } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Gratitude } from "./gratitude.model";
import { ErrorService } from "../../../error/error.service";
import { Observable } from "rxjs/Observable"
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class GratitudeService {
    //Signal that fires when new gratitude created
    gratitudeCreatedEmitter = new EventEmitter<Gratitude>();
    gratitudeEditedEmitter = new EventEmitter<any>();
    gratitudeDeletedEmitter = new EventEmitter<Gratitude>();
    
    //Inject services
    constructor(
        private http: Http,
        private errorService: ErrorService
    ){}

    /**
     * Method to add a new gratitude to the database
     * 
     * @param {Gratitude} gratitude the gratitude to save to the database
     * @returns the saved gratitude
     * @memberof GratitudeService
     */
    addGratitude(gratitude: Gratitude) {
        //Create body
        const body = JSON.stringify(gratitude);
        //Create headers
        const headers = new Headers({'Content-Type':'application/json'});
        //Get token
        const token = this.getToken();
        //Create request
        return this.http.post('http://52.91.114.12:80/gratitude/add' + token, body, {headers:headers})
            .map((response: Response) => {
                var gratitude = response.json().obj;
                var transformedGratitude = new Gratitude(
                    gratitude.title,
                    gratitude.text,
                    gratitude._id,
                    gratitude.relationshipId,
                    gratitude.createTimestamp,
                    gratitude.createUserId,
                    gratitude.editTimestamp,
                    gratitude.editUserId
                );
                return transformedGratitude;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            })
    }

    /**
     * Get all gratitudes associated with a particular relationship
     * 
     * @param {string} relationshipId the realtionship to grab gratitudes from
     * @returns A list of gratitudes
     * @memberof GratitudeService
     */
    getGratitudes(relationshipId: string) {
        //Create body
        const body = {};
        //Create headers
        const headers = new Headers({'Content-Type':'application/json'});
        //Get token
        const token = this.getToken();
        //Create request
        return this.http.post('http://52.91.114.12:80/gratitude/getgratitudes/' + relationshipId + token, body, {headers:headers})
            .map((response: Response) => {
                var gratitudes = response.json().obj;
                var transformedGratitudes = [];
                for(let gratitude of gratitudes) {
                    transformedGratitudes.push(new Gratitude(
                        gratitude.title,
                        gratitude.text,
                        gratitude._id,
                        gratitude.relationshipId,
                        gratitude.createTimestamp,
                        gratitude.createUserId,
                        gratitude.editTimestamp,
                        gratitude.editUserId
                    ));
                }
                return transformedGratitudes;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            })
        }
    
    /**
     * Edit an exisitng gratitude in the db
     * 
     * @param {Gratitude} gratitude The gratitude to edit
     * @memberof GratitudeService
     */
    editGratitude(gratitude: Gratitude) {
        //Create body
        const body = JSON.stringify(gratitude);
        //Create headers
        const headers = new Headers({'Content-Type':'application/json'});
        //Get token
        const token = this.getToken();
        //Create request
        return this.http.patch('http://52.91.114.12:80/gratitude/edit' + token, body, {headers:headers})
            .map((response: Response) => {
                var gratitude = response.json().obj;
                var transformedGratitude = new Gratitude(
                    gratitude.title,
                    gratitude.text,
                    gratitude._id,
                    gratitude.relationshipId,
                    gratitude.createTimestamp,
                    gratitude.createUserId,
                    gratitude.editTimestamp,
                    gratitude.editUserId
                );
                return transformedGratitude;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            })
    }

    /**
     * Delete a gratitude from the database
     * 
     * @param {string} gratitudeId ID of gratitude to delete
     * @returns deleted gratitude
     * @memberof GratitudeService
     */
    deleteGratitude(gratitudeId: string) {
        //Create headers
        const headers = new Headers({'Content-Type':'application/json'});
        //Get token
        const token = this.getToken();
        //Create request
        return this.http.delete('http://52.91.114.12:80/gratitude/delete/' + gratitudeId + token, {headers:headers})
            .map((response: Response) => {
                return response.json().obj;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            })
    }

    /**
     * Get jwt from local storage
     * 
     * @returns jwt from local storage
     * @memberof GratitudeService
     */
    getToken() {
        return localStorage.getItem('token') ?
            "?token=" + localStorage.getItem('token') :
            '';
    }
}