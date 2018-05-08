import { Component, OnInit, OnDestroy } from "@angular/core";
import { Relationship } from "../../relationships/relationship.model";
import { RelationshipService } from "../../relationships/relationship.service";
import { MessagesService } from "./messages/messages.service";
import { MyDashService } from "./mydash.service";

import { Subscription } from "rxjs/Subscription";
import { Router } from "@angular/router";
import { ResizeService } from "../resize.service";

@Component({
    selector: 'app-mydash',
    templateUrl: './mydash.component.html',
    styleUrls: ['./mydash.component.css']
})
export class MyDashComponent implements OnInit, OnDestroy{
    selectedRelationship: Relationship = new Relationship("");
    relationships: Relationship[] = [];
    relationshipSubscription: Subscription;
    resizeSubscription: Subscription;
    noRelationships = false;

    //Is the sidenav expanded
    isSidenavExpanded = true;
    collapseWidth = 900;

    //Flags for side nav tabs
    relationshipSelected = false;
    messagesSelected = false;
    datesSelected = false;
    choresSelected = false;
    gratitudesSelected = false;
    fightsSelected = false;
    settingsSelected = false;
    lastSelectedTab = '';

    constructor(
        private relationshipService: RelationshipService, 
        private messageService: MessagesService,
        private myDashService: MyDashService,
        private resizeService: ResizeService,
        private router: Router
    ) {}

    /**
     * On init, contact RelationshipService to get a list of relationships
     * 
     * @memberof MyDashComponent
     */
    ngOnInit() {
        //Workaround to redirect to home if we accidentally get here without logging in
        if(!localStorage.getItem('token')) {
            this.router.navigateByUrl('/auth/login');
        }  else {
            //Get user relationships
            this.refreshRelationships();
    
        
            //Update relationships if necessary
            this.myDashService.updateMyDashRelationships.subscribe(
                (response: any) => {
                    this.refreshRelationships();
                }
            )

            //Make initial changes based on screen size
            if(window.innerWidth <= this.collapseWidth) {
                this.isSidenavExpanded = false;
            }

            //Be aware of changes in screen size -- collapse sidenav if necessary
            this.resizeSubscription = this.resizeService.onResize$.subscribe(
                (size => {
                    if(size.outerWidth <= this.collapseWidth) {
                        this.isSidenavExpanded = false;
                    }
                })
            );
        }
            
    }

    ngOnDestroy() {
        if(this.relationshipSubscription) {
            this.relationshipSubscription.unsubscribe();
        }

        if(this.resizeSubscription) {
            this.resizeSubscription.unsubscribe();
        }
    }

    /**
     * Set the currently selected relationship in MyDash
     * 
     * @param {Relationship} relationship 
     * @memberof MyDashComponent
     */
    setCurrentRelationship(relationship: Relationship) {
        //Set selected relationship in my dash
        this.selectedRelationship = relationship;
        //this.myDashService.setCurrentRelationship(relationship);
        
        //Allow relationship service to invite to this relationship
        this.relationshipService.setInviteRelationship(this.selectedRelationship);
        //Emit signal to update relationship in message service
        //this.messageService.currentMyDashRelationshipEmitter.emit(this.selectedRelationship);
    }

    sideNavClicked(relationship: Relationship) {
        this.selectedRelationship = relationship;
        this.myDashService.setCurrentRelationship(this.selectedRelationship);
        this.sideNavSelect(this.lastSelectedTab);
    }

    

    /**
     * Called whenever a nav-pill tab is clicked
     * 
     * @memberof MyDashComponent
     */
    tabClicked() {
        this.myDashService.setCurrentRelationship(this.selectedRelationship);
    }

    

    /**
     * Checks if the passed relationship is the currently selected relationship on the dashboard
     * 
     * @param {Relationship} relationship The relationship to compare to the selected relationship
     * @returns true if relationships are the same, false otherwise
     * @memberof MyDashComponent
     */
    isCurrentRelationship(relationship: Relationship) {
        return relationship == this.selectedRelationship;
    }

    /**
     * Navigate to create relationship page
     * 
     * @memberof MyDashComponent
     */
    navigateToCreateRelationship() {
        this.router.navigateByUrl('/dashboard/create');
    }

    /**
     * Returns whether or not this user is in any relationships
     * 
     * @returns true if user is a member of a relationship, false otherwise
     * @memberof MyDashComponent
     */
    userNotInRelationship() {
        return this.relationships.length == 0;
    }

    /**
     * Checks if user is on base mydash route
     * 
     * @returns true if on base mydash route, false otherwise
     * @memberof MyDashComponent
     */
    onMyDashHome() {
        return this.router.url == '/dashboard/mydash';
    }

    /**
     * Refreshes and sorts the list of relationships in which the user is a member
     * 
     * @memberof MyDashComponent
     */
    refreshRelationships() {
        this.relationshipService.getRelationships()
            .subscribe(
                (relationships: Relationship[]) => {
                    this.relationships = relationships;
                    //Set selected relationship to first in relationship list, if it exists
                    if(this.relationships.length > 0) {
                        //Sort Relationships
                        this.relationships.sort(function(r1, r2) {
                            if(r1.createTimestamp < r2.createTimestamp) {
                                return -1;
                            } else if (r1.createTimestamp > r2.createTimestamp){
                                return 1;
                            } else {
                                return 0;
                            }
                        })
                        this.router.navigateByUrl('/dashboard/mydash/messages');
                        this.selectedRelationship = this.relationships[0];
                        this.myDashService.setCurrentRelationship(this.selectedRelationship);
                        this.noRelationships = false;
                    }
                    else {
                        this.noRelationships = true;
                    }
                }
            )
    }

    //
    sideNavSelect(tabName: string) {
        //Reset all tabs
        this.relationshipSelected = false;
        this.messagesSelected = false;
        this.choresSelected = false;
        this.datesSelected = false;
        this.gratitudesSelected = false;
        this.fightsSelected = false;
        this.settingsSelected = false;

        if(tabName != 'relationship') {
            this.lastSelectedTab = tabName;
        }

        //Select correct tab according to tab name
        switch(tabName) {
            case 'relationship': {
                this.relationshipSelected = true;
                break;
            }
            case 'messages': {
                this.messagesSelected = true;
                break;
            }
            case 'chores': {
                this.choresSelected = true;
                break;
            }
            case 'dates': {
                this.datesSelected = true;
                break;
            }
            case 'gratitudes': {
                this.gratitudesSelected = true;
                break;
            }
            case 'fights': {
                this.fightsSelected = true;
                break;
            }
            case 'settings': {
                this.settingsSelected = true;
                break;
            }
            default: {
                this.messagesSelected = true;
                break;
            }

        }
    }

    toggleSideNav() {
        this.isSidenavExpanded = !this.isSidenavExpanded;
    }
}