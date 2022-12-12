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
  pickCardAnimation = false;
  currentCard: any = '';
  game: Game = new Game();

  constructor(private route:ActivatedRoute, private firestore: AngularFirestore, public dialog: MatDialog) {}

  ngOnInit() {
    this.newGame();
    this.route.params.subscribe((params)=>{
      console.log(params['id']);

      // datenbank automatisch werte bei änderungen abrufen: =>valueChanges().subscribe((game) => {console.log('Game update', game); });
      //mit doc() wird auf die satei zugegriffen bzw. verzeichnis von der collection
      this.firestore
        .collection('games')
        .doc(params['id'])
        .valueChanges()
        .subscribe((game:any) => {
          console.log('Game update', game);
          this.game.currentPlayer = game['currentPlayer'];
          this.game.playerCard = game['playerCard'];
          this.game.players = game['players'];
          this.game.stack = game['stack'];
        });
    })

  
  }

  newGame() {
    this.game = new Game();
    //datenbank werte hinzufügen => .add({ Hallo: 'Welt' }) => JSON OBJECT!!;
    //this.firestore.collection('games').add({ Hallo: 'Welt' });

    //aktuelles object an backend / firebase senden
    //this.firestore.collection('games').add(this.game.toJson());
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      this.pickCardAnimation = true;

      console.log(this.game.playerCard);
      console.log(this.game.stack);

      this.game.currentPlayer++;
      this.game.currentPlayer =
        this.game.currentPlayer % this.game.players.length;

      setTimeout(() => {
        this.game.playerCard.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
      }
    });
  }
}
