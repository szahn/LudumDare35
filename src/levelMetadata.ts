import EnemyMetadata = require("./enemyMetadata");
interface LevelMetadata{
    tileSize: number;
    boundaries : number[][]
    area: number[];
    playerStart: number[]
    enemies: EnemyMetadata[]
}

export = LevelMetadata;