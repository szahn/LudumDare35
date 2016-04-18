import Direction = require("./direction");
import Rectangle = require("./rectangle");
class Character {
    frame: number;
    frameX: number;
    frameY: number;
    spriteWidth: number;
    spriteHeight: number;
    speed: number;
    
    constructor(public facing: Direction, public x: number, public y: number, public width: number, public height: number){
        this.speed = 0;
        this.spriteWidth = width;
        this.spriteHeight = height;
        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;
    }
    
    rect(){
        return new Rectangle(this.x, this.y, this.x + this.width, this.y + this.height);
    }
}

export = Character;