import { Component, Input } from "@angular/core";
import { Message } from "./message.model";


@Component({
    selector: 'app-message-card',
    templateUrl: './message-card.component.html'
})
export class MessageCardComponent {
    //The message to display
    @Input() message: Message;

    editMessage() {
        console.log('Editting Message...');
    }

    deleteMessage() {
        console.log('Deleting Message...');
    }
}