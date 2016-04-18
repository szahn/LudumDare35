import Assets = require("./assets");
import State = require("./state");
import GameLoop = require("./gameLoop");
import EnemyState = require("./enemyState");
import ItemType = require("./itemType"); 
import GameOverReason = require("./gameOverReason");
class CanvasRenderer {  
    private time: any;
    private fontSize =16;
    
    constructor(private context2D : CanvasRenderingContext2D, private width : number, private height : number){
        this.setup();
    }

    private beforeRender(){
        var now = new Date().getTime();
        var dt = now - (this.time || now);
        this.time = now;
        GameLoop.tick(dt / 60);
    }
    
    setup(){
        const ctx : any = this.context2D;
        ctx.font = `bold ${this.fontSize}px Arial`;
        if ('imageSmoothingEnabled' in ctx){
            ctx.imageSmoothingEnabled = false;
        }
    }
   
    render() {
        requestAnimationFrame(this.render.bind(this));       
        this.beforeRender();
        const ctx = this.context2D;
        ctx.fillStyle = "#ddd";
        ctx.fillRect(0, 0, this.width, this.height);
        this.renderBoundaries();
        this.renderItems();
        this.renderProjectiles();
        this.renderEnemies();
        this.renderPlayer();
        this.renderUI();
    }        
   
    private renderPlayer(){
        const ctx = this.context2D;
        const cam = State.camera;
        const player = State.player;
        ctx.drawImage(Assets.getImage(Assets.PLAYER), player.frameX, player.frameY, player.spriteWidth, player.spriteHeight, 
            player.x - cam.x, player.y - cam.y, player.width, player.height);     
    }

    private renderEnemies(){
        const ctx = this.context2D;
        const cam = State.camera;
        const enemies = State.level.enemies;
        const enemyImg = Assets.getImage(Assets.ENEMY);
        const alertImg = Assets.getImage(Assets.ALERT);
        for (let enemy of enemies){            
            const eX = enemy.x - cam.x;
            const eY = enemy.y - cam.y;
            ctx.drawImage(enemyImg, enemy.frameX, enemy.frameY, enemy.spriteWidth, enemy.spriteHeight, 
                eX, eY, enemy.width, enemy.height);     
                if (enemy.playerDetectionMeter > 0){                    
                    const perc = enemy.playerDetectionMeter / 100;
                    let frame = 1;
                    if (perc < .25){
                        frame = 1;
                    }
                    else if(perc < .5){
                         frame = 9;
                    }
                    else{
                        frame = 17;
                    }
                    ctx.drawImage(alertImg, frame, 0, 7, 15, eX + 6, eY - 18, 7, 15);     
                }
        }
    }
    
    renderItems(){
        function imageForType(type : ItemType){
            switch(type){
                case ItemType.pickup:{
                    return Assets.getImage(Assets.PICKUP);
                }
            }            
        }
        
        const ctx = this.context2D;
        const cam = State.camera;
        const items = State.level.pickups;
        for (let item of items){
            ctx.drawImage(imageForType(item.type), item.x - cam.x, item.y - cam.y);     
        }
    }
    
    private renderBoundaries(){
        const ctx = this.context2D;
        const cam = State.camera;
        const boundaries = State.level.boundaries;
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#333";
        ctx.fillStyle = "#666";
        for (let boundary of boundaries){
            ctx.fillRect(boundary.left - cam.x, boundary.top - cam.y, boundary.width(), boundary.height());
            ctx.strokeRect(boundary.left - cam.x, boundary.top - cam.y, boundary.width(), boundary.height());
        }   
    }
    
    private renderProjectiles(){
        const ctx = this.context2D;
        const cam = State.camera;
        const projectiles = State.projectiles;
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#aa0";
        ctx.fillStyle = "#aa0";
        const rad = 2 * Math.PI;
        for (let i  = 0; i < projectiles.length; i++){
            const proj = projectiles[i];
            if (proj.shouldGc) {continue;}
            ctx.beginPath();
            ctx.arc(proj.x - cam.x, proj.y - cam.y, proj.width, 0, rad);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }
    
    private renderUI(){
        const ctx = this.context2D;
        const player = State.player;
        if (State.isRunning()){
            ctx.strokeStyle = "#000";
            ctx.fillStyle = "#000";
            ctx.fillText(`Hunger ${Math.round(player.hunger)}`, 10, this.fontSize);        
            ctx.fillText(`HP ${Math.round(player.health)}`, this.width - 60, this.fontSize);   
            ctx.fillText(`${State.pickupsRemaining}`, this.width - 40, 10 + (this.fontSize * 2));                    
        }
        else if(State.isGameOver()){
            this.drawBlackOverlay();
            ctx.drawImage(Assets.getImage(Assets.GAME_OVER), 320 - 160, 240 - 72);
            let mY = 0;
            if (State.gameOverReason == GameOverReason.LowHealth){
                mY = 0;
            }
            else if (State.gameOverReason == GameOverReason.SeenByEnemy){
                mY = 22;
            }
            ctx.drawImage(Assets.getImage(Assets.MESSAGES),0,mY,320,22, 320 - 160, 240 - 72 + 100, 320, 22);        
        }
        else if(State.isSuccess()){
            this.drawBlackOverlay();
            ctx.drawImage(Assets.getImage(Assets.SUCCESS), 320 - 160, 240 - 50);
        }
    }
    
    private drawBlackOverlay(){
        const ctx = this.context2D;
        ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
        ctx.fillRect(0, 0, 640, 480);
    }
    
}

export = CanvasRenderer;