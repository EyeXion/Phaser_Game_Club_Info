import "phaser";
import { Game } from "phaser";

export class GameScene extends Phaser.Scene {
    ground : Phaser.Physics.Arcade.Image;
    info : Phaser.GameObjects.Text;
    score : number;
    ppa : Phaser.Physics.Arcade.Sprite;
constructor() {
    super({
      key: "GameScene"
    });
  }

init(params): void {
    this.score = 0;
  }

preload(): void {
    this.load.image('ground','../assets/ground.png');
    this.load.image('ppa','../assets/walk1.png');
  }
  
create(): void {
    this.physics.add.staticImage(400,550,'ground');
    this.physics.add.sprite(200,475,'ppa');
    this.info = this.add.text(10, 10, 'Course du PPA ! Score : ' + this.score.toString(),
      { font: '24px Arial Bold', fill: '#FBFBAC' });
}

update(time): void {
    // TODO
  }
};