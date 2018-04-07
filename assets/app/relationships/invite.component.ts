import { Component, OnInit, Input } from "@angular/core";
import { RelationshipService } from "./relationship.service";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { Relationship } from "./relationship.model";
import { Router } from "@angular/router";

@Component({
    selector: 'app-relationship-invite',
    templateUrl: './invite.component.html',
    styles: [`
    .backdrop {
                background-color: rgba(0,0,0,0.6);
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100vh;
            }
        `]
})
export class InviteComponent implements OnInit{
    //Visibility of component
    display = 'none'

    relationship: Relationship;

    //Form for inviting
    inviteForm: FormGroup;

    //Inject services
    constructor(private relationshipService: RelationshipService, private router: Router) {}

    /**
     * Toggle visibility when inviteToRelationship signal received, initialize form
     * 
     * @memberof InviteComponent
     */
    ngOnInit() {
        //Initialize form
        this.inviteForm = new FormGroup({            
            email: new FormControl(null,
                [
                    Validators.required,
                    Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
                ])            
        })

        //Subscribe to visibility signal
        this.relationshipService.toggleInviteComponent.subscribe(
            (response: any) => this.toggleVisibility()
        )

        //Subscribe to relationship set signal
        this.relationshipService.setInviteRelationshipEmitter.subscribe(
            (response: Relationship) => this.relationship = response
        )
    }

    /**
     * Toggle visibility of invite component
     * 
     * @memberof InviteComponent
     */
    toggleVisibility() {
        if(this.display === 'none') {
            this.display = 'block';
        }
        else if(this.display === 'block') {
            this.display = 'none';
            this.inviteForm.reset();
        }
    }

    /**
     * Closes invite component and resets its form
     * 
     * @memberof InviteComponent
     */
    closeInvite() {
        console.log('Closing invite');
        this.display = 'none';
        this.inviteForm.reset();
    }

    onSubmit() {
        this.relationshipService.inviteToRelationship(this.relationship, this.inviteForm.value.email)
        .subscribe(
            data => this.router.navigateByUrl('/dashboard/mydash'), //Change this to some confirmation page
            error => console.error(error)
        );
        this.closeInvite();
    }

}