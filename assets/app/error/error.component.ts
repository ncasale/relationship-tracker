import { Component, OnInit } from "@angular/core";
import { Error } from "./error.model";
import { ErrorService } from "./error.service";

/**
 * Responsible for representing error messages in the application
 * 
 * @export
 * @class ErrorComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
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
export class ErrorComponent implements OnInit {

    //The error to display
    error: Error;
    //The current display setting of the modal (none = invisible, block = visible)
    display = 'none';

    //Inject ErrorService
    constructor(private errorService: ErrorService) {}

    /**
     * Called after we handle a thrown error. This hides the error modal we created.
     */
    onErrorHandled() {
        this.display = 'none';
    }

    /**
     * On init, subscribe to errorOccurred emitter which fires whenever our app encounters an error
     * 
     * @memberof ErrorComponent
     */
    ngOnInit() {
        this.errorService.errorOccurred.subscribe(
            (error: Error) => {
                this.error = error;
                this.display = 'block';
            }
        )
        
    }

}