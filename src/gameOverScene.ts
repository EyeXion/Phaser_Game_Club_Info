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
    playButton: Phaser.Physics.Arcade.Sprite; // play button
    retryLogo: Phaser.Physics.Arcade.Sprite; // Game logo
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
    }

    preload(): void { //load images and audio
        this.load.image('buttonRestart', '../assets/buttonRestart.png');
        this.load.audio('deathSong', '../assets/deathSong.mp3');
        this.load.image('retryLogo', "../assets/retry.png");
        this.load.image('bestScore', '../assets/highScore.png');
        this.load.image('buttonPlay', '../assets/play.png');
        this.load.bitmapFont('myfont', '../assets/font.png', '../assets/font.fnt');
    }

    create(): void {
        //create restart button and add eventlistener

        this.sound.play('deathSong');
        this.sound.resumeAll();
        this.background = this.add.tileSprite(this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.game.canvas.width,
            this.textures.get('backgr').getSourceImage().height,
            'backgr').setScale(1, (this.cameras.main.height / this.textures.get('backgr').getSourceImage().height));

        this.restartButton = this.physics.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY + 70, 'buttonPlay').setInteractive().setScale(0.03, 0.03);
        this.restartButton.on('pointerdown', () => { // add event on click on button -> go to main scene
            this.scene.start('GameScene');
        });

        this.add.image(130, 30, 'bestScore').setScale(0.22,0.22);

        this.info = this.add.bitmapText(270, 10, 'myfont',this.bestScore.toString()); // display text

        this.spaceKey.on('down', this.startGameSpace, this); // add event listener space key down (restart game)

        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY - 40, 'retryLogo').setScale(0.4, 0.4);
    }

    update(time): void {
    }

    startGameSpace(): void { // callback function space key down
        if (this.time.now > 3000) {
            this.sound.removeByKey('deathSong');
            this.scene.start('GameScene', { previousScore: this.bestScore });
        }
    }
}