import "phaser";

// CREDIT FOR THE SPRITES OF CHARACTER : Sithjester
//Artwork created by Luis Zuno (@ansimuz) (background)

import { GameScene } from "./gameScene";
const config: Phaser.Types.Core.GameConfig = {
  title: "La course du PPA",
  width: 800,
  height: 300,
  parent: "game",
  scene: [GameScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  },
  backgroundColor: "#000033"
};

export class PPAGame extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

window.onload = () => {
  var game = new PPAGame(config);
};