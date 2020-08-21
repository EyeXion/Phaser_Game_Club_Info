import "phaser";
import { Game } from "phaser";

/* ############################# GAME OVER SCENE ###########################" */

export class GameOverScene extends Phaser.Scene {
    score: number; // score of the previous game
    restartButton: Phaser.Physics.Arcade.Sprite; // restart button
    info: Phaser.GameObjects.BitmapText; // text
    bestScore: number; // best score of all games
    spaceKey: Phaser.Input.Keyboard.Key; // object for space key
    background: Phaser.GameObjects.TileSprite; //bg
    retryLogo: Phaser.Physics.Arcade.Sprite; // Game logo
    soundControl: Phaser.Physics.Arcade.Sprite;
    isSoundOn: boolean;
    isRedChosen : boolean;
    hasTimerEnded : boolean;
    constructor() {
        super({
            key: "GameOverScene"
        });
    }

    init(params): void {
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.score = params.score;
        if (this.score > params.bestScore) { // update best score if needed
            this.bestScore = params.score;
        }
        else {
            this.bestScore = params.bestScore;
        }
        this.isSoundOn = params.isSoundOn;
        this.isRedChosen = params.isRedChosen;
        this.hasTimerEnded = false;
    }

    preload(): void { //load images and audio
        this.load.image('buttonRestart', '../assets/buttonRestart.png');
        this.load.image('retryLogo', "../assets/retry.png");
        this.load.image('bestScore', '../assets/highScore.png');
        this.load.image('buttonPlay', '../assets/play.png');
        this.load.bitmapFont('myfont', '../assets/font.png', '../assets/font.fnt');
        this.load.image('soundOn', '../assets/musicOn.png');
        this.load.image('soundOff', '../assets/musicOff.png');
    }

    create(): void {
        //create restart button and add eventlistener

        this.sound.resumeAll();
        this.background = this.add.tileSprite(this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.game.canvas.width,
            this.textures.get('backgr').getSourceImage().height,
            'backgr').setScale(1, (this.cameras.main.height / this.textures.get('backgr').getSourceImage().height));

        this.restartButton = this.physics.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY + 70, 'buttonPlay').setInteractive().setScale(0.3, 0.3);
        this.restartButton.on('pointerdown', this.startGameSpace,this);  // add event on click on button -> go to main scene

        this.add.image(130, 30, 'bestScore').setScale(0.22, 0.22);

        this.info = this.add.bitmapText(270, 10, 'myfont', this.bestScore.toString()); // display text

        this.spaceKey.on('down', this.startGameSpace, this); // add event listener space key down (restart game)

        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY - 40, 'retryLogo').setScale(0.4, 0.4);
        this.sound.play('deathSong');
        if (this.isSoundOn) {
            this.soundControl = this.physics.add.sprite(20, 100, 'soundOn').setInteractive();
        }
        else {
            this.sound.stopAll();
            this.soundControl = this.physics.add.sprite(20, 100, 'soundOff').setInteractive();
        }

        this.soundControl.on('pointerdown', () => { // add event on click on button -> sound on or off
            if (this.isSoundOn) {
                this.isSoundOn = false;
                this.soundControl.setTexture('soundOff');
                this.sound.stopAll();
            }
            else {
                this.isSoundOn = true;
                this.soundControl.setTexture('soundOn');
            }
        });
        this.time.addEvent({ delay: 1000, callback: this.timerEnded, callbackScope: this }); // add timer so that u dont restart right away if you keep pressing space after you die
    }

    update(time): void {
        this.restartButton.on('pointerover', () => {
            this.restartButton.setScale(0.4, 0.4);
        })

        this.restartButton.on('pointerout', () => {
            this.restartButton.setScale(0.3, 0.3);
        })

        this.soundControl.on('pointerover', () => { // hover effect on music controller
            this.soundControl.setScale(1.2, 1.2);
        })

        this.soundControl.on('pointerout', () => {
            this.soundControl.setScale(1, 1);
        })
    }

    startGameSpace(): void { // callback function space key down
        if (this.hasTimerEnded) {
            this.sound.removeByKey('deathSong');
            this.scene.start('GameScene', { previousScore: this.bestScore, isSoundOn: this.isSoundOn,
            isRedChosen : this.isRedChosen });
        }
    }
    
    timerEnded() : void{
        this.hasTimerEnded = true;
    }
}