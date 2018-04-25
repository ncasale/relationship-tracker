import { Component } from "@angular/core";
import { AuthService } from "../../auth/auth.service";
import { MyDashService } from "../mydash/mydash.service";

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.css']
})
export class LogoutComponent{

    constructor(
        private authService: AuthService,
        private myDashService: MyDashService
    ) {}

    /**
     * Call Auth Service to logout current user
     * 
     * @memberof LogoutComponent
     */
    logout() {
        this.myDashService.setCurrentRelationship(null);
        this.myDashService.subjectComplete();
        this.authService.logout();
    }

}