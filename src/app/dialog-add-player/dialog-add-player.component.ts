import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-add-player',
  templateUrl: './dialog-add-player.component.html',
  styleUrls: ['./dialog-add-player.component.scss']
})
export class DialogAddPlayerComponent implements OnInit {

  name: string = "";
  public gender: string;

  constructor(public dialogRef: MatDialogRef<DialogAddPlayerComponent>) { 
    this.gender = 'male';
  }

  ngOnInit(): void {
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onItemChange(event:any) {
    this.gender = event.value;
    console.log(this.gender)
  }

}
