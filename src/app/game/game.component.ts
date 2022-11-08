import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { collection, doc, setDoc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  pickCardAnimation: boolean = false;
  game: Game;
  currentCard: string = '';

  constructor(public dialog: MatDialog, private firestore: AngularFirestore, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      console.log(params['id']);

      this
        .firestore
        .collection('games')
        .doc(params['id'])
        .valueChanges()
        .subscribe((game: any) => {
          console.log('Updated Game', game);
          this.game.players = game.players;
          this.game.stack = game.stack;
          this.game.currentPlayer = game.currentPlayer;
          this.game.playedCards = game.playedCards
        });

    })


  }

  newGame() {
    this.game = new Game();
    // this.firestore
    //   .collection('games')
    //   .add({'game': this.game.toJson()})
  }

  pickCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      this.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      setTimeout(() => {
        this.pickCardAnimation = false;
        this.game.playedCards.push(this.currentCard)
      }, 1500);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent, {
    });
    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0)
        this.game.players.push(name);
    });
  }
}
