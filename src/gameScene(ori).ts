import "phaser";
import { Game } from "phaser";
import { TitleScene } from "./titleScene";

/* ###########################   MAIN GAME SCENE   #######################"""" */

export class GameScene extends Phaser.Scene {
  speed : number; // Changes every frame. Allows the acceleration of the game
  obstacles : Phaser.Physics.Arcade.Group; // Group of obstacles
  heart : Phaser.GameObjects.Image; // Image for the heart
  lifes : number; //Number of lifes
  coffee : Phaser.Physics.Arcade.Group; // Group for the coffees
  minSpawnTime : number;   //Min time between 2 obstacles
  factorSpawnTume : number; // Multîplying factor in front of the random (for spawning)
  lastSpawnTime : number; //stores the time the last obstacle has been created
  timeTilSpawn : number; // time til next obstacle is created
  timerJump : number; // Allows the player to gauge their jump
  ground: Phaser.Physics.Arcade.StaticGroup; // Physical ground object
  groundTexture: Phaser.GameObjects.TileSprite; // Ground, but only texture (need for the scrolling)
  info: Phaser.GameObjects.Text; // Text
  score: number; // stores the current score (not best)
  ppa: Phaser.Physics.Arcade.Sprite; // Player's object
  spaceKey: Phaser.Input.Keyboard.Key; // object representing the space key
  downKey: Phaser.Input.Keyboard.Key; // object representing the down key
  animWalk: Phaser.Animations.Animation | boolean; // Animation object for the player
  backgrTreesMid: Phaser.GameObjects.TileSprite; // Parralax layer
  backgrTreesBack: Phaser.GameObjects.TileSprite; // Parralax layer
  backgrTreesFront: Phaser.GameObjects.TileSprite; // Parralax layer
  backgrLight: Phaser.GameObjects.TileSprite; // Parralax layer
  arrayObstacles : Array<string>; //Array containing images for the different obstacles
  previousScore : number; //best score yet
  isJumping : boolean; // used for gauging jumps
  constructor() {
    super({
      key: "GameScene"
    });
  }

  init(params): void {
    this.isJumping = false;
    this.minSpawnTime = 1000; // at start, 1 sec min between enemies
    this.factorSpawnTume = 2000;
    this.speed = 0; // no added speed
    this.timeTilSpawn = Math.random()*2000 + 2000;
    this.lifes = 0;
    this.score = 0;
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.arrayObstacles = ['obs1','obs2']; // here to add different obstacles

    if (params.hasOwnProperty('previousScore')){ //load best score from GameOverScene (if exists)
      this.previousScore = params.previousScore;
    }
    else{
      this.previousScore = 0;
    }
  }

  preload(): void { //loading images and audio
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
    this.load.audio('jump','../assets/jump.wav');
    this.load.audio('coffeeSound','../assets/coffee.wav');
    this.load.audio('impact','../assets/impact.wav');
    this.load.audio('mainSound','../assets/bgSoundMain.mp3');
  }

  create(): void {

    this.ground = this.physics.add.staticGroup(); //creating physics ground (not seen on screen, behind bg)
    this.ground.create(400, 275, 'ground');
    this.sound.play('mainSound',{volume : 0.2, loop : true});

    // all the blocs after that are and before the next comment are for the bg creation

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

      // Adding ground texture (this one is visible and scrolling, only texture)

    this.groundTexture = this.add.tileSprite(400,
      275,
      this.textures.get('ground').getSourceImage().width,
      this.textures.get('ground').getSourceImage().height,
      'ground');

    this.ppa = this.physics.add.sprite(200, 200, 'ppa', 8); // Creating character

    const config: Phaser.Types.Animations.Animation = { // config of the animation object
      key: 'walk',
      frames: this.anims.generateFrameNames('ppa', { start: 9, end: 11 }),
      repeat: -1,
      frameRate: 5,
    };

    this.animWalk = this.anims.create(config); // creation of the animation for te character

    this.ppa.anims.play('walk');
    this.ppa.setGravityY(1200); // set gravity for the character
    this.physics.add.collider(this.ppa, this.ground); // add collider between ground (physics) and character
    this.ppa.setSize(28,45); // collider size for the character

    this.info = this.add.text(10, 10, 'Course du PPA ! Score : ' + this.score.toString()+ '                Best Score : ' + this.previousScore.toString(),
    { font: '24px Arial Bold', fill: '#FBFBAC' });

    this.obstacles = this.physics.add.group({velocityX : -250}); //Creation on obstacles' group
    this.obstacles.create(this.game.canvas.width - 50 , 220, 'obs1'); // create first obstacle
    this.lastSpawnTime = this.game.getTime(); 
    this.physics.add.collider(this.ppa,this.obstacles,this.collide,null,this); // add collider beteween obstacles and player

    this.coffee = this.physics.add.group({ // config for the coffee group
      setScale : {x : 2, y : 2},
      allowGravity: false,
      velocityX : -250,
  });
  }

