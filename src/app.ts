import "phaser";

// CREDIT FOR THE SPRITES OF CHARACTER : Sithjester
// CREDIT FOR OTHER ASSETS (EXCEPT MUSIC) : Emily Holmes
// MUSIC : Scott Elliott  https://opengameart.org/content/jungle-jumpin

import { GameScene } from "./gameScene";
import { GameOverScene } from "./gameOverScene";
import { TitleScene } from "./titleScene";
import { ChoiceScene } from "./choiceScene";

const config: Phaser.Types.Core.GameConfig = {
  title: "La course du PPA",
  width: 800,
  height: 300,
  parent: "game",
  scene: [TitleScene,GameScene,GameOverScene, ChoiceScene],
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