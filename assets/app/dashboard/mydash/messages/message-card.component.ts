import { Component, Input, OnInit } from "@angular/core";
import { Message } from "./message.model";
import { MessagesService } from "./messages.service";
import { DatePipe } from "@angular/common";


@Component({
    selector: 'app-message-card',
    templateUrl: './message-card.component.html',
    styleUrls: ['./message-card.component.css']
})
export class MessageCardComponent implements OnInit{
    //The message to display
    @Input() message: Message;

    //The timestamp of the message
    timestamp: string;
    timestampFormat: string = 'MM/dd/yyyy HH:mm a';

    //Inject services
    constructor(private messagesService: MessagesService, private datePipe: DatePipe) {}

    /**
     * Initialize timestamp when message component created
     * 
     * @memberof MessageCardComponent
     */
    ngOnInit() {
        if(this.message) {
            this.timestamp = this.datePipe.transform(this.message.createTimestamp, this.timestampFormat);
        }
    }

    /**
     * Edit a message
     * 
     * @memberof MessageCardComponent
     */
    editMessage() {
        console.log('Editing Message...');
        this.message.text = "Edited Message...";
        this.messagesService.editMessage(this.message)
            .subscribe(
                (response: Message) => {
                    //Set message
                    this.message = response;
                    //Set timestamp
                    this.timestamp = this.datePipe.transform(this.message.createTimestamp, this.timestampFormat);
                }
            );
    }

    /**
     * Delete a message
     * 
     * @memberof MessageCardComponent
     */
    deleteMessage() {
        console.log('Deleting Message...');
        this.messagesService.deleteMessage(this.message.messageId)
            .subscribe(
                (response: any) => {
                    console.log('Message deleted...');
                }
            )
            
    }

    /**
     * Check if a user is the owner of a message
     * 
     * @returns true if user is the owner of message, false otherwise
     * @memberof MessageCardComponent
     */
    messageBelongsToUser() {
        return localStorage.getItem('userId') == this.message.userId
    }
}