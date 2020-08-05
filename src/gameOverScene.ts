import "phaser";
import { Game } from "phaser";


export class GameOverScene extends Phaser.Scene{
    score : number;
    restartButton : Phaser.Physics.Arcade.Sprite;
    info: Phaser.GameObjects.Text;
    constructor() {
        super({
          key: "GameOverScene"
        });
    }

    init(params) : void {
        this.score = params.score;
    }

    preload() :void {
        this.load.image('buttonRestart', '../assets/buttonRestart.png');
    }

    create() : void{
        this.restartButton = this.physics.add.sprite(this.cameras.main.centerX,this.cameras.main.centerY,'buttonRestart').setInteractive().setScale(0.1,0.1);
        this.restartButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        this.info = this.add.text(10, 10, 'Course du PPA ! Score Final obtenu : ' + this.score.toString(),
      { font: '24px Arial Bold', fill: '#FBFBAC' });
    }

    update(time): void {
    }
}