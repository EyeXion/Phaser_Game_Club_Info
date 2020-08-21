import "phaser";
import { Game } from "phaser";

/*########################## TITLE SCENE ############################### */
export class ChoiceScene extends Phaser.Scene {
    background: Phaser.GameObjects.TileSprite; // background
    playButton: Phaser.Physics.Arcade.Sprite; // play button
    floatTimer: number; // timer used floating effect logo
    spaceKey: Phaser.Input.Keyboard.Key; // object for space key
    soundControl: Phaser.Physics.Arcade.Sprite;
    chooseText : Phaser.Physics.Arcade.Sprite;
    redTeamText : Phaser.Physics.Arcade.Sprite;
    yellowTeamText : Phaser.Physics.Arcade.Sprite;
    redTeamChar : Phaser.Physics.Arcade.Sprite;
    yellowTeamChar : Phaser.Physics.Arcade.Sprite;
    isSoundOn: boolean;
    isRedChosen : boolean;
    constructor() {
        super({
            key: "ChoiceScene"
        });
    }

    init(params): void {
        this.floatTimer = this.time.now;
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.isSoundOn = params.isSoundOn;
        this.isRedChosen = true;
    }

    preload(): void { // load images and audio
        this.load.spritesheet('redppa','../assets/ppablouse_rouge.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('yellowppa','../assets/ppablouse_jaune.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image('redText', '../assets/redText.png');
        this.load.image('yellowText', '../assets/yellowText.png');
        this.load.image('chooseText','../assets/chooseText.png');
        this.load.image('backgr', '../assets/bg.png');
    }

    create(): void {

        // create sprites

        this.background = this.add.tileSprite(this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.game.canvas.width,
            this.textures.get('backgr').getSourceImage().height,
            'backgr').setScale(1, (this.cameras.main.height / this.textures.get('backgr').getSourceImage().height));

        this.playButton = this.physics.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY + 90, 'buttonPlay').setInteractive().setScale(0.3, 0.3);
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

        this.spaceKey.on('down', this.startGameSpace, this); // is space key pressed, event and callback function called

        this.chooseText = this.physics.add.sprite(400,50,'chooseText').setScale(0.2,0.2);

        this.redTeamChar = this.physics.add.sprite(175, 150,'redppa',10).setInteractive().setScale(2.4,2.4);

        this.yellowTeamChar = this.physics.add.sprite(625, 150,'yellowppa',10).setInteractive().setScale(2.2,2.2);

        this.redTeamText = this.physics.add.sprite(175,223,'redText').setInteractive().setScale(0.25,0.25);

        this.yellowTeamText = this.physics.add.sprite(625,220,'yellowText').setInteractive().setScale(0.2,0.2);

        this.yellowTeamChar.on('pointerdown', this.chooseYellow,this);
        this.yellowTeamText.on('pointerdown', this.chooseYellow,this);

        this.redTeamChar.on('pointerdown', this.chooseRed,this);
        this.redTeamText.on('pointerdown', this.chooseRed,this);


        this.redTeamChar.setGravityY(350);

        this.sound.play('chooseSound', {volume : 1});

    }

    update(time): void {
        if (this.redTeamChar.y >= 130 && this.isRedChosen) { // Floating effect game logo
            this.redTeamChar.setVelocityY(-50);
        }

        if (this.yellowTeamChar.y >= 130 && !this.isRedChosen) { // Floating effect game logo
            this.yellowTeamChar.setVelocityY(-50);
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

        this.soundControl.on('pointerout', () => {
            this.soundControl.setScale(1, 1);
        });

        this.redTeamChar.on('pointerover', () => { // hover effect on music controller
            if (!this.isRedChosen){
                this.redTeamChar.setScale(2.4,2.4);
                this.redTeamText.setScale(0.25);
            }
        });

        this.redTeamText.on('pointerover', () => { // hover effect on music controller
            if (!this.isRedChosen){
                this.redTeamChar.setScale(2.4,2.4);
                this.redTeamText.setScale(0.25);
            }
        });

        this.redTeamChar.on('pointerout', () => { // hover effect on music controller
            if (!this.isRedChosen){
                this.redTeamChar.setScale(2.2,2.2);
                this.redTeamText.setScale(0.2);
            }
        });


        this.redTeamText.on('pointerout', () => { // hover effect on music controller
            if (!this.isRedChosen){
                this.redTeamChar.setScale(2.2,2.2);
                this.redTeamText.setScale(0.2);
            }
        });

        this.yellowTeamChar.on('pointerover', () => { // hover effect on music controller
            if (this.isRedChosen){
                this.yellowTeamChar.setScale(2.4,2.4);
                this.yellowTeamText.setScale(0.25);
            }
        });

        this.yellowTeamText.on('pointerover', () => { // hover effect on music controller
            if (this.isRedChosen){
                this.yellowTeamChar.setScale(2.4,2.4);
                this.yellowTeamText.setScale(0.25);
            }
        });

        this.yellowTeamChar.on('pointerout', () => { // hover effect on music controller
            if (this.isRedChosen){
                this.yellowTeamChar.setScale(2.2,2.2);
                this.yellowTeamText.setScale(0.2);
            }
        });


        this.yellowTeamText.on('pointerout', () => { // hover effect on music controller
            if (this.isRedChosen){
                this.yellowTeamChar.setScale(2.2,2.2);
                this.yellowTeamText.setScale(0.2);
            }
        });

    }

    startGameSpace(): void { // callback function space key down or button hit
        this.sound.removeAll();
        console.log(this.isSoundOn);
        this.scene.start('GameScene', { isSoundOn : this.isSoundOn , isRedChosen : this.isRedChosen});
    }

    chooseRed() :void {
        if (!this.isRedChosen){
            this.redTeamChar.setGravityY(350);
            this.isRedChosen =true;
            this.yellowTeamChar.setGravityY(0);
            this.yellowTeamChar.setVelocityY(0);
            this.yellowTeamChar.setY(150);
            this.redTeamText.setScale(0.25,0.25);
            this.yellowTeamChar.setScale(0.2,0.2);
            this.yellowTeamChar.setScale(2.2,2.2);
            this.redTeamChar.setScale(2.4,2.4);
            this.sound.play('redSound');
        }
    }

    chooseYellow() :void {
        if (this.isRedChosen){
            this.yellowTeamChar.setGravityY(350);
            this.isRedChosen =false;
            this.redTeamChar.setGravityY(0);
            this.redTeamChar.setVelocityY(0);
            this.redTeamChar.setY(150);
            this.yellowTeamText.setScale(0.25,0.25);
            this.redTeamChar.setScale(0.2,0.2);
            this.yellowTeamChar.setScale(2.4,2.4);
            this.redTeamChar.setScale(2.2,2.2);
            this.sound.play('yellowSound');
        }
    }
}