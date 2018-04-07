import { Component } from "@angular/core";

@Component({
    selector: 'app-auth',
    template: `
        <header class="row spacing">
            <nav class="col-md-8 col-md-offset-2">
                <ul class="nav nav-tabs">
                    <li routerLinkActive="active"><a [routerLink]="['signup']">Sign Up</a></li>
                    <li routerLinkActive="active"><a [routerLink]="['login']">Sign In</a></li>
                </ul>
            </nav>
        </header>
        <br>
        <div class="row spacing">
           <router-outlet></router-outlet>
        </div>
    `
})
export class AuthComponent {

}