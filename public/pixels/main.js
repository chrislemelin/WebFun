
var myRequestAnimationFrame =  window.requestAnimationFrame ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function(callback) {setTimeout(callback, 1)};




class Pixel{

    constructor(newX, newY, newColor, newLength)
    {
        this.x = newX;
        this.y = newY;
        this.color = newColor;
        this.length = newLength;
    }

    draw()
    {
        ctx.fillStyle = this.color.toString();
        ctx.rect(this.x - this.length/2, this.y - this.length/2, this.length,this.length);
        ctx.fill();
    }

    update(){
        //gug do a thing
    }

}

class Color{
    constructor(newR, newG, newB)
    {
        this.r = newR;
        this.g = newG;
        this.b = newB;
    }

    toString()
    {
        return 'rgba('+ this.r + ', ' + this.g + ', ' + this.b + ' ,255)';
    }
}

function draw()
{
    pixels.forEach(
        (pixel) => pixel.draw()
    )
}

function initCanvas() {
    canvas  = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    console.log('big fat popo')

    ctx.lineWidth=0;

    pixels = [];
    pixels.push( new Pixel(25, 25 ,new Color(155,255,0), 50));
    draw();

}

window.onresize = function() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

    draw();
}

function init() {
    initCanvas();
}

window.onload = init;
