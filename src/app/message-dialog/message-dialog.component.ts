import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
})
export class MessageDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string}) {}

}
