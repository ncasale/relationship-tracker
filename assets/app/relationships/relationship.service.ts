import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Relationship } from './relationship.model';
import { Router } from '@angular/router';
import { ErrorService } from '../error/error.service';
import { Message } from '../dashboard/mydash/messages/message.model';



@Injectable()
export class RelationshipService {
    private relationships: Relationship[] = [];

    //Signal to show invite component
    toggleInviteComponent = new EventEmitter<any>();

    //Signal to set relationship of invite component
    setInviteRelationshipEmitter = new EventEmitter<Relationship>();

    //Signal to remove invite id from join component list
    removeInviteId = new EventEmitter<string>();

    //Inject the Http service
    constructor(private http: Http, private router: Router, private errorService: ErrorService) {}

    /**
     * Adds a relationship to the database through a post request. Also updates personal list
     * of relationships
     * 
     * @param {Relationship} relationship the relationship to add to the db
     * @returns observable that is either a Relationship object, or an error
     * @memberof RelationshipService
     */
    addRelationship(relationship: Relationship) {
        //Create body
        const body = JSON.stringify(relationship);
        console.log('Body: ', body);
        //Create headers
        const headers = new Headers({'Content-Type': 'application/json'});
        //Get token
        const token = this.getToken();
        //Create request
        return this.http.post('http://52.91.114.12:80/relationship/add' + token, body, {headers:headers})
            .map((response: Response) => {
                const result = response.json();
                const relationship = new Relationship(
                    result.obj.title,
                    result.obj._id,
                    result.obj.userIds,
                    result.obj.invitees,
                    result.obj.createTimestamp,
                    result.obj.isPlatonic              
                );
                this.relationships.push(relationship);
                return relationship;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                this.router.navigateByUrl('/');
                return Observable.throw(error.json())
            });

    }

