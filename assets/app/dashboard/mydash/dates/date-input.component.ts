import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
    selector: 'app-date-input',
    templateUrl: './date-input.component.html',
    styleUrls: ['./date-input.component.css']
})
export class DateInputComponent implements OnInit {
    title = new FormControl(null, Validators.required);
    location = new FormControl(null, Validators.required);
    hour = new FormControl(null, [Validators.required,
        Validators.pattern('^(2[0-3]|[01]?[0-9])$')]);
    minute = new FormControl(null, [Validators.required,
        Validators.pattern('^([012345]?[0-9])$')]);

    ngOnInit() {
    }

    onSubmit() {

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

    isDateValid() {
        return true;
        //return (this.dateForm.valid && )
    }

}