import "phaser";
import { Game } from "phaser";
import { TitleScene } from "./titleScene";

/* ###########################   MAIN GAME SCENE   #######################"""" */

export class GameScene extends Phaser.Scene {
  speed: number; // Changes every frame. Allows the acceleration of the game
  beers: Phaser.Physics.Arcade.Group; // Group of obstacles
  multis: Phaser.Physics.Arcade.Group;
  math: Phaser.Physics.Arcade.Group;;
  chimies: Phaser.Physics.Arcade.Group;
  calcs: Phaser.Physics.Arcade.Group;
  heart: Phaser.GameObjects.Image; // Image for the heart
  lifes: number; //Number of lifes
  coffee: Phaser.Physics.Arcade.Group; // Group for the coffees
  minSpawnTime: number;   //Min time between 2 obstacles
  factorSpawnTume: number; // Multîplying factor in front of the random (for spawning)
  lastSpawnTime: number; //stores the time the last obstacle has been created
  timeTilSpawn: number; // time til next obstacle is created
  timerJump: number; // Allows the player to gauge their jump
  ground: Phaser.Physics.Arcade.StaticGroup; // Physical ground object
  info: Phaser.GameObjects.BitmapText; // Text
  bestscoreText: Phaser.GameObjects.BitmapText; // Text
  score: number; // stores the current score (not best)
  ppa: Phaser.Physics.Arcade.Sprite; // Player's object
  spaceKey: Phaser.Input.Keyboard.Key; // object representing the space key
  downKey: Phaser.Input.Keyboard.Key; // object representing the down key
  animWalk: Phaser.Animations.Animation | boolean; // Animation object for the player
  background: Phaser.GameObjects.TileSprite; //bg
  arrayObstacles: Array<string>; //Array containing images for the different obstacles
  previousScore: number; //best score yet
  isJumping: boolean; // used for gauging jumps
  soundControl: Phaser.Physics.Arcade.Sprite;
  isSoundOn: boolean;
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
    this.timeTilSpawn = Math.random() * 2000 + 2000;
    this.lifes = 0;
    this.score = 0;
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.arrayObstacles = ['beer', 'chimie', 'multi', 'calc', 'math']; // here to add different obstacles
    this.isSoundOn = params.isSoundOn;