    /**
     * Returns all relationships associated with the currently logged in user.
     * 
     * @returns {Observable} that is either a list of relationships, or an error
     * @memberof RelationshipService
     */
    getRelationships() {
        //Construct the body of our request
        const body = JSON.stringify(Relationship);
        //Headers
        const headers = new Headers({'Content-Type': 'application/json'});
        //Get token
        const token = this.getToken();
        //Create request
        return this.http.post('http://52.91.114.12:80/relationship/getrelationships' + token, body, {headers: headers})
            .map((response: Response) => {
                    const relationships = response.json().obj;
                    let transformedRelationships: Relationship[] = [];
                    for(let relationship of relationships) {
                        transformedRelationships.push(new Relationship(
                            relationship.title,
                            relationship._id,
                            relationship.users,
                            relationship.invitees,
                            relationship.createTimestamp,
                            relationship.isPlatonic
                        ))
                    }
                    this.relationships = transformedRelationships;
                    return transformedRelationships;
                })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json())
            });
    }

    /**
     * Invite a user to the passed relationship
     * 
     * @param {Relationship} relationship the relationship to which we invite the user
     * @param {string} email the email of the invited user
     * @returns JSON of the server response
     * @memberof RelationshipService
     */
    inviteToRelationship(relationship: Relationship, email: string) {
        //Construct the body
        const body = JSON.stringify(relationship);
        //Construct the headers
        const headers = new Headers({'Content-Type':'application/json'});
        //Get token
        const token = this.getToken();
        //Construct the patch request
        return this.http.patch('http://52.91.114.12:80/relationship/invite/' + email + '/' + relationship.relationshipId + token, body, {headers: headers})
            .map((response: Response) => {
                response.json()
            })
            .catch((error: Response) => {
                return Observable.throw(error.json());
            })

    }

    /**
     * Get all relationships to which the current user is invited
     * 
     * @returns 
     * @memberof RelationshipService
     */
    getInvitedRelationships() {
        //Construct body
        const body = null;
        //Construct headers
        const headers = new Headers({'Content-Type':'application/json'});
        //Get token
        const token = this.getToken();
        //Create post request
        return this.http.post('http://52.91.114.12:80/relationship/getinvitedrelationships' + token,
            body, {headers:headers})
            .map((response: Response) => {
                const invitedRelationships = response.json().obj;
                let transformedInvitedRelationships: Relationship[] = [];
                for(let relationship of invitedRelationships) {
                    transformedInvitedRelationships.push(new Relationship(
                        relationship.title,
                        relationship._id,
                        relationship.users,
                        relationship.invitees,
                        relationship.createTimestamp,
                        relationship.isPlatonic
                    ))
                }
                return transformedInvitedRelationships;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            })
    }

    /**
     * Deny an invite to the passed relationship
     * 
     * @param inviteId the ID of the relationship to deny an invite to
     */
    declineRelationshipInvite(inviteId: string) {
        //Create body
        const body = {};
        //Create headers
        const headers = new Headers({'Content-Type':'application/json'});
        //Get token
        const token = this.getToken();
        //Generate request
        return this.http.patch('http://52.91.114.12:80/relationship/declineinvite/' + inviteId + token, body, {headers:headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            })
    }

    /**
     * Accept a relationship invite with the passed Id
     * 
     * @param {string} inviteId the Id of the invite to accept
     * @returns JSON representation of the server response
     * @memberof RelationshipService
     */
    acceptRelationshipInvite(inviteId: string) {
        //Create body
        const body = {}
        //Create headers
        const headers = new Headers({'Content-Type':'application/json'});
        //Get token
        const token = this.getToken();
        //Construct request
        return this.http.patch('http://52.91.114.12:80/relationship/acceptinvite/' + inviteId + token, body, {headers: headers})
            .map((response: Response) => {
                response.json()
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            })

    }

    /**
     * Return a list of users that are members of the passed relationship
     * 
     * @param {string} relationshipId the relationship to get members of
     * @memberof RelationshipService
     */
    getRelationshipUsers(relationshipId: string) {
        //Create body
        const body = {};
        //Create headers
        const headers = new Headers({'Content-Type':'application/json'});
        //Get token
        const token = this.getToken();
        //Create request
        return this.http.post('http://52.91.114.12:80/relationship/getusers/' + relationshipId + token, body, {headers:headers})
            .map((response: Response) => {
                return response.json().obj;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            })

    }

    leaveRelationship(relationshipId: string) {
        //Create body
        const body = {};
        //Create headers
        const headers = new Headers({'Content-Type':'application/json'});
        //Get Token
        const token = this.getToken();
        //Create request
        return this.http.patch('http://52.91.114.12:80/relationship/leave/' + relationshipId + token, body, {headers:headers})
            .map((response: Response) => {
                return response.json().obj;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            })
    }

    /**
     * Returns a list of relationships given a list of ids to lookup
     * 
     * @param {string[]} relationshipIds the list of ids to lookup
     * @returns a list of Relationship objects
     * @memberof RelationshipService
     */
    getRelationshipsById(relationshipIds: string[]) {
        //Create body
        const body = JSON.stringify({
            relationshipIds: relationshipIds
        })
        //Create headers
        const headers = new Headers({'Content-Type':'application/json'});
        //Get token
        const token = this.getToken();
        //Create request
        return this.http.post('http://52.91.114.12:80/relationship/getrelationshipsbyid/' + token, body, {headers:headers})
            .map((response: Response) => {
                //Transform relationships array into frontend relationships
                var relationships = response.json().obj;
                var transformedRelationships = [];
                for(let relationship of relationships) {
                    transformedRelationships.push(new Relationship(
                        relationship.title,
                        relationship._id,
                        relationship.userIds,
                        relationship.invitees,
                        relationship.createTimestamp,
                        relationship.isPlatonic
                    ));
                }
                return transformedRelationships;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            })
    }
    
    /**
     * Emit signal to update relationship in invite component
     * 
     * @param {Relationship} relationship the relationship to set in invite component
     * @memberof RelationshipService
     */
    setInviteRelationship(relationship: Relationship) {
        this.setInviteRelationshipEmitter.emit(relationship);
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