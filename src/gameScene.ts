import "phaser";
import { Game } from "phaser";

export class GameScene extends Phaser.Scene {
  timerJump : number;
  ground: Phaser.Physics.Arcade.StaticGroup;
  groundTexture: Phaser.GameObjects.TileSprite;
  info: Phaser.GameObjects.Text;
  score: number;
  ppa: Phaser.Physics.Arcade.Sprite;
  spaceKey: Phaser.Input.Keyboard.Key;
  downKey: Phaser.Input.Keyboard.Key;
  animWalk: Phaser.Animations.Animation | boolean;
  backgrTreesMid: Phaser.GameObjects.TileSprite;
  backgrTreesBack: Phaser.GameObjects.TileSprite;
  backgrTreesFront: Phaser.GameObjects.TileSprite;
  backgrLight: Phaser.GameObjects.TileSprite;
  constructor() {
    super({
      key: "GameScene"
    });
  }

  init(params): void {
    this.score = 0;
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
  }

  preload(): void {
    this.load.image('ground', '../assets/ground.png');
    this.load.image('backgr_tree_back', '../assets/parallax-forest-back-trees.png');
    this.load.image('backgr_tree_front', '../assets/parallax-forest-front-trees.png');
    this.load.image('backgr_light', '../assets/parallax-forest-lights.png');
    this.load.image('backgr_tree_mid', '../assets/parallax-forest-middle-trees.png');
    this.load.spritesheet('ppa', '../assets/charac.png', { frameWidth: 32, frameHeight: 52 });
  }

  create(): void {

    this.ground = this.physics.add.staticGroup();
    this.ground.create(400, 275, 'ground');

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

    this.ppa = this.physics.add.sprite(200, 200, 'ppa', 8);
    this.info = this.add.text(10, 10, 'Course du PPA ! Score : ' + this.score.toString(),
      { font: '24px Arial Bold', fill: '#FBFBAC' });




    const config: Phaser.Types.Animations.Animation = {
      key: 'walk',
      frames: this.anims.generateFrameNames('ppa', { start: 9, end: 11 }),
      repeat: -1,
      frameRate: 5,
    };

    this.animWalk = this.anims.create(config);

    this.ppa.play('walk');
    this.ppa.setGravityY(300);
    this.physics.add.collider(this.ppa, this.ground);

  }

  update(time): void {


    if (this.spaceKey.isDown) {
      console.log('Space is pressed');
      console.log(this.ppa.y);
      if (this.ppa.y == 224){
        this.ppa.setVelocityY(-200);
      }
    }

    if (this.downKey.isDown) {
      console.log('Down is pressed');
    }
    this.backgrLight.tilePositionX += 0.5;
    this.backgrTreesMid.tilePositionX += 0.5;
    this.backgrTreesFront.tilePositionX += 2;
    this.backgrTreesBack.tilePositionX += 0.25;
    this.groundTexture.tilePositionX += 2;
  }
};