  update(time): void {
    var currentTime  : number = this.game.getTime(); // used to know the time to spawn
    this.score += 1; // increment score

    if (this.speed < 250){ // acceleration of game up to a certain speed
      this.speed -= 0.07;
      this.factorSpawnTume -= 0.2; // diminish the time obstacles spawn (otherwise the game is too easy at the end)
      this.minSpawnTime -= 0.05;
    }

    this.obstacles.setVelocityX(-200 + this.speed); // update of speed for obstacles and coffee group 
    this.coffee.setVelocityX(-200 + this.speed);

    this.physics.overlap(this.coffee,this.ppa,this.getCoffee,null,this); // event listener overlap character and coffee

    this.info.destroy();
    this.info = this.add.text(10, 10, 'Course du PPA ! Score : ' + this.score.toString() + '                Best Score : ' + this.previousScore.toString(),
    { font: '24px Arial Bold', fill: '#FBFBAC' }); //update text


    if ((currentTime - this.lastSpawnTime) > this.timeTilSpawn && (this.score < 180 || this.score > 220)){ //spawn obsatacles if time ok
      let randomObstacles : number = (Math.random()*2 - 0.000);
      randomObstacles = Math.floor(randomObstacles); // generate random number to choose between obstacles frames
      this.obstacles.create(this.game.canvas.width + 50, 220, this.arrayObstacles[randomObstacles]); // create obstacle
      this.lastSpawnTime = this.game.getTime();
      this.timeTilSpawn = Math.random()*this.factorSpawnTume + this.minSpawnTime;
    }

    if (this.score == 200){ // create coffee
      this.coffee.create(this.game.canvas.width + 50, 150,'coffee',3);
    }

    if (this.spaceKey.isDown && this.ppa.body.touching.down) { // jump config
        this.ppa.setVelocityY(-400);
        this.sound.play('jump',{volume : 0.2});
        this.ppa.anims.pause(this.ppa.anims.currentFrame); // stops animation while jumping
        this.time.addEvent({ delay: 225, callback: this.timerEnded, callbackScope: this}); // add timer to allow the player to gauge their jump for 225 ms by keeping space key down
        this.isJumping = true;
    }
    else if (this.spaceKey.isDown && this.ppa.body.gravity.y >= 800 && this.isJumping === true){ // if space key still down and delay has not passed, jump is higher
      this.ppa.setVelocityY(-400);
   }

   else if (this.ppa.body.touching.down && this.ppa.anims.isPaused){ // restart animation after end of jump
     console.log("animation restart");
     this.ppa.anims.restart();
   }


    this.obstacles.getChildren().forEach((child) => { //destroy obstacles that are out of the canvas
     if  (child.body.position.x < 0){
       child.destroy();
     }
    },this)

    this.backgrLight.tilePositionX += 0.5; //Parallax and ground scrolling
    this.backgrTreesMid.tilePositionX += 0.5;
    this.backgrTreesFront.tilePositionX += 2;
    this.backgrTreesBack.tilePositionX += 0.25;
    this.groundTexture.tilePositionX += 2;
  }

  collide() : void { // method called when obstacle collide with character
    if (this.lifes > 0){ // if lifes remaining, destroy obstacle and decrement lifes
      this.obstacles.getChildren().forEach((child) => {
        child.destroy();
       },this)
      this.lifes-= 1;
      this.ppa.setVelocityX(0);
      this.heart.destroy();
    }
    else{ //else, end game and go the GameOverScene
      this.scene.start('GameOverScene', {score : this.score, bestScore : this.previousScore});
      this.sound.stopAll();
    }
    this.sound.play('impact'); // play sound
  }


getCoffee(){ // method called when overlap coffee and character
  this.coffee.getChildren().forEach((child) => { // destroy coffee
    child.destroy();
   },this);
  this.lifes += 1; // add life
  console.log("coffee hit");
  this.heart = this.add.image(this.game.canvas.width - 70, 60,'heart'); // add heart
  this.sound.play('coffeeSound');
}

timerEnded(){ // eventTimer for jump (delay)
  this.isJumping = false;
}
};
