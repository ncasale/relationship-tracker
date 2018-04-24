import { Component, OnInit, Inject } from "@angular/core";
import { MessagesService } from "./messages.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Message } from "./message.model";
import { MyDashService } from "../mydash.service";

@Component({
    selector: 'app-message-edit',
    templateUrl: './message-edit.component.html',
    styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit{
    //Local copy of message
    originalText: string;

    constructor(
        public dialogRef: MatDialogRef<MessageEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private messagesService: MessagesService,
        private myDashService: MyDashService    
    ) {}
    
    ngOnInit() {
        //Set original text for message
        this.originalText = this.data.message.text;
        //Don't allow user to click off of dialog to close
        this.dialogRef.disableClose = true;
    }
    
    /**
     * Wrapper for closeDialog
     * 
     * @memberof MessageEditComponent
     */
    onNoClick(): void {
        this.closeDialog();
    }
    
    /**
     * Pass edited message to Messages Service and close dialog
     * 
     * @memberof MessageEditComponent
     */
    submitEdit() {
        //Save the text in the edit input to the message
        this.messagesService.editMessage(this.data.message)
            .subscribe(
                (response: Message) => {
                    this.myDashService.openSnackBar('Message Edited.', 'close');
                }
            )
        this.dialogRef.close();
    }

    /**
     * Reset message text before closing dialog
     * 
     * @memberof MessageEditComponent
     */
    closeDialog() {
        this.data.message.text = this.originalText;
        this.dialogRef.close()
    }
}