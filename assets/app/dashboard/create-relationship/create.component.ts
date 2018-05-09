import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RelationshipService } from '../../relationships/relationship.service';
import { Relationship } from '../../relationships/relationship.model';
import { Router } from '@angular/router';
import { MyDashService } from '../mydash/mydash.service';

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit{
    nameFC = new FormControl(null, Validators.required);
    platonicFC = new FormControl(null);

    //Inject the relationship service & router
    constructor(
        private relationshipService: RelationshipService, 
        private router: Router,
        private myDashService: MyDashService
    ) {}

    /**
     * Create new form on initialization
     * 
     * @memberof CreateComponent
     */
    ngOnInit() {
    }

    /**
     * When submitted, this form will attempt to use the RelationshipService to add a new
     * relationship to the database
     * 
     * @memberof CreateComponent
     */
    onSubmit(){
        //When form submitted, create a new relationship and add it to the database
        var relationship = new Relationship(this.nameFC.value, 
                undefined, 
                undefined, 
                undefined, 
                undefined,
                this.platonicFC.value);

        console.log('On Submit REL: ', relationship);

        this.relationshipService.addRelationship(relationship)
            .subscribe(
                data => {
                    this.myDashService.openSnackBar('Relationship Created.', 'close');
                    this.router.navigateByUrl('/dashboard/mydash');
                },
                error => console.error(error)
            )
        
        this.nameFC.reset();
    }

    getNameErrorMessage() {
        return this.nameFC.hasError('required') ? 'You must enter a relationship name' : '';
    }

    isCreateValid() {
        return this.nameFC.valid;
    }
}