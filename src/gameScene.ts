import "phaser";
import { Game } from "phaser";

export class GameScene extends Phaser.Scene {
    ground : Phaser.Physics.Arcade.Image;
    info : Phaser.GameObjects.Text;
    score : number;
    ppa : Phaser.Physics.Arcade.Sprite;
    spaceKey : Phaser.Input.Keyboard.Key;
    downKey : Phaser.Input.Keyboard.Key;
    animWalk  : Phaser.Animations.Animation | boolean;
constructor() {
    super({
      key: "GameScene"
    });
  }

init(params): void {
    this.score = 0;
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
  }

preload(): void {
    this.load.image('ground','../assets/ground.png');
    this.load.spritesheet('ppa','../assets/charac.png', { frameWidth: 32, frameHeight: 52 });
  }
  
create(): void {
    this.physics.add.staticImage(400,550,'ground');
    this.ppa = this.physics.add.sprite(200,475,'ppa',8);
    this.info = this.add.text(10, 10, 'Course du PPA ! Score : ' + this.score.toString(),
      { font: '24px Arial Bold', fill: '#FBFBAC' });

    const config : Phaser.Types.Animations.Animation = {
      key : 'walk',
      frames : this.anims.generateFrameNames('ppa',{start : 9, end : 10}),
      repeat : -1,
      frameRate: 5,
    };

    this.animWalk = this.anims.create(config);

    this.ppa.play('walk');
    
}

update(time): void {
  if (this.spaceKey.isDown) {
    console.log('Space is pressed');
  }
  if (this.downKey.isDown) {
    console.log('Down is pressed');
  }
  }
};