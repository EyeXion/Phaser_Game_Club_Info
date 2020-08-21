import "phaser";
import { Game } from "phaser";

/*########################## TITLE SCENE ############################### */
export class TitleScene extends Phaser.Scene {
    background: Phaser.GameObjects.TileSprite; // background
    playButton: Phaser.Physics.Arcade.Sprite; // play button
    gameLogo: Phaser.Physics.Arcade.Sprite; // Game logo
    groundTexture: Phaser.GameObjects.TileSprite; // ground texture
    spaceKey: Phaser.Input.Keyboard.Key; // object for space key
    soundControl: Phaser.Physics.Arcade.Sprite;
    isSoundOn: boolean;
    constructor() {
        super({
            key: "TitleScene"
        });
    }

    init(params): void {
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.isSoundOn = true;
    }

    preload(): void { // load images and audio
        this.load.image('gameLogo', '../assets/gameLogo1.png');
        this.load.image('buttonPlay', '../assets/play1.png');
        this.load.image('backgr', '../assets/bg.png');
        this.load.audio('launch', '../assets/launch.mp3');
        this.load.image('soundOn', '../assets/musicOn.png');
        this.load.image('soundOff', '../assets/musicOff.png');
        this.load.audio('jump', '../assets/jump.wav');
        this.load.audio('coffeeSound', '../assets/coffee.mp3');
        this.load.audio('impact', '../assets/impact.mp3');
        this.load.audio('mainSound', '../assets/bgSoundMain.mp3');
        this.load.audio('deathSong', '../assets/deathSong.mp3');
        this.load.audio('chooseSound', '../assets/chooseSound.wav');
        this.load.audio('yellowSound', '../assets/yellowTeamSound.wav');
        this.load.audio('redSound', '../assets/redTeamSound.wav');

    }

    create(): void {

        // create sprites

        this.background = this.add.tileSprite(this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.game.canvas.width,
            this.textures.get('backgr').getSourceImage().height,
            'backgr').setScale(1, (this.cameras.main.height / this.textures.get('backgr').getSourceImage().height));

        this.playButton = this.physics.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY + 70, 'buttonPlay').setInteractive().setScale(0.3, 0.3);
        this.playButton.on('pointerdown', this.startGameSpace,this); // add event on click on button -> go to main scene

        this.soundControl = this.physics.add.sprite(20, 100, 'soundOn').setInteractive();
        this.soundControl.on('pointerdown', () => { // add event on click on button -> sound on or off
            if (this.isSoundOn) {
                this.isSoundOn = false;
                this.soundControl.setTexture('soundOff')
                this.sound.stopAll();
            }
            else {
                this.isSoundOn = true;
                this.soundControl.setTexture('soundOn');
            }
        });


        this.gameLogo = this.physics.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY - 50, 'gameLogo').setScale(0.4, 0.4);
        this.gameLogo.setVelocityY(-150); // jump of logo at the beginning
        this.gameLogo.setGravityY(350);
        this.spaceKey.on('down', this.startGameSpace, this); // is space key pressed, event and callback function called

        this.sound.play('launch', { volume: 0.5 });
    }

    update(time): void {
        if (this.gameLogo.y >= this.cameras.main.centerY - 40) { // Floating effect game logo
            this.gameLogo.setVelocityY(-50);
        }

        this.playButton.on('pointerover', () => { // hover effect on button
            this.playButton.setScale(0.4, 0.4);
        });

        this.playButton.on('pointerout', () => {
            this.playButton.setScale(0.3, 0.3);
        });

        this.soundControl.on('pointerover', () => { // hover effect on music controller
            this.soundControl.setScale(1.2, 1.2);
        });

        this.soundControl.on('pointerout', () => {
            this.soundControl.setScale(1, 1);
        });
    }

    startGameSpace(): void { // callback function space key down or button hit
        this.sound.removeAll();
        console.log(this.isSoundOn);
        this.scene.start('ChoiceScene', { isSoundOn : this.isSoundOn });
    }
}