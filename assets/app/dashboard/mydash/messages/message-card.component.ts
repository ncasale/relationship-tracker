import { Component, Input, OnInit } from "@angular/core";
import { Message } from "./message.model";
import { MessagesService } from "./messages.service";
import { DatePipe } from "@angular/common";
import { MatDialog } from "@angular/material";
import { MessageEditComponent } from "./message-edit.component";
import { AuthService } from "../../../auth/auth.service";
import { User } from "../../../auth/user.model";
import { DeleteItemDialogComponent } from "../common/delete-item-dialog.component";
import { MyDashService } from "../mydash.service";


@Component({
    selector: 'app-message-card',
    templateUrl: './message-card.component.html',
    styleUrls: ['./message-card.component.css']
})
export class MessageCardComponent implements OnInit{
    //The message to display
    @Input() message: Message;
    firstname: string;
    lastname: string;

    //The timestamp of the message
    timestamp: string;
    timestampFormat: string = 'MM/dd/yyyy HH:mm a';

    //Inject services
    constructor(
        private messagesService: MessagesService,
        private authService: AuthService,
        private datePipe: DatePipe, 
        public editDialog: MatDialog,
        public deleteDialog: MatDialog,
        private myDashService: MyDashService
    ) {}

    /**
     * Initialize timestamp when message component created
     * 
     * @memberof MessageCardComponent
     */
    ngOnInit() {
        if(this.message) {
            this.setTimestamp();
        }
        //Get the first and last name of the user who created message
        this.authService.getUser(this.message.userId)
            .subscribe(
                (user: User) => {
                    //Set first and last name
                    this.firstname = user.firstname;
                    this.lastname = user.lastname;
                }
            )

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
     * Delete a message
     * 
     * @memberof MessageCardComponent
     */
    deleteMessage() {
        const dialogRef = this.deleteDialog.open(DeleteItemDialogComponent, {
            width: '500px'
        })

        dialogRef.afterClosed().subscribe(
            result => {
                if(result) {
                    this.messagesService.deleteMessage(this.message.messageId)
                        .subscribe(
                            (response: any) => {
                                //Send signal to delete message from MessagesComponent
                                this.messagesService.messageDeletedEmitter.emit(this.message);
                                //this.myDashService.openSnackBar('Message Deleted.', 'close');
                            }
                        );
                }
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

    isMyMessage() {
        return this.message.userId == localStorage.getItem('userId');
    }
}