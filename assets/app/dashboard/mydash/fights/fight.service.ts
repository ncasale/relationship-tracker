import { Injectable, EventEmitter } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Fight } from "./fight.model";
import { ErrorService } from "../../../error/error.service";

import "rxjs/Rx"
import { Observable } from "rxjs";

@Injectable()
export class FightService {
    //Signal to delete fight from fights component
    deleteFightFromFightsEmitter = new EventEmitter<Fight>();
    
    //Inject services
    constructor(
        private http: Http,
        private errorService: ErrorService
    ) {}

    /**
     * Add a new fight to the database
     * 
     * @param {Fight} fight fight to add to database
     * @returns json representation of saved fight
     * @memberof FightService
     */
    addFight(fight: Fight) {
        //Create body
        const body = JSON.stringify(fight);
        //Create headers
        const headers = new Headers({'Content-Type':'application/json'});
        //Get token
        const token = localStorage.getItem('token') ?
            '?token=' + localStorage.getItem('token') :
            '';
        //Create request
        return this.http.post('http://localhost:3000/fight/add' + token, body, {headers:headers})
            .map((response: Response) => {
                return response.json().obj;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            })
    }

    /**
     * Get all fights for a particular relationship from the database
     * 
     * @param {string} relationshipId ID of relationship
     * @returns Array of Fight objects
     * @memberof FightService
     */
    getFights(relationshipId: string) {
        //Create body
        const body = {};
        //Create headers
        const headers = new Headers({'Content-Type':'application/json'});
        //Get token
        const token = localStorage.getItem('token') ?
            '?token=' + localStorage.getItem('token') :
            '';
        //Create request
        return this.http.post('http://localhost:3000/fight/getfights/' + relationshipId + token, body, {headers:headers})
            .map((response: Response) => {
                var fights = response.json().obj;
                var transformedFights = [];
                for(let fight of fights) {
                    transformedFights.push(new Fight(
                        fight.title,
                        fight.descriptions,
                        fight.causes,
                        fight.resolutions,
                        fight.fightDate,
                        fight.relationshipId,
                        fight._id,
                        fight.createUserId,
                        fight.createTimestamp,
                        fight.editUserId,
                        fight.editTimestamp
                    ))
                }
                return transformedFights;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            })
    }

    /**
     * Edit an existing fight in the database
     * 
     * @param {Fight} fight the edited version of the fight
     * @returns A json representation of the edited fight
     * @memberof FightService
     */
    editFight(fight: Fight) {
        //Create body
        const body = JSON.stringify(fight);
        //Create headers
        const headers = new Headers({'Content-Type':'application/json'});
        //Get token
        const token = localStorage.getItem('token') ?
            '?token=' + localStorage.getItem('token') :
            '';
        //Create request
        return this.http.patch('http://localhost:3000/fight/edit' + token, body, {headers:headers})
            .map((response: Response) => {
                return response.json().obj;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            })
    }

    /**
     * Delete a fight from the database
     * 
     * @param {string} fightId the id of the fight to delete
     * @returns nothing
     * @memberof FightService
     */
    deleteFight(fightId: string) {
        //Create headers
        const headers = new Headers({'Content-Type':'application/json'});
        //Get token
        const token = localStorage.getItem('token') ?
            '?token=' + localStorage.getItem('token') :
            '';
        //Create request
        return this.http.delete('http://localhost:3000/fight/delete/' + fightId + token, {headers:headers})
            .map((response: Response) => {
                return response.json().obj;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            })
    }
}