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
        this.message.text = "Edited Message...";
        this.messagesService.editMessage(this.message)
            .subscribe(
                (response: Message) => {
                    console.log(response);
                    this.message = response;
                }
            );
    }

    deleteMessage() {
        console.log('Deleting Message...');
    }
}