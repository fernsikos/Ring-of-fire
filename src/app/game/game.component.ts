import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';



@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  pickCardAnimation: boolean = false;
  game: Game;
  currentCard: string = '';

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.newGame()
  }

  newGame() {
    this.game = new Game();
  }

  pickCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      this.pickCardAnimation = true;
      setTimeout(() => {
        this.pickCardAnimation = false;
        this.game.playedCards.push(this.currentCard)
      }, 1500);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
