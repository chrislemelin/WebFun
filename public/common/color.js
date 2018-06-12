class Color{
    constructor(newR, newG, newB, newA = 255)
    {
        this.r = newR;
        this.g = newG;
        this.b = newB;
        this.a = newA;
    }

    toString()
    {
        var returnString = 'rgba('+ Math.round(this.r) + ', ' + Math.round(this.g)
         + ', ' + Math.round(this.b) + ' ,'+ this.a +')';
        return returnString;
    }

    randomColor(range)
    {
        var col =  new Color(
            (this.r + Math.random()*range - range/2).clamp(0,255),
            (this.g + Math.random()*range - range/2).clamp(0,255),
            (this.b + Math.random()*range - range/2).clamp(0,255)
        )
        return col;
    }

    tween(oldColor, ratio)
    {
        return new Color(
            tween(oldColor.r, this.r, ratio),
            tween(oldColor.g, this.g, ratio),
            tween(oldColor.b, this.b, ratio)
        )
    }
}

function randomColor()
{
    return new Color(Math.random()*255,Math.random()*255,Math.random()*255);
}
