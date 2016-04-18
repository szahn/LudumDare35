import Level = require("./level");
import GameState = require("./gameState");
import Player = require("./player");
import Point = require("./point");
import Projectile = require("./projectile")
import Assets = require("./assets");
import GameOverReason = require("./gameOverReason")
import LevelMetadata = require("./levelMetadata");
class State {
    static level : Level;
    static player: Player;
    static camera : Point;
    static projectiles : Projectile[] = new Array<Projectile>();
    static gameState : GameState;
    static gameOverReason : GameOverReason;
    static pickupsRemaining : number;
    static levels : LevelMetadata[];
    static levelIndex: number;
    
    static isRunning(){
        return this.gameState === GameState.Running;
    }
    
    static isGameOver(){
        return this.gameState === GameState.GameOver;
    }
    
    static isSuccess(){
        return this.gameState === GameState.Success;
    }

    static endGame(reason : GameOverReason){
        if (this.gameState !== GameState.Running){
            return;
        }
        
        this.gameOverReason = reason;
        Assets.getSound(Assets.FAIL).play();
        this.gameState = GameState.GameOver;
    }
    
}

export = State;