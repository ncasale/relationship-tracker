import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import "rxjs/Rx";
import { Observable } from "rxjs";
import { User } from "./user.model";
import { ErrorService } from "../error/error.service";
import { Router } from "@angular/router";

@Injectable()
export class AuthService {
    //Inject services
    constructor(private http: Http, private errorService: ErrorService, private router: Router) {}

    /**
     * Saves a user to the database
     * 
     * @param {User} user the user to save
     * @returns 
     * @memberof AuthService
     */
    saveUser(user: User) {
        //Create a body
        const body = JSON.stringify(user);
        //Create headers to signify json request
        const headers = new Headers({'Content-Type': 'application/json'});
        //Hit post route, and transform response into json, or throw an error if one occurs
        return this.http.post('http://localhost:3000/auth', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json())
            })

            ;
    }

    /**
     * Checks if a user exists and logs them in
     * 
     * @param {User} user the user to login
     * @returns 
     * @memberof AuthService
     */
    loginUser(user: User) {
        //Create a body for our post
        const body = JSON.stringify(user);
        //Create headers for post
        const headers = new Headers({'Content-Type': 'application/json'});
        //Post to signin route
        return this.http.post('http://localhost:3000/auth/login', body, {headers:headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json())
            });
    }

    /**
     * Clears local storage and navigates to home -- effectively logging user out
     * 
     * @memberof AuthService
     */
    logout() {
        localStorage.clear();
        this.router.navigateByUrl('/');    
    }
}