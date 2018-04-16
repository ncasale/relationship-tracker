import { Component } from "@angular/core";
import { AuthService } from "../../auth/auth.service";

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.css']
})
export class LogoutComponent{

    constructor(private authService: AuthService) {}

    /**
     * Call Auth Service to logout current user
     * 
     * @memberof LogoutComponent
     */
    logout() {
        this.authService.logout();
    }

}