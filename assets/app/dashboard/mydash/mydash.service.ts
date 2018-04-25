import { Injectable, EventEmitter, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { Relationship } from "../../relationships/relationship.model";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

@Injectable()
export class MyDashService implements OnInit{
    //The currently selected relationship on My Dash
    currentRelationship: Relationship;
    
    //Signal that fires when mydash relationships need to be updated
    updateMyDashRelationships = new EventEmitter<any>();
    
    //Subject for distributing current relationship
    private relationshipSubject = new Subject<any>();
    

    constructor(
        public snackBar: MatSnackBar
    ){}

    ngOnInit() {   
    }

    
    
    /**
     * Open a snackbar with the passed message and action
     * 
     * @param {string} message The message to display on the snackbar
     * @param {string} action The action text to display next to the message
     * @memberof MyDashService
     */
    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
          duration: 3500,
        });
    }

    /**
     * Returns the Subject for the current relationship as an observable
     * 
     * @returns {Observable<any>} The subject as an observable
     * @memberof MyDashService
     */
    getCurrentRelationship() : Observable<any> {
        this.relationshipSubject = new Subject<any>();
        return this.relationshipSubject.asObservable();
    }

    /**
     * Sets the current relationship and sends relationship to subscribers
     * 
     * @param {Relationship} relationship The current relationship
     * @memberof MyDashService
     */
    setCurrentRelationship(relationship: Relationship) {
        this.currentRelationship = relationship;
        this.relationshipSubject.next(relationship);
    }
    
    /**
     * Emit the current relationship if it exists
     * 
     * @memberof MyDashService
     */
    conditionallyEmitRelationship() {
        if(this.currentRelationship) {
            this.relationshipSubject.next(this.currentRelationship);
        }
    }

    /**
     * Mark the current Subject as complete
     * 
     * @memberof MyDashService
     */
    subjectComplete() {
        this.relationshipSubject.complete();
    }



}