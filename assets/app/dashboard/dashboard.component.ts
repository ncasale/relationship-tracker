import { Component } from "@angular/core";
import { AuthService } from "../auth/auth.service";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
    constructor(private authService: AuthService) {}
    
    /**
     * Call Auth Service to logout current user
     * 
     * @memberof DashboardComponent
     */
    logout() {
        this.authService.logout();
    }

}