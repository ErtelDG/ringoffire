export class Game {
  public players: string[] = [];
  public stack: string[] = [];
  public playerCard: any[] = [];
  public currentPlayer: number = 0;

  //variable hier neu um diese global zu synchroniusieren und von alle genutzt werden können z.B. css wegen style binding
  public pickCardAnimation = false;
  public currentCard: any = '';

  constructor() {
    for (let i = 1; i < 14; i++) {
      this.stack.push('ace_' + i);
      this.stack.push('hearts_' + i);
      this.stack.push('clubs_' + i);
      this.stack.push('diamonds_' + i);
    }
    shuffle(this.stack);
  }

  // public damit überall zugegriffen werden kann
  public toJson() {
    // object in ein json umwandeln, damt es an firebase / backend gesendet werden kann
    // public pickCardAnimation = false; public currentCard: any = ''; ebenfalls hinzufügen, damit diese synchronisiert werden
    return {
      players: this.players,
      stack: this.stack,
      playerCard: this.playerCard,
      currentPlayer: this.currentPlayer,
      pickCardAnimation: this.pickCardAnimation,
      currentCard: this.currentCard,
    };
  }
}

function shuffle(array: string[]) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
