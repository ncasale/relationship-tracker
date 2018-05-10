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

    //Signal to add a new fight to fights component
    fightCreated = new EventEmitter<Fight>();
    
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
        const token = this.getToken();
        //Create request
        return this.http.post('http://52.91.114.12:80/fight/add' + token, body, {headers:headers})
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
        const token = this.getToken();
        //Create request
        return this.http.post('http://52.91.114.12:80/fight/getfights/' + relationshipId + token, body, {headers:headers})
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
        const token = this.getToken();
        //Create request
        return this.http.patch('http://52.91.114.12:80/fight/edit' + token, body, {headers:headers})
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
        const token = this.getToken();
        //Create request
        return this.http.delete('http://52.91.114.12:80/fight/delete/' + fightId + token, {headers:headers})
            .map((response: Response) => {
                return response.json().obj;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            })
    }

    /**
     * Check if the current user has submitted all necessary data required to view a fight
     * 
     * @param {string} fightId the id of the fight to check 
     * @returns true if use has submitted all info, false otherwise
     * @memberof FightService
     */
    getFight(fightId: string) {
        //Create body
        const body = {};
        //Create headers
        const headers = new Headers({'Content-Type':'application/json'});
        //Get token
        const token = this.getToken();
        //Create request
        return this.http.post('http://52.91.114.12:80/fight/checkUserSubmittedInfo/' + fightId + token, body, {headers:headers})
            .map((response: Response) => {
                var fight = response.json().obj;
                return new Fight(
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
                )
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
            '?token=' + localStorage.getItem('token') :
            '';
    }
}