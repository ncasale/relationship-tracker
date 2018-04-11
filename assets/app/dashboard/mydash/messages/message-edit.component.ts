import { Component } from "@angular/core";

@Component({
    selector: 'app-message-edit',
    templateUrl: './message-edit.component.html',
    styles: [`
    .backdrop {
                background-color: rgba(0,0,0,0.6);
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100vh;
            }
        `]
})
export class MessageEditComponent{
    display = 'none';

    /**
     * Change visibility of edit modal
     * 
     * @memberof MessageEditComponent
     */
    toggleVisibility() {
        if(this.display == 'none') {
            this.display = 'block';
        }
        else if(this.display === 'block') {
            this.display = 'none';
        }
    }
    
}