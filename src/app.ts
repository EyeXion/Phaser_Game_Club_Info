import "phaser";

// CREDIT FOR THE SPRITES OF CHARACTER : Sithjester
//Artwork created by Luis Zuno (@ansimuz) (background) taken on OpenGameArt
//Tea cup sprite by Fleurman taken on OpenGameArt
//Heart sprite by DontMind8 taken on OpenGameArt
// Play button taken on freepngimg.com

import { GameScene } from "./gameScene";
import { GameOverScene } from "./gameOverScene";
import { TitleScene } from "./titleScene";

const config: Phaser.Types.Core.GameConfig = {
  title: "La course du PPA",
  width: 800,
  height: 300,
  parent: "game",
  scene: [TitleScene,GameScene,GameOverScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  },
  audio:{
    disableWebAudio : true,
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