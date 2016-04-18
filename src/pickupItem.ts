import ItemType = require("./itemType");
import Rectangle = require("./rectangle");
class PickupItem {
    
    width: number;
    height: number;    
    
    rect : Rectangle;
    
    constructor(public type: ItemType, public x: number, public y: number){
        switch (type){
            case ItemType.pickup:{
                this.width = 20;
                this.height = 20;
                break;
            }
        }
        
        this.rect = new Rectangle(this.x, this.y, this.x + this.width, this.y + this.height);
    }
    
}

export = PickupItem;
