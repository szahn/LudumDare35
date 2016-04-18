import State = require("./state");
import GameState = require("./gameState");
import Globals = require("./globals");
class GameLoop {
    static tick(dt : number){
        if (State.gameState !== GameState.Running){
            return;
        }
        
        State.player.tick(dt);
        this.centerCameraOnPlayer();

        const enemies = State.level.enemies;
        for (let enemy of enemies){
            enemy.tick(dt);
        }
        
        const projectiles = State.projectiles;
        for (let projectile of projectiles){
            projectile.tick(dt);
        }        
    }
    
    private static centerCameraOnPlayer(){
        const player = State.player;
        const cam = State.camera;
        cam.x = Math.min(State.level.playableArea.right - Globals.CANVAS_WIDTH,  Math.max(0, player.x - Globals.CANVAS_WIDTH_HALF));
        cam.y = Math.min(State.level.playableArea.bottom - Globals.CANVAS_HEIGHT, Math.max(0, player.y - Globals.CANVAS_HEIGHT_HALF));
    }
}

export = GameLoop;