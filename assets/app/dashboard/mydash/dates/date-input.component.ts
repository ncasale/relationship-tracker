import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
    selector: 'app-date-input',
    templateUrl: './date-input.component.html'
})
export class DateInputComponent implements OnInit {
    dateForm: FormGroup;

    ngOnInit() {
        //Initialize form group
        this.dateForm = new FormGroup({
           title: new FormControl(null, Validators.required),
           location: new FormControl(null, Validators.required)            
        })
    }

    onSubmit() {

    }

}