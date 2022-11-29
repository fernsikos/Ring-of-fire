import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collection, doc, setDoc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { EditPlayerComponent } from '../edit-player/edit-player.component';
import { RestartDialogComponent } from '../restart-dialog/restart-dialog.component';
import { VarServiceService } from '../var-service.service';



@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {


  game: Game;
  currentGameId: string;

  constructor(public dialog: MatDialog, private firestore: AngularFirestore, private route: ActivatedRoute, private varservice: VarServiceService) {

  }

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      this.currentGameId = params['id']
      this
        .firestore
        .collection('games')
        .doc(this.currentGameId)
        .valueChanges()
        .subscribe((game: any) => {
          console.log('Updated Game', game);
          this.game.players = game.players;
          this.game.stack = game.stack;
          this.game.currentPlayer = game.currentPlayer;
          this.game.playedCards = game.playedCards
          this.game.pickCardAnimation = game.pickCardAnimation
          this.game.currentCard = game.currentCard
          console.log('Local Game', this.game);
        });

    })


  }

  editPlayer(playerId: number) {
    console.log('editPlayer' + playerId);
    const dialogRef = this.dialog.open(EditPlayerComponent, {
      data: {
        player: playerId
      }
    });
    dialogRef.afterClosed().subscribe((change: any) => {
      console.log('change:' + change)
      if (change) {
        if (change == 'DELETE') {
          this.game.genders.splice(playerId, 1);
          this.game.players.splice(playerId, 1);
        }
      };
      this.updateGame();
    });
  }

  newGame() {
    this.game = new Game();
  }

  updateGame() {
    this
      .firestore
      .collection('games')
      .doc(this.currentGameId)
      .update(this.game.toJson())
  }

  pickCard() {
    if (!this.game.pickCardAnimation) {
      if (this.game.stack.length < 1) {
        this.restartGameDialog();
      } else {
        this.game.currentCard = this.game.stack.pop();
        this.game.pickCardAnimation = true;
        this.game.currentPlayer++;
        this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
        this.updateGame();
        setTimeout(() => {
          this.game.pickCardAnimation = false;
          this.game.playedCards.push(this.game.currentCard);
          this.updateGame();
        }, 1500);
      }
    }
  }

  restartGameDialog() {
    const dialogRef = this.dialog.open(RestartDialogComponent);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent, {
    });
    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.game.genders.push(this.varservice.choosedGender);
      }
      this.updateGame()
    });
  }

  // edidPlayer(playerId: number) {
  //   console.log('edid Player', playerId)
  // }
}
