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

  /**
   * Initializes the game and subscribes the backend
   */
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
          this.game.players = game.players;
          this.game.stack = game.stack;
          this.game.genders = game.genders;
          this.game.currentPlayer = game.currentPlayer;
          this.game.playedCards = game.playedCards
          this.game.pickCardAnimation = game.pickCardAnimation
          this.game.currentCard = game.currentCard
        });
    })
  }

  /**
   * Opens edid-player-dialog and defines actions after dialog closes
   * @param playerId id of the player thats is going to be edided
   */
  editPlayer(playerId: number) {
    this.varservice.playerName = this.game.players[playerId]
    const dialogRef = this.dialog.open(EditPlayerComponent, {
    });
    dialogRef.afterClosed().subscribe((change: any) => {
      this.checkForPlayerChanges(change, playerId);
      this.updateGame();
    });
  }

  /**
   * Checkes for any changes. Deletses player or changes his name
   * @param change event
   * @param playerId id of the player thats is going to be edided
   */
  checkForPlayerChanges(change, playerId) {
    if (change) {
      if (change == 'DELETE') {
        this.game.genders.splice(playerId, 1);
        this.game.players.splice(playerId, 1);
      } else {
        this.game.players[playerId] = change;
      }
    };
  }

  /**
   * Creates new game
   */
  newGame() {
    this.game = new Game();
  }

  /**
   * Updates the backend 
   */
  updateGame() {
    this
      .firestore
      .collection('games')
      .doc(this.currentGameId)
      .update(this.game.toJson())
  }

/**
 * Checkes if animation in progress and min. one player in game.
 * Triggers all functions to make one turn in the game
 */
  pickCard() {
    if (this.animationInProgress() && this.minTwoPlayerInGame()) {
      if (!this.allCardsPlayed()) {
        this.restartGameDialog();
      } else {
        this.updateGameItems();
        this.updateGame();
        this.resetAnimation();

      }
    }
  }

  /**
   * Resets the animation boolean and adds one card to played cards array
   */
  resetAnimation() {
    setTimeout(() => {
      this.game.pickCardAnimation = false;
      this.game.playedCards.push(this.game.currentCard);
      this.updateGame();
    }, 1500);
  }

  /**
   * Deletes one card from playable card array. Triggers card animation. 
   * Selects next player
   */
  updateGameItems() {
    this.game.currentCard = this.game.stack.pop();
    this.game.pickCardAnimation = true;
    this.game.currentPlayer++;
    this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
  }

  /**
   * Opens restart game dialog. Triggers restart function when closed on button
   */
  restartGameDialog() {
    const dialogRef = this.dialog.open(RestartDialogComponent);
    dialogRef.afterClosed().subscribe((change: any) => {
      if (change) {
        if (change == 'restart') {
          this.restartGame();
        }
      }
    });
  }

  /**
   * Resets the game while keeping players
   */
  restartGame() {
    let players = this.game.players;
          let genders = this.game.genders;
          this.newGame();
          this.game.players = players;
          this.game.genders = genders;
          this.updateGame()
  }

  /**
   * Opens add player dialog. Adds a new player
   */
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

  //HTML Templates

  animationInProgress() {
    return !this.game.pickCardAnimation
  }

  minTwoPlayerInGame() {
    return this.game.players.length > 1
  }

  allCardsPlayed() {
    return this.game.players.length > 0
  }
}

