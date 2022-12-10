import { ConditionalExpr } from '@angular/compiler';
import { Component } from '@angular/core';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  pickCardAnimation = false;
  currentCard: any = '';
  currentPlayerCard: string | undefined;
  game: Game = new Game();

  constructor() {}

  ngOnInit() {
    this.newGame();
  }

  newGame() {
    this.game = new Game();
    console.log(this.game);
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      this.pickCardAnimation = true;
      this.game.playerCard.push(this.currentCard);
      this.currentPlayerCard = this.game.playerCard[this.game.playerCard.length - 1];
      console.log(this.game.playerCard);
      console.log(this.game.stack);
      console.log(this.currentPlayerCard);

      setTimeout(() => {
        this.pickCardAnimation = false;
      }, 1500);
    }
  }
}
