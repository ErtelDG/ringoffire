import { ConditionalExpr } from '@angular/compiler';
import { Component } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  // globale variable für diese component um diese globale für alle zu synchronisieren über firebase, müssen diese variable nachj game.ts wo auch die spieler-, kartendaten usw. hinterlegt sind => jetzt auskommentiert sind in game.ts
  //pickCardAnimation = false;
  //currentCard: any = '';

  game: Game = new Game();
  gameId: string = '';

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.newGame();
    this.route.params.subscribe((params) => {
      console.log(params['id']);
      this.gameId = params['id'];

      // datenbank automatisch werte bei änderungen abrufen: =>valueChanges().subscribe((game) => {console.log('Game update', game); });
      //mit doc() wird auf die satei zugegriffen bzw. verzeichnis von der collection
      //subscribe ruft die nachfolgende genannte daten ab um diese zu synchonisieren, sobald diese geändert werden auch pickCardAnimation und  currentCard müssen hinzugefügt werden;
      this.firestore
        .collection('games')
        .doc(this.gameId)
        .valueChanges()
        .subscribe((game: any) => {
          console.log('Game update', game);
          this.game.currentPlayer = game['currentPlayer'];
          this.game.playerCard = game['playerCard'];
          this.game.players = game['players'];
          this.game.stack = game['stack'];
          this.game.pickCardAnimation = game['pickCardAnimation'];
          this.game.currentCard = game['currentCard'];
        });
    });
  }

  newGame() {
    this.game = new Game();
    //datenbank werte hinzufügen => .add({ Hallo: 'Welt' }) => JSON OBJECT!!;
    //this.firestore.collection('games').add({ Hallo: 'Welt' });

    //aktuelles object an backend / firebase senden
    //this.firestore.collection('games').add(this.game.toJson());
  }

  takeCard() {
    if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop();
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer =
        this.game.currentPlayer % this.game.players.length;
      //obere änderungen werden sofort wieder gesendet und gespeicher in firebase
      this.saveGame();

      setTimeout(() => {
        this.game.playerCard.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }

  saveGame() {
    this.firestore
      .collection('games')
      .doc(this.gameId)
      .update(this.game.toJson());
  }
}
