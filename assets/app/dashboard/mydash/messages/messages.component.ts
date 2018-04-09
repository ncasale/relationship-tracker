import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MessagesService } from "./messages.service";
import { Message } from "./message.model";
import { Relationship } from "../../../relationships/relationship.model";

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html'
})
export class MessagesComponent implements OnInit{
    messagesForm: FormGroup;
    relationship: Relationship;

    constructor(private messagesService: MessagesService) {}

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

        //When current relationship in mydash updated, update the current relationship of messages
        this.messagesService.currentMyDashRelationshipEmitter.subscribe(
            (response: Relationship) => {
                this.relationship = response;
            }
        )
        
    }

    /**
     * Contact MessageService to send off message
     * 
     * @memberof MessagesComponent
     */
    onSubmit() {
        console.log(this.messagesForm.value.message);
        var message = new Message(this.messagesForm.value.message, this.relationship.relationshipId);
        console.log('Saving message', message);
        this.messagesService.saveMessage(message).subscribe(
            (response: any) => console.log('Returned from post request')
        );
        this.messagesForm.reset();
    }

}