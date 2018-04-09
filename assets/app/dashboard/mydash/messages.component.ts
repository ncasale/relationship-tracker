import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html'
})
export class MessagesComponent implements OnInit{
    messagesForm: FormGroup;

    /**
     * Initialize form group
     * 
     * @memberof MessagesComponent
     */
    ngOnInit() {
        //Initialize form group
        this.messagesForm = new FormGroup({
            message: new FormControl(null, Validators.required)
        })
    }

    /**
     * Contact MessageService to send off message
     * 
     * @memberof MessagesComponent
     */
    onSubmit() {
        console.log(this.messagesForm.value.message);
        this.messagesForm.reset();
    }

}