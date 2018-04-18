import { Component, OnInit, ChangeDetectorRef, OnChanges, SimpleChanges, ChangeDetectionStrategy } from "@angular/core";
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
                //Get messages for this relationship from Messages Service
                this.messagesService.getMessages(this.relationship.relationshipId)
                    .subscribe(
                        (response: Message[]) => {
                            this.messages = response;
                        }
                    )
            }
        )
        
        //When a message is deleted, delete it from the messages list
        this.messagesService.messageDeletedEmitter.subscribe(
            (message: Message) => {
                //Find array of message within messages
                var index = this.messages.indexOf(message);
                if(index != -1) {
                    this.messages.splice(index, 1);
                }
            }
        )
    }
    /**
     * Contact MessageService to send off message
     * 
     * @memberof MessagesComponent
     */
    onSubmit() {
        var message = new Message(
            this.messagesForm.value.message, 
            this.relationship.relationshipId);
        this.messagesService.saveMessage(message)
        .subscribe(
            (message: Message) => {
                //Update frontend messages array
                this.messages.push(message);
            }
        );
        this.messagesForm.reset();
    }

}