import { Component, Input } from "@angular/core";
import { Message } from "./message.model";
import { MessagesService } from "./messages.service";


@Component({
    selector: 'app-message-card',
    templateUrl: './message-card.component.html',
    styleUrls: ['./message-card.component.css']
})
export class MessageCardComponent {
    //The message to display
    @Input() message: Message;

    //Inject services
    constructor(private messagesService: MessagesService) {}

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
                    console.log(response);
                    this.message = response;
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