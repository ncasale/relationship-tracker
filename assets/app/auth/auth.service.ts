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
        return this.http.post('http://52.91.114.12:80/auth', body, {headers: headers})
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
        return this.http.post('http://52.91.114.12:80/auth/login', body, {headers:headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json())
            });
    }

    loginWithToken() {
        //Create body
        const body = {};
        //Create headers
        const headers = new Headers({'Content-Type':'application/json'});
        //Get token
        const token = this.getToken();
        //Create request
        return this.http.post('http://52.91.114.12:80/auth/loginwithtoken' + token, body, {headers:headers})
            .map((response: Response) => {
                return response.json();
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            })
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
        const token = this.getToken();
        //Create request
        return this.http.post('http://52.91.114.12:80/auth/getuser/' + userId + token, body, {headers:headers})
            .map((response: Response) => {
                var returnedUser = response.json().obj;
                var user = new User(
                    undefined,
                    undefined,
                    returnedUser.firstname,
                    returnedUser.lastname,
                    undefined,
                    returnedUser.createTimestamp
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
        const token = this.getToken();
        //Create request
        return this.http.post('http://52.91.114.12:80/auth/getuserinvites/' + token, body, {headers:headers})
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
     * Allow a user to change their password
     * 
     * @param {string} oldPassword the user's old password
     * @param {string} newPassword the user's new password
     * @returns true or false if password change was successful
     * @memberof AuthService
     */
    changePassword(oldPassword: string, newPassword: string) {
        //Create body
        const body = {
            oldPassword: oldPassword,
            newPassword: newPassword
        };
        //Create headers
        const headers = new Headers({'Content-Type':'application/json'});
        //Get token
        const token = this.getToken();
        //Create request
        return this.http.patch('http://52.91.114.12:80/auth/changepassword' + token, body, {headers:headers})
            .map((response: Response) => {
                return response.json().obj;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            })
    }

    /**
     * Checks if a user is an admin user
     * 
     * @returns true if admin, false otherwise
     * @memberof AuthService
     */
    isUserAdmin() {
        //Create body
        const body = {};
        //Create headers
        const headers = new Headers({'Content-Type':'application/json'});
        //Get token
        const token = this.getToken();
        //Create request
        return this.http.post('http://52.91.114.12:80/auth/checkadmin' + token, body, {headers:headers})
            .map((response: Response) => {
                return response.json().isAdmin;
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

    /**
     * Returns the local storage token if it exists
     * 
     * @returns string - local storage token
     * @memberof RelationshipService
     */
    getToken() {
        return localStorage.getItem('token') ?
            '?token=' + localStorage.getItem('token') :
            '';
    }
}