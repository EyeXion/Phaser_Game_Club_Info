import "phaser";
import { Game } from "phaser";


export class TitleScene extends Phaser.Scene {
    backgrTreesMid: Phaser.GameObjects.TileSprite;
    backgrTreesBack: Phaser.GameObjects.TileSprite;
    backgrTreesFront: Phaser.GameObjects.TileSprite;
    backgrLight: Phaser.GameObjects.TileSprite;
    playButton: Phaser.Physics.Arcade.Sprite;
    gameLogo: Phaser.Physics.Arcade.Sprite;
    groundTexture: Phaser.GameObjects.TileSprite;
    floatTimer : number;
    spaceKey: Phaser.Input.Keyboard.Key;
    constructor() {
        super({
            key: "TitleScene"
        });
    }

    init(params): void {
        this.floatTimer = this.time.now;
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    }

    preload(): void {
        this.load.image('gameLogo','../assets/gameLogo.png');
        this.load.image('buttonPlay', '../assets/play.png');
        this.load.image('backgr_tree_back', '../assets/parallax-forest-back-trees.png');
        this.load.image('backgr_tree_front', '../assets/parallax-forest-front-trees.png');
        this.load.image('backgr_light', '../assets/parallax-forest-lights.png');
        this.load.image('backgr_tree_mid', '../assets/parallax-forest-middle-trees.png');
        this.load.image('ground', '../assets/ground.png');
    }

    create(): void {

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
        this.playButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        this.gameLogo = this.physics.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY - 50,'gameLogo').setScale(0.4,0.4);
        this.gameLogo.setVelocityY(-150);
        this.gameLogo.setGravityY(350);
        this.spaceKey.on('down',this.startGameSpace,this);
    }

    update(time): void {
        console.log(this.gameLogo.y);
        if (this.gameLogo.y >= this.cameras.main.centerY - 40){
            this.gameLogo.setVelocityY(-50);
        }
    }

    startGameSpace() : void{
        this.scene.start('GameScene');
    }
}