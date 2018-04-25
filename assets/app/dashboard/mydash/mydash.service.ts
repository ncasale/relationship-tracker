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

    getCurrentRelationship() : Observable<any> {
        this.relationshipSubject = new Subject<any>();
        return this.relationshipSubject.asObservable();
    }

    setCurrentRelationship(relationship: Relationship) {
        this.currentRelationship = relationship;
        this.relationshipSubject.next(relationship);
    }
    
    conditionallyEmitRelationship() {
        if(this.currentRelationship) {
            this.relationshipSubject.next(this.currentRelationship);
        }
    }

    subjectComplete() {
        this.relationshipSubject.complete();
    }



}