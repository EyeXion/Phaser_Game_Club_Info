import "phaser";
import { Game } from "phaser";

/* ############################# GAME OVER SCENE ###########################" */

export class GameOverScene extends Phaser.Scene{
    score : number; // score of the previous game
    restartButton : Phaser.Physics.Arcade.Sprite; // restart button
    info: Phaser.GameObjects.Text; // text
    bestScore : number; // best score of all games
    spaceKey: Phaser.Input.Keyboard.Key; // object for space key
    constructor() {
        super({
          key: "GameOverScene"
        });
    }

    init(params) : void {
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.score = params.score;
        if (this.score > params.bestScore){ // update best score if needed
            this.bestScore = params.score;
        }
        else{
            this.bestScore = params.bestScore;
        }
    }

    preload() :void { //load images and audio
        this.load.image('buttonRestart', '../assets/buttonRestart.png');
        this.load.audio('deathSong','../assets/deathSong.mp3');
    }

    create() : void{ 
        //create restart button and add eventlistener
        this.sound.play('deathSong');
        this.restartButton = this.physics.add.sprite(this.cameras.main.centerX,this.cameras.main.centerY,'buttonRestart').setInteractive().setScale(0.1,0.1); 
        this.restartButton.on('pointerdown', () => {
            this.sound.stopAll();
            this.scene.start('GameScene', {previousScore : this.bestScore});
        });

        this.info = this.add.text(10, 10, 'Course du PPA ! Best score  : ' + this.bestScore.toString(),
      { font: '24px Arial Bold', fill: '#FBFBAC' }); // display text

      this.spaceKey.on('down',this.startGameSpace,this); // add event listener space key down (restart game)
    }

    update(time): void {
    }

    startGameSpace() : void{ // callback function space key down
        if (this.time.now > 3000){
            this.scene.start('GameScene', {previousScore : this.bestScore});
            this.sound.stopAll();
        }
    }
}