import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Relationship } from "../../../relationships/relationship.model";
import { DateService } from "./date.service";
import { DateObj } from "./dateObj.model";

@Component({
    selector: 'app-date-input',
    templateUrl: './date-input.component.html',
    styleUrls: ['./date-input.component.css']
})
export class DateInputComponent implements OnInit {
    dateForm: FormGroup;
    @Input() relationship: Relationship;

    //Inject services
    constructor(private dateService: DateService) {}


    //Initialize form controls
    title = new FormControl(null, Validators.required);
    location = new FormControl(null, Validators.required);
    hour = new FormControl(null, [Validators.required,
        Validators.pattern('^(2[0-3]|[01]?[0-9])$')]);
    minute = new FormControl(null, [Validators.required,
        Validators.pattern('^([012345]?[0-9])$')]);
    //datepicker = new FormControl(null, Validators.required);

    ngOnInit() {
        //Initialize form group
        this.dateForm = new FormGroup({
            title: new FormControl(null, Validators.required),
            location: new FormControl(null, Validators.required),
            hour: new FormControl(null, [Validators.required,
                Validators.pattern('^(2[0-3]|[01]?[0-9])$')]),
            minute: new FormControl(null, [Validators.required,
                Validators.pattern('^([012345]?[0-9])$')]),
            datepicker: new FormControl(null, Validators.required)

        })
    }

    onSubmit() {
        //Call Date Service to add new date to database
        var date = new DateObj(
            this.title.value,
            this.location.value,
            this.hour.value,
            this.minute.value,
            new Date(),
            this.relationship.relationshipId
        );
        this.dateService.saveDate(date)
            .subscribe((response: any) => {
                console.log(response.json());
            })

    }

    getTitleErrorMessage() {
        return this.title.hasError('required') ? 'You must enter a title' :
                '';
    }

    getLocationErrorMessage() {
        return this.location.hasError('required') ? 'You must enter a location' :
                '';
    }

    getHourErrorMessage() {
        return this.hour.hasError('required') ? 'You must enter an hour' :
        this.hour.hasError('pattern') ? 'Not a valid hour' :
            '';
    }

    getMinuteErrorMessage() {
        return this.minute.hasError('required') ? 'You must enter a minute' :
        this.minute.hasError('pattern') ? 'Not a valid minute' :
            '';
    }


    // getDatepickerErrorMessage() {
    //     return this.datepicker.hasError('required') ? 
    //         'You must pick a valid date' :
    //         '';
    // }    

    isDateValid() {
        return this.title.valid &&
            this.location.valid &&
            this.hour.valid &&
            this.minute.valid 
            //&&
            //this.datepicker.valid;
        //return (this.dateForm.valid && )
    }

}