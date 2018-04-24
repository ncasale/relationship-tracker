import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material";

@Component({
    selector: 'app-delete-item-dialog',
    templateUrl: './delete-item-dialog.component.html',
    styleUrls: ['./delete-item-dialog.component.css']
})
export class DeleteItemDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<DeleteItemDialogComponent>
    ) {}

}