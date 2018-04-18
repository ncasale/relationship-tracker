import { EventEmitter, Injectable } from "@angular/core";
import { Error } from "./error.model";
import { Router } from "@angular/router";

@Injectable()
export class ErrorService {
    //Create a new emitter that will signal when we have caught an error
    errorOccurred = new EventEmitter<Error>();

    //Inject services
    constructor(private router: Router) {}

    /**
     * handleError will parse any passed error and emit a signal with the error's title/content
     * 
     * @param error the error to pass to this handler
     */
    handleError(error: any) {
        const errorData = new Error(error.title, error.error.message);
        //handle jwt
        if(errorData.message.includes("jwt")) {
            this.router.navigateByUrl('/auth/login');
        } else {
            this.errorOccurred.emit(errorData);
        }
    }
}