import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Fight } from "./fight.model";
import { ErrorService } from "../../../error/error.service";

import "rxjs/Rx"
import { Observable } from "rxjs";

@Injectable()
export class FightService {
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
}