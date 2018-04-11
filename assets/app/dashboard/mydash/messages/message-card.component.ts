import { Component, Input } from "@angular/core";
import { Message } from "./message.model";
import { MessagesService } from "./messages.service";


@Component({
    selector: 'app-message-card',
    templateUrl: './message-card.component.html'
})
export class MessageCardComponent {
    //The message to display
    @Input() message: Message;

    //Inject services
    constructor(private messagesService: MessagesService) {}

    editMessage() {
        console.log('Editting Message...');
        this.message.text = "Edited message...";
        this.messagesService.editMessage(this.message);
    }

    deleteMessage() {
        console.log('Deleting Message...');
    }
}