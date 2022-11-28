import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-restart-dialog',
  templateUrl: './restart-dialog.component.html',
  styleUrls: ['./restart-dialog.component.scss']
})
export class RestartDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RestartDialogComponent>) { }

  ngOnInit(): void {
  }

  restartGame() {
    
  }

}
