import "phaser";
import { Game } from "phaser";

/*########################## TITLE SCENE ############################### */
export class TitleScene extends Phaser.Scene {
    background: Phaser.GameObjects.TileSprite; // background
    playButton: Phaser.Physics.Arcade.Sprite; // play button
    gameLogo: Phaser.Physics.Arcade.Sprite; // Game logo
    groundTexture: Phaser.GameObjects.TileSprite; // ground texture
    floatTimer : number; // timer used floating effect logo
    spaceKey: Phaser.Input.Keyboard.Key; // object for space key
    constructor() {
        super({
            key: "TitleScene"
        });
    }

    init(params): void {
        this.floatTimer = this.time.now;
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    }
 
    preload(): void { // load images and audio
        this.load.image('gameLogo','../assets/gameLogo.png');
        this.load.image('buttonPlay', '../assets/play.png');
        this.load.image('backgr', '../assets/bg.png');
        this.load.image('ground', '../assets/ground.png');
        this.load.audio('launch','../assets/launch.mp3');
        this.load.image('backgr', '../assets/bg.png');
    }

    create(): void {

         // create sprites

         this.background = this.add.tileSprite(this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.game.canvas.width,
            this.textures.get('backgr').getSourceImage().height,
            'backgr').setScale(1, (this.cameras.main.height / this.textures.get('backgr').getSourceImage().height));

        this.playButton = this.physics.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY + 70, 'buttonPlay').setInteractive().setScale(0.03, 0.03);
        this.playButton.on('pointerdown', () => { // add event on click on button -> go to main scene
            this.scene.start('GameScene');
        });

        this.gameLogo = this.physics.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY - 50,'gameLogo').setScale(0.4,0.4);
        this.gameLogo.setVelocityY(-150); // jump of logo at the beginning
        this.gameLogo.setGravityY(350);
        this.spaceKey.on('down',this.startGameSpace,this); // is space key pressed, event and callback function called

        this.sound.play('launch',{volume : 0.5});
    }

    update(time): void {
        if (this.gameLogo.y >= this.cameras.main.centerY - 40){ // Floating effect game logo
            this.gameLogo.setVelocityY(-50);
        }
    }

    startGameSpace() : void{ // callback function space key down
        this.sound.removeAll();
        this.scene.start('GameScene');
    }
}