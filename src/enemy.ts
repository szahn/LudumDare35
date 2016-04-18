import Character = require("./character");
import EnemyType = require("./enemyType");
import Direction = require("./direction");
import EnemyState= require("./enemyState");
import EnemyScript = require("./enemyScript");
import Assets = require("./assets");
import State = require("./state");
import PickupItem = require("./pickupItem");
import ItemType = require("./itemType");
import Globals = require("./globals");
import Rectangle = require("./rectangle");
import GameOverReason = require("./gameOverReason"); 
class Enemy extends Character {
    state: EnemyState;
    stunDuration: number;
    scriptInterval : number;
    scriptTicker: number = 0;
    viewDistance: number;
    playerDetectionMeter : number = 0;
    hasPickup: boolean = true;
    
    constructor(public type: EnemyType, facing: Direction, x: number, y: number, speed: number, private script : EnemyScript){
        super(facing, x, y, 18, 19);        
        this.state = EnemyState.idle;
        switch (type){
            case EnemyType.pizzaDeliveryMan: {
                this.width = 18;
                this.height = 19;
            }
            
        }
        this.speed = speed;
    }
    
    isStunned(){
        return this.state === EnemyState.stunned;
    }
    
    stun(){
        this.playerDetectionMeter = 0;
        this.state = EnemyState.stunned;
        Assets.getSound(Assets.STUNNED).play();        
        const x = this.x - (Math.random() * 10) + (Math.random() * 10);
        const y = this.y - (Math.random() * 10) + (Math.random() * 10);
        if (this.hasPickup){
            this.hasPickup = false;
            State.level.pickups.push(new PickupItem(ItemType.pickup, x,y));
        }
        setTimeout(this.awake.bind(this), this.stunDuration);
    }
    
    private awake(){
        this.state = EnemyState.idle;        
        const diffX = State.player.x - this.x;
        const diffY = State.player.y - this.y;
        this.playerDetectionMeter = 25;
        if (Math.abs(diffX) > Math.abs(diffY)){
            if (diffX >= 1){
                this.facing = Direction.east;
            }
            else if (diffX <= -1){
                this.facing = Direction.west;
            }
        }
        else{
            if (diffY >= 1){
                this.facing = Direction.south;
            }
            else if (diffY <= -1){
                this.facing = Direction.north;
            }
        }
    }
    
    private doScript(){
        switch (this.script){
            case EnemyScript.guard:{
                this.facing += 1;
                if (this.facing > 3){
                    this.facing = 0;
                }
                break;
            }
            case EnemyScript.wander:{
                break;
            }
            case EnemyScript.followWaypoints:{
                
                break;
            }
            case EnemyScript.findAndAttackPlayer:{
                
                break;
            }
        }
    }
    
    private setFrames(){
        switch (this.facing){
            case Direction.north:{
                this.frameX = 18;
                break;
            }
            case Direction.east:{
                this.frameX = 35;
                break;
            }
            case Direction.south:{
                this.frameX = 0;
                break;
            }
            case Direction.west:{
                this.frameX = 53;
                break;
            }
        }

        switch (this.state){
            case EnemyState.idle: {
                this.frameY = 18;
                break;
            }
            case EnemyState.stunned: {
                this.frameX = 72;
                this.frameY = 0;
                break;
            }
        }
    }
    
    private detectPlayer(){
        const eX = this.x  / Globals.TILE_SIZE;
        const eY = this.y  / Globals.TILE_SIZE;
        const boundaries = State.level.boundaries;
        let minX = 0;
        let maxX = 0;
        let maxY = 0;
        let minY = 0;
        let dY = 0;
        let dx = 0;
        const pad = 0;

        switch (this.facing){
            case Direction.north:{
                minX = eX - this.viewDistance;
                maxX = eX + this.viewDistance;
                maxY = eY;
                minY = State.level.playableArea.top / Globals.TILE_SIZE;
                dY = -1;
                dx = 1;
                for (let gY = maxY; gY  > minY; gY += dY){
                    const top = gY *Globals.TILE_SIZE;
                    const r = new Rectangle(this.x - pad, top, this.x + this.width + (pad * 2), top + Globals.TILE_SIZE)
                    let intersects = false;
                    for(let b of boundaries){
                        if (b.intersects(r)){
                            intersects = true;
                            break;
                        }
                    }
                    if (intersects){
                        break;
                    }
                    if (State.player.rect().intersects(r)){
                        return true;
                    }
                }
                break;
            }
            case Direction.east:{
                minX = eX;
                maxX = State.level.playableArea.right / Globals.TILE_SIZE;
                dY = 1;
                dx = 1;
                for (let gX = minX; gX < maxX; gX += dx){
                    let intersects = false;
                    const left = gX * Globals.TILE_SIZE;
                    const r = new Rectangle(left, this.y - pad, left + Globals.TILE_SIZE, this.y + this.height + (pad * 2))
                    for(let b of boundaries){
                        if (b.intersects(r)){
                            intersects = true;
                            break;
                        }
                    }
                       
                    if (intersects){
                        break;
                    }

                    if (State.player.rect().intersects(r)){
                        return true;
                    }
                }
                break;
            }
            case Direction.south:{
                minX = eX - this.viewDistance;
                maxX = eX + this.viewDistance;
                minY = eY;
                maxY = State.level.playableArea.bottom / Globals.TILE_SIZE;
                dY = 1;
                dx = 1;
                for (let gY = minY; gY < maxY; gY += dY){
                    const top = gY *Globals.TILE_SIZE;
                    const r = new Rectangle(this.x - pad, top, this.x  + this.width + (pad * 2), top + Globals.TILE_SIZE)

                    let intersects = false;
                    for(let b of boundaries){
                        if (b.intersects(r)){
                            intersects = true;
                            break;
                        }
                    }

                    if (intersects){
                        break;
                    }

                    if (State.player.rect().intersects(r)){
                        return true;
                    }

                }
                break;
            }
            case Direction.west:{
                minX = State.level.playableArea.left / Globals.TILE_SIZE;
                maxX = eX;
                minY = eY - this.viewDistance;
                maxY = eY + this.viewDistance;
                dY = 1;
                dx = -1;
                for (let gX = maxX; gX > minX; gX += dx){
                    const left = gX * Globals.TILE_SIZE;
                    const r = new Rectangle(left, this.y - pad, left + Globals.TILE_SIZE, this.y + this.height + (pad * 2))
                    let intersects = false;
                    for(let b of boundaries){
                        if (b.intersects(r)){
                            intersects = true;
                            break;
                        }
                    }

                    if (intersects){
                        break;
                    }
                    
                    if (State.player.rect().intersects(r)){
                        return true;
                    }

                }
                break;
            }
            default:{
                return false;
            }
        }
        
        return false;
    }
    
    tick(dt: number){
        this.scriptTicker += 1 * dt;
        if (this.scriptTicker > this.scriptInterval){
            this.scriptTicker = 0;
            this.doScript();
        }
        
        if (this.state !== EnemyState.stunned && this.detectPlayer()){
            if (this.playerDetectionMeter === 0){
                Assets.getSound(Assets.ALERT).play();
            }
            
            this.playerDetectionMeter = Math.min(100, this.playerDetectionMeter + 3 * dt);
            if (this.playerDetectionMeter >= 100){
                State.endGame(GameOverReason.SeenByEnemy);
            }
        }
        else{
            if (this.playerDetectionMeter > 0){
                this.playerDetectionMeter = Math.max(0, this.playerDetectionMeter - .5 * dt);
            }
        }
        
        this.setFrames();        
    }
}

export = Enemy;