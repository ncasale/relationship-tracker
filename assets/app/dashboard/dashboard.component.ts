import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { ResizeService } from "./resize.service";

import { Subscription } from "rxjs/Subscription";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
    //Subscription to resize events
    resizeSubscription: Subscription;
    
    //Toolbar expansion
    isToolbarExpanded = true;
    toolbarCollapseWidth = 900;
    
    constructor(
        private authService: AuthService,
        private resizeService: ResizeService
    ) {}

    ngOnInit() {
        //Collapse toolbar if screen too small
        if(window.innerWidth < this.toolbarCollapseWidth) {
            this.isToolbarExpanded = false;
        }
        //Subscribe to resize events
        this.resizeSubscription = this.resizeService.onResize$.subscribe(
            size => {
                if(size.innerWidth <= this.toolbarCollapseWidth) {
                    this.isToolbarExpanded = false;
                } else {
                    this.isToolbarExpanded = true;
                }
            }
        )

    }

    ngOnDestroy() {

    }
    
}