    if (params.hasOwnProperty('previousScore')) { //load best score from GameOverScene (if exists)
      this.previousScore = params.previousScore;
    }
    else {
      this.previousScore = 0;
    }
  }

  preload(): void { //loading images and audio
    this.load.image('beer', '../assets/biere.png');
    this.load.image('multi', '../assets/multimetre.png');
    this.load.image('calc', '../assets/calculatrice.png');
    this.load.image('math', '../assets/math0.png');
    this.load.image('chimie', '../assets/chimie.png');
    this.load.image('backgr', '../assets/bg.png');
    this.load.image('heart', '../assets/heart.png');
    this.load.spritesheet('ppa', '../assets/ppablouse.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('coffee', '../assets/Coffee.png', { frameWidth: 24, frameHeight: 24 });
    this.load.audio('jump', '../assets/jump.wav');
    this.load.audio('coffeeSound', '../assets/coffee.mp3');
    this.load.audio('impact', '../assets/impact.mp3');
    this.load.audio('mainSound', '../assets/bgSoundMain.mp3');
    this.load.bitmapFont('myfont', '../assets/font.png', '../assets/font.fnt');
    this.load.image('soundOn', '../assets/musicOn.png');
    this.load.image('soundOff', '../assets/musicOff.png');
  }

  create(): void {
    this.sound.play('mainSound');
    this.ground = this.physics.add.staticGroup(); //creating physics ground (not seen on screen, behind bg)
    this.ground.create(400, 300, 'ground');

    // all the blocs after that are and before the next comment are for the bg creation
    this.background = this.add.tileSprite(this.cameras.main.centerX,
      this.cameras.main.centerY,
      this.game.canvas.width,
      this.textures.get('backgr').getSourceImage().height,
      'backgr').setScale(1, (this.cameras.main.height / this.textures.get('backgr').getSourceImage().height));


    this.ppa = this.physics.add.sprite(200, 200, 'ppa', 8); // Creating character

    const config: Phaser.Types.Animations.Animation = { // config of the animation object
      key: 'walk',
      frames: this.anims.generateFrameNames('ppa', { start: 9, end: 11 }),
      repeat: -1,
      frameRate: 5,
    };

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
        this.sound.play('mainSound');
        this.soundControl.setTexture('soundOn');
      }
    });

    this.animWalk = this.anims.create(config); // creation of the animation for te character

    this.ppa.anims.play('walk');
    this.ppa.setGravityY(1200); // set gravity for the character
    this.physics.add.collider(this.ppa, this.ground); // add collider between ground (physics) and character
    this.ppa.setSize(28, 45); // collider size for the character

    this.info = this.add.bitmapText(10, 10, 'myfont', 'SCORE : ' + this.score.toString());
    this.bestscoreText = this.add.bitmapText(350, 10, 'myfont', 'BEST SCORE : ' + this.previousScore.toString());
    this.lastSpawnTime = this.game.getTime();

    this.beers = this.physics.add.group({ velocityX: -250 }); //Creation on obstacles' group
    this.beers.create(this.game.canvas.width - 50, 245, 'beer'); // create first obstacle
    this.physics.add.collider(this.ppa, this.beers, this.collide, null, this); // add collider beteween obstacles and player


    this.multis = this.physics.add.group({ velocityX: -250 }); //Creation on obstacles' group
    this.physics.add.collider(this.ppa, this.multis, this.collide, null, this); // add collider beteween obstacles and player

    this.calcs = this.physics.add.group({ velocityX: -250 }); //Creation on obstacles' group
    this.physics.add.collider(this.ppa, this.calcs, this.collide, null, this); // add collider beteween obstacles and player

    this.chimies = this.physics.add.group({ velocityX: -250 }); //Creation on obstacles' group
    this.physics.add.collider(this.ppa, this.chimies, this.collide, null, this); // add collider beteween obstacles and player

    this.math = this.physics.add.group({ velocityX: -250 }); //Creation on obstacles' group
    this.physics.add.collider(this.ppa, this.math, this.collide, null, this); // add collider beteween obstacles and player



    this.coffee = this.physics.add.group({ // config for the coffee group
      setScale: { x: 2, y: 2 },
      allowGravity: false,
      velocityX: -250,
    });
  }

  update(time): void {
    var currentTime: number = this.game.getTime(); // used to know the time to spawn
    this.score += 1; // increment score

    if (this.speed < 220) { // acceleration of game up to a certain speed
      this.speed -= 0.07;
      this.factorSpawnTume -= 0.15; // diminish the time obstacles spawn (otherwise the game is too easy at the end)
      this.minSpawnTime -= 0.04;
    }

    this.beers.setVelocityX(-200 + this.speed); // update of speed for obstacles and coffee group 
    this.calcs.setVelocityX(-200 + this.speed); // update of speed for obstacles and coffee group 
    this.multis.setVelocityX(-200 + this.speed); // update of speed for obstacles and coffee group 
    this.math.setVelocityX(-200 + this.speed); // update of speed for obstacles and coffee group 
    this.chimies.setVelocityX(-200 + this.speed); // update of speed for obstacles and coffee group 
    this.coffee.setVelocityX(-200 + this.speed);

    this.physics.overlap(this.coffee, this.ppa, this.getCoffee, null, this); // event listener overlap character and coffee

    this.info.destroy();
    this.info = this.add.bitmapText(10, 10, 'myfont', 'SCORE : ' + this.score.toString());


    if ((currentTime - this.lastSpawnTime) > this.timeTilSpawn && (this.score < 180 || this.score > 220)) { //spawn obsatacles if time ok
      let randomObstacles: number = (Math.random() * 5);
      randomObstacles = Math.floor(randomObstacles); // generate random number to choose between obstacles frames
      switch (randomObstacles) {  // Create obstacle depending on random number
        case 0: {
          this.beers.create(this.game.canvas.width + 50, 245, 'beer');
          break;
        }
        case 1: {
          this.multis.create(this.game.canvas.width + 50, 245, 'multi');
          break;
        }
        case 2: {
          this.chimies.create(this.game.canvas.width + 50, 245, 'chimie');
          break;
        }
        case 3: {
          this.math.create(this.game.canvas.width + 50, 245, 'math');
          break;
        }
        case 4: {
          this.calcs.create(this.game.canvas.width + 50, 245, 'calc');
          break;
        }
      }
      this.lastSpawnTime = this.game.getTime();
      this.timeTilSpawn = Math.random() * this.factorSpawnTume + this.minSpawnTime;
    }

    if (this.score == 200) { // create coffee
      this.coffee.create(this.game.canvas.width + 50, 150, 'coffee', 3);
    }

    if (this.spaceKey.isDown && this.ppa.body.touching.down) { // jump config
      this.ppa.setVelocityY(-420);
      if (this.isSoundOn) {
        this.sound.play('jump', { volume: 0.2 });
      }
      this.ppa.anims.pause(this.ppa.anims.currentFrame); // stops animation while jumping
      this.time.addEvent({ delay: 225, callback: this.timerEnded, callbackScope: this }); // add timer to allow the player to gauge their jump for 225 ms by keeping space key down
      this.isJumping = true;
    }
    else if (this.spaceKey.isDown && this.ppa.body.gravity.y >= 800 && this.isJumping === true) { // if space key still down and delay has not passed, jump is higher
      this.ppa.setVelocityY(-420);
    }

    else if (this.ppa.body.touching.down && this.ppa.anims.isPaused) { // restart animation after end of jump
      console.log("animation restart");
      this.ppa.anims.restart();
    }


    this.beers.getChildren().forEach((child) => { //destroy obstacles that are out of the canvas
      if (child.body.position.x < 0) {
        child.destroy();
      }
    }, this)
    this.multis.getChildren().forEach((child) => { //destroy obstacles that are out of the canvas
      if (child.body.position.x < 0) {
        child.destroy();
      }
    }, this)
    this.calcs.getChildren().forEach((child) => { //destroy obstacles that are out of the canvas
      if (child.body.position.x < 0) {
        child.destroy();
      }
    }, this)
    this.math.getChildren().forEach((child) => { //destroy obstacles that are out of the canvas
      if (child.body.position.x < 0) {
        child.destroy();
      }
    }, this)
    this.chimies.getChildren().forEach((child) => { //destroy obstacles that are out of the canvas
      if (child.body.position.x < 0) {
        child.destroy();
      }
    }, this)

    this.soundControl.on('pointerover', () => { // hover effect on music controller
      this.soundControl.setScale(1.2, 1.2);
    })

    this.soundControl.on('pointerout', () => {
      this.soundControl.setScale(1, 1);
    })


    this.background.tilePositionX += 2; //Parallax and ground scrolling
  }

  collide(): void { // method called when obstacle collide with character
    if (this.isSoundOn) {
      this.sound.play('impact'); // play sound
    }
    if (this.lifes > 0) { // if lifes remaining, destroy obstacle and decrement lifes
      this.beers.getChildren().forEach((child) => { //destroy obstacles that are out of the canvas
        child.destroy();
      }, this);
      this.multis.getChildren().forEach((child) => { //destroy obstacles that are out of the canvas
        child.destroy();
      }, this)
      this.calcs.getChildren().forEach((child) => { //destroy obstacles that are out of the canvas
        child.destroy();
      }, this);
      this.math.getChildren().forEach((child) => { //destroy obstacles that are out of the canvas
        child.destroy();
      }, this);
      this.chimies.getChildren().forEach((child) => { //destroy obstacles that are out of the canvas
        child.destroy();
      }, this);
      this.lifes -= 1;
      this.ppa.setVelocityX(0);
      this.heart.destroy();
    }
    else { //else, end game and go the GameOverScene
      this.sound.removeAll();
      this.scene.start('GameOverScene', { score: this.score, bestScore: this.previousScore, isSoundOn: this.isSoundOn });
    }
  }


  getCoffee() { // method called when overlap coffee and character
    this.coffee.getChildren().forEach((child) => { // destroy coffee
      child.destroy();
    }, this);
    this.lifes += 1; // add life
    this.heart = this.add.image(this.game.canvas.width - 70, 30, 'heart'); // add heart
    if (this.isSoundOn) {
      this.sound.play('coffeeSound');
    }
  }

  timerEnded() { // eventTimer for jump (delay)
    this.isJumping = false;
  }
};
