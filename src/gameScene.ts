import "phaser";
import { Game } from "phaser";

export class GameScene extends Phaser.Scene {
  minSpawnTime : number;
  factorSpawnTume : number;
  speed : number;
  obstacles : Phaser.Physics.Arcade.Group;
  heart : Phaser.GameObjects.Image;
  lifes : number;
  coffee : Phaser.Physics.Arcade.Group;
  lastSpawnTime : number;
  timeTilSpawn : number;
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
  arrayObstacles : Array<string>;
  previousScore : number;
  constructor() {
    super({
      key: "GameScene"
    });
  }

  init(params): void {
    this.minSpawnTime = 1000;
    this.factorSpawnTume = 2000;
    this.speed = 0;
    this.timeTilSpawn = Math.random()*2000 + 2000;
    this.lifes = 0;
    this.score = 0;
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.arrayObstacles = ['obs1','obs2'];

    if (params.hasOwnProperty('previousScore')){
      this.previousScore = params.previousScore;
    }
    else{
      this.previousScore = 0;
    }
  }

  preload(): void {
    this.load.image('obs2', '../assets/monster2.png');
    this.load.image('obs1', '../assets/monster.png');
    this.load.image('ground', '../assets/ground.png');
    this.load.image('backgr_tree_back', '../assets/parallax-forest-back-trees.png');
    this.load.image('backgr_tree_front', '../assets/parallax-forest-front-trees.png');
    this.load.image('backgr_light', '../assets/parallax-forest-lights.png');
    this.load.image('backgr_tree_mid', '../assets/parallax-forest-middle-trees.png');
    this.load.image('heart','../assets/heart.png');
    this.load.spritesheet('ppa', '../assets/ppablouse.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('coffee','../assets/Coffee.png',  { frameWidth: 24, frameHeight: 24 });
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

    const config: Phaser.Types.Animations.Animation = {
      key: 'walk',
      frames: this.anims.generateFrameNames('ppa', { start: 9, end: 11 }),
      repeat: -1,
      frameRate: 5,
    };

    this.animWalk = this.anims.create(config);

    this.ppa.play('walk');
    this.ppa.setGravityY(1000);
    this.physics.add.collider(this.ppa, this.ground);
    this.ppa.setSize(28,45);

    this.info = this.add.text(10, 10, 'Course du PPA ! Score : ' + this.score.toString()+ '                Best Score : ' + this.previousScore.toString(),
    { font: '24px Arial Bold', fill: '#FBFBAC' });

    this.obstacles = this.physics.add.group({velocityX : -200});
    this.obstacles.create(this.game.canvas.width - 50 , 220, 'obs1');
    this.lastSpawnTime = this.game.getTime();
    this.physics.add.collider(this.ppa,this.obstacles,this.collide,null,this);

    this.coffee = this.physics.add.group({
      setScale : {x : 2, y : 2},
      allowGravity: false,
      velocityX : -200,
  });
  }

  update(time): void {
    var currentTime  : number = this.game.getTime();
    this.score += 1;
    if (this.speed < 300){
      this.speed -= 0.07;
      this.factorSpawnTume -= 0.2;
      this.minSpawnTime -= 0.05;
    }

    this.obstacles.setVelocityX(-200 + this.speed);

    this.physics.overlap(this.coffee,this.ppa,this.getCoffee,null,this);

    this.info.destroy();
    this.info = this.add.text(10, 10, 'Course du PPA ! Score : ' + this.score.toString() + '                Best Score : ' + this.previousScore.toString(),
    { font: '24px Arial Bold', fill: '#FBFBAC' });


    if ((currentTime - this.lastSpawnTime) > this.timeTilSpawn){
      let randomObstacles : number = (Math.random()*2 - 0.000);
      randomObstacles = Math.floor(randomObstacles);
      this.obstacles.create(this.game.canvas.width + 50, 220, this.arrayObstacles[randomObstacles]);
      this.lastSpawnTime = this.game.getTime();
      this.timeTilSpawn = Math.random()*this.factorSpawnTume + this.minSpawnTime;
    }

    if (this.score == 200){
      this.coffee.create(this.game.canvas.width + 50, 150,'coffee',3);
    }

    if (this.spaceKey.isDown) {
      console.log('Space is pressed');
      console.log(this.ppa.y);
      if (this.ppa.y > 220){
        this.ppa.setVelocityY(-500);
      }
    }

    if (this.downKey.isDown) {
      console.log('Down is pressed');
    }

    this.obstacles.getChildren().forEach((child) => {
     if  (child.body.position.x < 0){
       child.destroy();
     }
    },this)

    this.backgrLight.tilePositionX += 0.5;
    this.backgrTreesMid.tilePositionX += 0.5;
    this.backgrTreesFront.tilePositionX += 2;
    this.backgrTreesBack.tilePositionX += 0.25;
    this.groundTexture.tilePositionX += 2;
  }

  collide() : void {
    if (this.lifes > 0){
      this.obstacles.getChildren().forEach((child) => {
        child.destroy();
       },this)
      this.lifes-= 1;
      this.ppa.setVelocityX(0);
      this.heart.destroy();
    }
    else{
      this.scene.start('GameOverScene', {score : this.score, bestScore : this.previousScore});
    }
  }


getCoffee(){
  this.coffee.getChildren().forEach((child) => {
    child.destroy();
   },this);
  this.lifes += 1;
  console.log("coffee hit");
  this.heart = this.add.image(this.game.canvas.width - 70, 40,'heart');
}
};
