import Point = require("./point");
import Enemy = require("./enemy");
import Rectangle = require("./rectangle");
import LevelMetadata = require("./levelMetadata");
import Assets = require("./assets");
import PickupItem = require("./pickupItem");
import Globals = require("./globals");
import EnemyMetadata = require("./enemyMetadata");
import State = require("./state");
class Level {    
    
    constructor(leveMetadata: LevelMetadata){
        this.loadLevelFromMetadata(leveMetadata);
    }
    
    private loadLevelFromMetadata(leveMetadata: LevelMetadata){
        const tileSize = Globals.TILE_SIZE;
        this.playerStart = new Point(leveMetadata.playerStart[0]* tileSize, leveMetadata.playerStart[1]* tileSize);
        this.playableArea = new Rectangle(leveMetadata.area[0], leveMetadata.area[1], leveMetadata.area[2], leveMetadata.area[3]);
        this.spawnBoundaries(leveMetadata.boundaries);
        this.spawnEnemies(leveMetadata.enemies);
        State.pickupsRemaining = leveMetadata.enemies.length;
        this.pickups = new Array();      
    }

    private spawnBoundaries(boundaries : number[][]){
        const tileSize = Globals.TILE_SIZE;
        this.boundaries = new Array();
        for (let boundary of boundaries){
            this.boundaries.push(new Rectangle(boundary[0]* tileSize, boundary[1]* tileSize, boundary[2]* tileSize, boundary[3]* tileSize)); 
        }        
    }
    
    private spawnEnemies(enemies : EnemyMetadata[]){
        const tileSize = Globals.TILE_SIZE;
        this.enemies = new Array();
        for (let enemyMeta of enemies){
            const enemyInstance = new Enemy(enemyMeta.type, enemyMeta.facing, enemyMeta.x * tileSize, enemyMeta.y* tileSize, enemyMeta.speed, enemyMeta.script);
            enemyInstance.stunDuration = enemyMeta.stunDuration || 3000;
            enemyInstance.scriptInterval = enemyMeta.scriptInterval || 3000;
            enemyInstance.viewDistance = enemyMeta.viewDistance || 10;
            this.enemies.push(enemyInstance);
        }
    }
    
    playerStart : Point;    
    enemies : Enemy[];
    playableArea: Rectangle;
    boundaries: Rectangle[];
    pickups: PickupItem[];
}

export = Level;