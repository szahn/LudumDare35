import State = require("./state");
import PlayerState = require("./playerState");
class Input {   
    private static LEFT = 37;
    private static UP = 38;
    private static RIGHT = 39;
    private static DOWN = 40;
    private static X = 88;
    
    public onKeyDown(ev: KeyboardEvent){
        if (!State.isRunning()){
            return;
        }
        
        switch (ev.keyCode){
            case Input.LEFT:{
                this.onLeft();
                break;
            }
            case Input.UP:{
                this.onUp();
                break;
            }
            case Input.RIGHT:{
                this.onRight();
                break;
            }
            case Input.DOWN:{
                this.onDown();
                break;
            }            
            case Input.X:{
                this.onAttack();
                break;
            }            
            default:{
                
            }
        }
    }
    
    public onKeyUp(ev: KeyboardEvent){
        State.player.state = PlayerState.idle;
    }
    
    private onAttack(){
        State.player.state = PlayerState.Punching;
    }
  
    private onDown(){
        State.player.state = PlayerState.walkingSouth;
    }
    
    private onUp(){
        State.player.state = PlayerState.walkingNorth;
    }
    
    private onLeft(){
        State.player.state = PlayerState.walkingWest;
    }
    
    private onRight(){
        State.player.state = PlayerState.walkingEast;
    }
    
}

export = Input;