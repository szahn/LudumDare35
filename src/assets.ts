
import AssetMap = require("./assetMap");
class Assets{
    private static images: AssetMap<HTMLImageElement> = {};    
    private static sounds: AssetMap<HTMLAudioElement> = {};    
       
    public static STUNNED : string = "stunned";
    public static PUNCH : string = "punch";
    public static ENEMY : string= "enemy";
    public static PLAYER : string= "player";
    public static LEVEL : string= "level";
    public static PICKUP : string= "pickup";
    public static THROW : string= "throw";
    public static ALERT : string= "alert";
    public static FAIL : string= "fail";
    public static GAME_OVER : string= "gameover";
    public static MESSAGES : string= "messages";
    public static SUCCESS : string= "success";

    static loadImage(id : string, filename: string){
        const image = new Image();
        image.onerror = ()=>{
            console.log(`${id} errored`);
        };
        
        image.onload = ()=>{
            console.log(`${id} loaded`);
        };
        
        image.src = filename;
        Assets.images[id] = image;
    }

    static loadSound(id : string, filename: string){
        const audio = new Audio();
        audio.onerror = ()=>{
            console.log(`${id} errored`);
        };
        
        audio.onload = ()=>{
            console.log(`${id} loaded`);
        };
        
        audio.src = filename;
        Assets.sounds[id] = audio;
    }
    
    static preload(){
        Assets.loadImage(Assets.PLAYER, "img/player.png");
        Assets.loadImage(Assets.ENEMY, "img/enemy.png");        
        Assets.loadImage(Assets.PICKUP, "img/pickup.png");        
        Assets.loadImage(Assets.ALERT, "img/alert.png");        
        Assets.loadImage(Assets.GAME_OVER, "img/gameover.png");
        Assets.loadImage(Assets.MESSAGES, "img/messages.png");
        Assets.loadImage(Assets.SUCCESS, "img/success.png");
        Assets.loadSound(Assets.PUNCH, "sfx/punch.mp3");
        Assets.loadSound(Assets.STUNNED, "sfx/stunned.mp3");
        Assets.loadSound(Assets.PICKUP, "sfx/pickup.mp3");
        Assets.loadSound(Assets.THROW, "sfx/throw.mp3");
        Assets.loadSound(Assets.ALERT, "sfx/alert.mp3");
        Assets.loadSound(Assets.FAIL, "sfx/fail.mp3");
        Assets.loadSound(Assets.SUCCESS, "sfx/success.mp3");
    }
    
    static getImage(id: string){
        return Assets.images[id];
    }
    
    static getSound(id: string){
        return Assets.sounds[id];
    }
    
    
}

export = Assets;