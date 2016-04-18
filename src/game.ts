/// <reference path="../typings/tsd.d.ts" />
import State = require("./state");
import Level = require("./level");
import LevelMetadata = require("./levelMetadata");
import Player = require("./player");
import CanvasRenderer = require("./canvasRenderer");
import Assets = require("./assets");
import Input = require("./input");
import Point = require("./point");
import GameState = require("./gameState");
class Game {
    renderer: CanvasRenderer;
    
    constructor(){
    }
    
    
    private loadLevels() : JQueryXHR{
        return $.get("data/levels.json");
    }    
   
    start(canvas : HTMLCanvasElement){
        Assets.preload();
        this.renderer = new CanvasRenderer(canvas.getContext('2d'), canvas.clientWidth, canvas.clientHeight);
        this.loadLevels().then((levels : LevelMetadata[]) => {
            State.levels = levels.slice(0);
            this.loadLevel(0);
            this.startRenderer();
            this.listenToInput();
            State.gameState = GameState.Running; 
        });
    }
    
    loadLevel(number: number){
        State.levelIndex = number;
        State.camera = new Point(0, 0);
        const level = new Level(State.levels[State.levelIndex]);        
        State.level = level;
        State.player = new Player(level.playerStart.x, level.playerStart.y);
    }
    
    listenToInput(){
        const input = new Input();
        window.onkeydown = input.onKeyDown.bind(input);
        window.onkeyup = input.onKeyUp.bind(input);
    }
    
    startRenderer(){
        requestAnimationFrame(this.renderer.render.bind(this.renderer));
    }
    
}

const ns: any = window;
export = ns.Game = Game;