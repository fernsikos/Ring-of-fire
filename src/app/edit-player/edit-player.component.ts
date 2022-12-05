import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import { VarServiceService } from '../var-service.service';


@Component({
  selector: 'app-edit-player',
  templateUrl: './edit-player.component.html',
  styleUrls: ['./edit-player.component.scss']
})
export class EditPlayerComponent implements OnInit {

  public playerName: string = "";

  constructor(public dialogRef: MatDialogRef<EditPlayerComponent>, private varservice: VarServiceService) {
    this.playerName = this.varservice.playerName;
  }


  ngOnInit(): void {
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
