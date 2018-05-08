import { Component, OnInit, ChangeDetectorRef, OnChanges, SimpleChanges, ChangeDetectionStrategy, OnDestroy, AfterViewChecked, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MessagesService } from "./messages.service";
import { Message } from "./message.model";
import { Relationship } from "../../../relationships/relationship.model";
import { RelationshipService } from "../../../relationships/relationship.service";
import { MyDashService } from "../mydash.service";
import { Subscription } from "rxjs/Subscription";

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.css',
        './messages.component.queries.css'
    ]
})
export class MessagesComponent implements OnInit, OnDestroy, AfterViewChecked{
    messageFC = new FormControl(null, Validators.required);
    relationship: Relationship;
    messages: Message[] = [];
    currentRelationshipSubscription: Subscription;

    //Scroll container for messages
    @ViewChild('scrollArea') private scrollContainer: ElementRef;
    

    constructor(
        private messagesService: MessagesService, 
        private relationshipService: RelationshipService,
        private myDashService: MyDashService
    ) {}

    /**
     * Initialize form group
     * 
     * @memberof MessagesComponent
     */
    ngOnInit() {
        //When current relationship in mydash updated, update the current relationship of messages
        this.currentRelationshipSubscription = this.myDashService.getCurrentRelationship()
            .subscribe(relationship => {
                this.relationship = relationship;
                this.messagesService.getMessages(relationship.relationshipId)
                    .subscribe(
                        (response: Message[]) => {
                            this.messages = response;
                            this.scrollToBottom();
                        }
                    )
                
            });

        //Have observable emit relatinship if it exists
        this.myDashService.conditionallyEmitRelationship();
        
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

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    ngOnDestroy() {
        this.currentRelationshipSubscription.unsubscribe();
    }


    
    /**
     * Contact MessageService to send off message
     * 
     * @memberof MessagesComponent
     */
    onSubmit() {
        var message = new Message(
            this.messageFC.value, 
            this.relationship.relationshipId);
        this.messagesService.saveMessage(message)
        .subscribe(
            (message: Message) => {
                //Update frontend messages array
                this.myDashService.openSnackBar('Message Created.', 'close');
                this.messages.push(message);
            }
        );
        this.messageFC.reset();
    }

    scrollToBottom() {
        try {
            this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
        } catch(err) {};
    }
}