import "phaser";
import { Game } from "phaser";


export class GameOverScene extends Phaser.Scene{
    score : number;
    restartButton : Phaser.Physics.Arcade.Sprite;
    info: Phaser.GameObjects.Text;
    bestScore : number;
    spaceKey: Phaser.Input.Keyboard.Key;
    constructor() {
        super({
          key: "GameOverScene"
        });
    }

    init(params) : void {
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.score = params.score;
        if (this.score > params.bestScore){
            this.bestScore = params.score;
        }
        else{
            this.bestScore = params.bestScore;
        }
    }

    preload() :void {
        this.load.image('buttonRestart', '../assets/buttonRestart.png');
    }

    create() : void{
        this.restartButton = this.physics.add.sprite(this.cameras.main.centerX,this.cameras.main.centerY,'buttonRestart').setInteractive().setScale(0.1,0.1);
        this.restartButton.on('pointerdown', () => {
            this.scene.start('GameScene', {previousScore : this.bestScore});
        });

        this.info = this.add.text(10, 10, 'Course du PPA ! Best score  : ' + this.bestScore.toString(),
      { font: '24px Arial Bold', fill: '#FBFBAC' });

      this.spaceKey.on('down',this.startGameSpace,this);
    }

    update(time): void {
    }

    startGameSpace() : void{
        if (this.time.now > 3000){
            this.scene.start('GameScene', {previousScore : this.bestScore});
        }
    }
}