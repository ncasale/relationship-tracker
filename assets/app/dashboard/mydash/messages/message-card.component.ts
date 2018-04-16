import { Component, Input, OnInit } from "@angular/core";
import { Message } from "./message.model";
import { MessagesService } from "./messages.service";
import { DatePipe } from "@angular/common";
import { MatDialog } from "@angular/material";
import { MessageEditComponent } from "./message-edit.component";


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
    constructor(private messagesService: MessagesService, private datePipe: DatePipe, public editDialog: MatDialog) {}

    /**
     * Initialize timestamp when message component created
     * 
     * @memberof MessageCardComponent
     */
    ngOnInit() {
        if(this.message) {
            this.setTimestamp();
        }
    }

    /**
     * Send signal to open edit modal
     * 
     * @memberof MessageCardComponent
     */
    openEditDialog(): void {
        let dialogRef = this.editDialog.open(MessageEditComponent, {
            width: '500px',
            data: {message: this.message}
        });        
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
                    this.setTimestamp();
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
                    //Send signal to delete message from MessagesComponent
                    console.log('Message deleted...');
                    this.messagesService.messageDeletedEmitter.emit(this.message);
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

    /**
     * Set timestamp of message. If message has been edited, use edit timestamp. Otherwise, use
     * the create timestamp.
     * 
     * @memberof MessageCardComponent
     */
    setTimestamp() {
        //Set timestamp
        if(!this.message.editTimestamp) {
            this.timestamp = this.datePipe.transform(this.message.createTimestamp, this.timestampFormat);
        } else {
            this.timestamp = this.datePipe.transform(this.message.editTimestamp, this.timestampFormat) + ' [edited]';            
        }
    }
}