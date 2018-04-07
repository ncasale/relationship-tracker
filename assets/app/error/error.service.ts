import { EventEmitter } from "@angular/core";
import { Error } from "./error.model";

export class ErrorService {
    //Create a new emitter that will signal when we have caught an error
    errorOccurred = new EventEmitter<Error>();

    /**
     * handleError will parse any passed error and emit a signal with the error's title/content
     * 
     * @param error the error to pass to this handler
     */
    handleError(error: any) {
        const errorData = new Error(error.title, error.error.message);
        this.errorOccurred.emit(errorData);
    }
}