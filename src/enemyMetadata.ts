import EnemyType = require("./enemyType");
import Direction = require("./direction");
import EnemyState= require("./enemyState");
import EnemyScript = require("./enemyScript");
class EnemyMetadata {
    type : EnemyType;
    facing: Direction;
    state: EnemyState;
    script: EnemyScript;   
    x: number;
    y: number;
    speed: number;
    waypoints : number[];
    stunDuration: number;
    scriptInterval : number;
    viewDistance: number;
}

export = EnemyMetadata;