import "phaser";

export class GameScene extends Phaser.Scene {
    ground : Phaser.Physics.Arcade.Image;
constructor() {
    super({
      key: "GameScene"
    });
  }

init(params): void {
    // TODO
  }
preload(): void {
    this.load.image('ground','../assets/ground.png');
  }
  
create(): void {
    this.physics.add.staticImage(400,550,'ground');
}

update(time): void {
    // TODO
  }
};