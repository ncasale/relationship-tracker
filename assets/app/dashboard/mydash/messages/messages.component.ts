import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MessagesService } from "./messages.service";
import { Message } from "./message.model";
import { Relationship } from "../../../relationships/relationship.model";
import { RelationshipService } from "../../../relationships/relationship.service";

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html'
})
export class MessagesComponent implements OnInit{
    messagesForm: FormGroup;
    relationship: Relationship;
    messages: Message[] = [];

    constructor(private messagesService: MessagesService, private relationshipService: RelationshipService) {}

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
                this.relationshipService.getRelationshipMessages(this.relationship.relationshipId)
                    .subscribe(
                        (response: Message[]) => {
                            console.log('Messages within messages component: ', response);
                            this.messages = response;
                        }
                    )
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