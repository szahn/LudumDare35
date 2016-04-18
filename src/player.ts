import Character = require("./character");
import PlayerState = require("./playerState");
import State = require("./state");
import Rectangle = require("./rectangle");
import Direction = require("./direction");
import Assets = require("./assets");
import Projectile = require("./projectile");
import GameOverReason = require("./gameOverReason"); 
import Level = require("./level");
import GameState = require("./gameState");

class Player extends Character{
    state: PlayerState;
   
    public hunger: number;
    public health : number;
    public ammo: number;    
    
    constructor(x: number, y: number){
        super(Direction.south, x, y, 18, 19);
        this.reset();
    }
    
    public reset(){
        this.hunger = 40;
        this.health = 100;
        this.speed = 4;
        this.ammo = 0;
        this.width = 18;
        this.height = 19;
    }
        
    private intersects(nextX: number, nextY: number){
        const playerRect = new Rectangle(nextX, nextY, nextX + this.width, nextY + this.height);
        for (let boundary of State.level.boundaries){
            if (boundary.intersects(playerRect)){
                return true;
            }
        }
        return false;
    }

    private shrink(){
        this.x += 2;
        this.y += 2;
        this.width -= 4;
        this.height -=4;
        this.speed +=.25;
    }
    
    private expand(){
        this.x -= 2;
        this.y -= 2;
        this.width += 4;
        this.height +=4;
        this.speed -=.25;
    }
    
    private consumePickup(){
        this.expand();
        this.ammo +=1;
        this.hunger = Math.max(0, this.hunger - 15);        
        Assets.getSound(Assets.PICKUP).play();
        State.pickupsRemaining -=1;
        if (State.pickupsRemaining === 0){
            this.nextLevel();
        }
    }
    
    nextLevel(){
        const s = State;
        setTimeout(()=>{
            if (!s.isRunning()){
                return;
            }
            Assets.getSound(Assets.SUCCESS).play();
            s.gameState = GameState.Success;
            setTimeout(()=>{
                if (s.levelIndex < State.levels.length - 1){
                    s.levelIndex +=1;
                    const level = new Level(State.levels[State.levelIndex]);        
                    s.level = level;
                    s.player = new Player(level.playerStart.x, level.playerStart.y);
                    s.gameState = GameState.Running;
                }
            }, 1500);            
        }, 1000)
    }

    
    private testPickups(){
        const pickups = State.level.pickups;
        const playerRect = this.rect();
        
        for (let i = 0; i < pickups.length; i++){
            if (pickups[i].rect.intersects(playerRect)){
                pickups.splice(i,1);
                this.consumePickup();
                return;
            }
        }
    }
    
    private animateFrames(dt: number){
        this.frame += 1 * dt;
        if (this.frame > 5){
            this.frame = 0;
            if (this.frameY === 0){
                this.frameY = 36;                
            }
            else{
                this.frameY = 0;                
            }
        }
    }
    
    private walkEast(walkSpeed : number, boundary : number){
        this.facing = Direction.east;
        const nextX = this.x + walkSpeed;                
        if (nextX + this.width > boundary){
            return;
        }
        if (this.intersects(nextX, this.y)) {
            return;
        }
        this.x = nextX;
        this.testPickups();
    }

    private walkWest(walkSpeed, boundary: number){
        this.facing = Direction.west;
        const nextX = this.x - walkSpeed;
        if (nextX < boundary){
            return;
        }
        if (this.intersects(nextX, this.y)) {
            return;
        }
        this.x = nextX;
        this.testPickups();
    }
    
    private walkNorth(walkSpeed : number, boundary: number){
        this.facing = Direction.north;
        const nextY = this.y - walkSpeed;
        if (nextY < boundary){
            return;
        }
        if (this.intersects(this.x, nextY)) {
            return;
        }
        this.y = nextY;        
        this.testPickups();
    }
    
    private walkSouth(walkSpeed: number, boundary: number){
        this.facing = Direction.south;
        const nextY = this.y + walkSpeed;
        if (nextY + this.height > boundary){
            return;
        }
        if (this.intersects(this.x, nextY)) {
            return;
        }
        this.y = nextY;        
        this.testPickups();
    }
    
    private punch(){
        this.state = PlayerState.idle;
        Assets.getSound(Assets.PUNCH).play();
        const punchDist = 8
        const punchArea = (this.facing == Direction.north) ? new Rectangle(this.x, this.y - punchDist, this.x + this.width, this.y) : 
            (this.facing == Direction.east) ? new Rectangle(this.x + this.width, this.y, this.x + this.width +  punchDist, this.y + this.height) : 
            (this.facing == Direction.south) ? new Rectangle(this.x, this.y + this.height, this.x + this.width,this.y + this.height + punchDist) : 
            (this.facing == Direction.west) ? new Rectangle(this.x - punchDist, this.y, this.x, this.y + this.height) : Rectangle.empty();    
            
        const enemies = State.level.enemies;
        for (let enemy of enemies){
            if (enemy.isStunned()){continue;}
            if (enemy.rect().intersects(punchArea)){
                enemy.stun();
                return;
            }
        }                
    }
    
    private throw(){
        this.state = PlayerState.idle;
        if (this.ammo === 0) {
            return;
        }
        this.shrink();
        this.ammo -=1;
        let speedX = 0, speedY = 0;
        switch (this.facing){
            case Direction.north:{
                speedY = -4;
                break;
            }            
            case Direction.east:{
                speedX = 4;
                break;
            }            
            case Direction.south:{
                speedY = 4;
                break;
            }            
            case Direction.west:{
                speedX = -4;
                break;
            }            
        }
        State.projectiles.push(new Projectile(true, this.x + (this.width / 2) + speedX, this.y + (this.height / 2) + speedY, 6, 6, speedX, speedY, 25));
        Assets.getSound(Assets.THROW).play();
    }
    
    tick(dt : number){
        this.hunger =  Math.min(100, this.hunger + .16 * dt);
        if (this.hunger >= 100){
            this.health =  Math.max(0, this.health - .33 * dt);    
        }

        if (this.health <= 0){
            State.endGame(GameOverReason.LowHealth);
            return;
        }
        
        const playableArea = State.level.playableArea;
        switch (this.state){
            case PlayerState.walkingEast:{
                this.frameX = 35;
                this.animateFrames(dt);
                this.walkEast(this.speed * dt, playableArea.right);
                break;
            }
            case PlayerState.walkingWest:{
                this.frameX = 53;
                this.animateFrames(dt);
                this.walkWest(this.speed * dt, playableArea.left);
                break;
            }
            case PlayerState.walkingNorth:{
                this.frameX = 18;
                this.animateFrames(dt);
                this.walkNorth(this.speed * dt, playableArea.top);
                break;
            }
            case PlayerState.walkingSouth:{
                this.frameX = 0;
                this.animateFrames(dt);
                this.walkSouth(this.speed * dt, playableArea.bottom);
                break;
            }      
            case PlayerState.Throwing:{
                this.throw();
                break;
            }      
            case PlayerState.Punching:{
                this.punch();
                break;
            }      
            case PlayerState.idle:
            default:
            {
                this.frame = 0;
                this.frameY = 18;
            }      
        }
    }

}

export = Player;