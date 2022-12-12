import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss'],
})
export class StartScreenComponent {
  constructor(private firestore: AngularFirestore, private router: Router) {}

  game: any;

  newGame() {
    this.game = new Game();

    //aktuelles object an backend / firebase senden und werte abrufen
    this.firestore
      .collection('games')
      .add(this.game.toJson())
      .then((gameInfo: any) => {
        this.router.navigateByUrl('/game/' + gameInfo.id);
      });
  }
}
