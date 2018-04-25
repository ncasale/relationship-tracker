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
     * Return a user from the database with the passed userId
     * 
     * @param {string} userId ID of user to return 
     * @returns JSON representation of user
     * @memberof AuthService
     */
    getUser(userId: string) {
        //Create a body
        const body = {};
        //Create headers
        const headers = new Headers({'Content-Type':'application/json'});
        //Get token
        const token = localStorage.getItem('token') ?
            '?token=' + localStorage.getItem('token') :
            '';
        //Create request
        return this.http.post('http://localhost:3000/auth/getuser/' + userId + token, body, {headers:headers})
            .map((response: Response) => {
                var returnedUser = response.json().obj;
                var user = new User(
                    undefined,
                    undefined,
                    returnedUser.firstname,
                    returnedUser.lastname
                )
                return user;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            })
    }

    /**
     * Gets an array of relationship Ids representing the relationships to which this user is 
     * invited.
     * 
     * @returns an array of strings -- the relationship ids of invited relationships 
     * @memberof AuthService
     */
    getUserInvites() {
        //Create body
        const body = {};
        //Create headers
        const headers = new Headers({'Content-Type':'application/json'});
        //Get token
        const token = localStorage.getItem('token') ?
            '?token=' + localStorage.getItem('token') :
            '';
        //Create request
        return this.http.post('http://localhost:3000/auth/getuserinvites/' + token, body, {headers:headers})
            .map((response: Response) => {
                //We are returned an array of ids
                return response.json().obj;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            })
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