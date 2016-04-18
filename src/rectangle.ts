class Rectangle{   
    constructor(public left: number, public top: number, public right: number, public bottom: number){
        
    }
    
    width(){        
        return (this.right || 0) - (this.left || 0);
    }
    
    height(){        
        return (this.bottom || 0) - (this.top || 0);
    }
    
    intersects(r : Rectangle) {
        return !(r.left > this.right || 
            r.right < this.left || 
            r.top > this.bottom ||
            r.bottom < this.top);
    }
    
    static empty(){
        return new Rectangle(0, 0, 0 ,0);
    }
}

export =  Rectangle;