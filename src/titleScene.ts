import "phaser";
import { Game } from "phaser";

/*########################## TITLE SCENE ############################### */
export class TitleScene extends Phaser.Scene {
    backgrTreesMid: Phaser.GameObjects.TileSprite; // background
    backgrTreesBack: Phaser.GameObjects.TileSprite; // background
    backgrTreesFront: Phaser.GameObjects.TileSprite; // background
    backgrLight: Phaser.GameObjects.TileSprite; // background
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
        this.load.image('backgr_tree_back', '../assets/parallax-forest-back-trees.png');
        this.load.image('backgr_tree_front', '../assets/parallax-forest-front-trees.png');
        this.load.image('backgr_light', '../assets/parallax-forest-lights.png');
        this.load.image('backgr_tree_mid', '../assets/parallax-forest-middle-trees.png');
        this.load.image('ground', '../assets/ground.png');
        this.load.audio('launch','../assets/launch.wav');
    }

    create(): void {

         // create sprites
        this.backgrTreesBack = this.add.tileSprite(this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.game.canvas.width,
            this.textures.get('backgr_tree_back').getSourceImage().height,
            'backgr_tree_back').setScale(1, this.cameras.main.height / this.textures.get('backgr_tree_back').getSourceImage().height);

        this.backgrLight = this.add.tileSprite(this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.game.canvas.width,
            this.textures.get('backgr_light').getSourceImage().height,
            'backgr_light').setScale(1, this.cameras.main.height / this.textures.get('backgr_light').getSourceImage().height);

        this.backgrTreesMid = this.add.tileSprite(this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.game.canvas.width,
            this.textures.get('backgr_tree_back').getSourceImage().height,
            'backgr_tree_mid').setScale(1, this.cameras.main.height / this.textures.get('backgr_tree_mid').getSourceImage().height);

        this.backgrTreesFront = this.add.tileSprite(this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.game.canvas.width,
            this.textures.get('backgr_tree_front').getSourceImage().height,
            'backgr_tree_front').setScale(1, this.cameras.main.height / this.textures.get('backgr_tree_front').getSourceImage().height);

        this.groundTexture = this.add.tileSprite(400,
            275,
            this.textures.get('ground').getSourceImage().width,
            this.textures.get('ground').getSourceImage().height,
            'ground');


        this.playButton = this.physics.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY + 70, 'buttonPlay').setInteractive().setScale(0.03, 0.03);
        this.playButton.on('pointerdown', () => { // add event on click on button -> go to main scene
            this.scene.start('GameScene');
        });

        this.gameLogo = this.physics.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY - 50,'gameLogo').setScale(0.4,0.4);
        this.gameLogo.setVelocityY(-150); // jump of logo at the beginning
        this.gameLogo.setGravityY(350);
        this.spaceKey.on('down',this.startGameSpace,this); // is space key pressed, event and callback function called

        this.sound.play('launch');
    }

    update(time): void {
        if (this.gameLogo.y >= this.cameras.main.centerY - 40){ // Floating effect game logo
            this.gameLogo.setVelocityY(-50);
        }
    }

    startGameSpace() : void{ // callback function space key down
        this.scene.start('GameScene');
    }
}