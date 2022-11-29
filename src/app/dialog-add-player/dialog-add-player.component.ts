import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import { VarServiceService } from '../var-service.service';


@Component({
  selector: 'app-dialog-add-player',
  templateUrl: './dialog-add-player.component.html',
  styleUrls: ['./dialog-add-player.component.scss']
})
export class DialogAddPlayerComponent implements OnInit {

  name: string = "";

  constructor(public dialogRef: MatDialogRef<DialogAddPlayerComponent>, private varservice: VarServiceService) { 
    varservice.choosedGender = 'male'
    console.log(varservice.choosedGender)
  }

  ngOnInit(): void {
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onItemChange(event:any) {
    this.varservice.choosedGender = event.value;
    console.log(this.varservice.choosedGender)
  }

}
