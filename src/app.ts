import "phaser";

const config: GameConfig = {
  title: "Course du PPA",
  width: 800,
  height: 600,
  parent: "game",
  backgroundColor: "#18216D"
};

export class PPAGame extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}

window.onload = () => {
  var game = new PPAGame(config);
};