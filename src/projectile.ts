import Rectangle = require("./rectangle");
import State = require("./state");
class Projectile{   
    public shouldGc : boolean = false;
    constructor(private isFromPlayer: boolean, public x: number, public y: number, public width: number,public  height: number,private  speedX: number, private speedY: number, private timeToLive:number){
        
    }
    
    tick(dt: number){
        if (this.shouldGc){
            return;
        }
        
        this.timeToLive -= .1 * dt;
        if (this.timeToLive < 0){
            this.shouldGc = true;
            return;
        }
        
        this.x += this.speedX;
        this.y += this.speedY;
        const rect = new Rectangle(this.x, this.y, this.x + this.width, this.y + this.height);        
        const boundaries = State.level.boundaries;
        for (let boundary of boundaries){
            if (boundary.intersects(rect)){
                this.shouldGc = true;
                return;
            }
        }

        if (this.isFromPlayer){
            const enemies = State.level.enemies;
            for (let enemy of enemies){
                if (enemy.rect().intersects(rect)){
                    enemy.stun();
                    this.shouldGc = true;
                    return;
                }
            }
        }
        
        if (!this.isFromPlayer){
            const player = State.player;
            if (player.rect().intersects(rect)){
                this.shouldGc = true;
                return;
            }
        }
        
    }
}

export = Projectile;