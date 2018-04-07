import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RelationshipService } from '../relationships/relationship.service';
import { Relationship } from '../relationships/relationship.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html'
})
export class CreateComponent implements OnInit{
    createForm: FormGroup;

    //Inject the relationship service & router
    constructor(private relationshipService: RelationshipService, private router: Router) {}


    /**
     * Create new form on initialization
     * 
     * @memberof CreateComponent
     */
    ngOnInit() {
        this.createForm = new FormGroup({
            name: new FormControl(null, Validators.required)
        })
    }

    /**
     * When submitted, this form will attempt to use the RelationshipService to add a new
     * relationship to the database
     * 
     * @memberof CreateComponent
     */
    onSubmit(){
        //When form submitted, create a new relationship and add it to the database
        var relationship = new Relationship(this.createForm.value.name);

        this.relationshipService.addRelationship(relationship)
            .subscribe(
                data => this.router.navigate(['dashboard']),
                error => console.error(error)
            )
        
        this.createForm.reset();
    }


}