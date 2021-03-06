
class World{

    constructor(backgroundColor = new Color(255,255,255))
    {
        this.backgroundColor = backgroundColor;
        this.pixels = [];
    }

    draw()
    {
        ctx.beginPath();
        ctx.fillStyle = this.backgroundColor.toString();
        ctx.rect(0, 0, canvas.width, canvas.height );
        ctx.fill();

        var date = new Date()
        this.pixels.forEach(
            (pixel) => pixel.draw(date)
        )

        myRequestAnimationFrame(()=>this.draw());

    }

    addPixel(pixel)
    {
        this.pixels.push(pixel);
    }

    handleMouseMove(x,y)
    {
        x = x/CANVAS_RATIO;
        y = y/CANVAS_RATIO;
        var date = new Date()
        this.pixels.forEach(
            (pixel, index, object) => {if (pixel.shoudSplit(x,y,date)){
                var newPixels = pixel.split()
                object.push(... newPixels);


                object.splice(index, 1);
            }}
        )
        //this.draw();
    }

}

class Pixel{
    constructor(newX, newY, newLength, oldPixel, newColor = undefined, animationLength = 500)
    {
        this.x = newX;
        this.y = newY;
        //this.color = newColor;
        this.length = newLength;
        this.creationTime = new Date();
        this.oldPixel = oldPixel;
        this.animationLength = animationLength
        if(newColor == undefined)
            this.color = getColorFromPicture(this.x, this.y, this.length, this.length);
        else
            this.color = newColor;
    }

    draw(currentTime)
    {
        var animationTween = (currentTime - this.creationTime);

        var x = this.x;
        var y = this.y;
        var length = this.length;

        var color = this.color;

        if(animationTween < this.animationLength && this.oldPixel != undefined)
        {
            var ratio = animationTween/ this.animationLength
            x = tween(this.oldPixel.x , x, ratio);
            y = tween(this.oldPixel.y , y, ratio);
            length = tween(this.oldPixel.length , length, ratio);
            color = this.color.tween(this.oldPixel.color, ratio);

        }
        ctx.beginPath();
        ctx.fillStyle = color.toString();
        ctx.strokeStyle= "rbg(0,0,0)"
        ctx.rect(x, y, length, length);
        ctx.fill();

    }

    split()
    {
        var gap = 0;
        var newPixels = [];
        var startLength = Math.floor(this.length/2);
        var endLength = startLength;
        if(endLength > 0)
        {
            // upper left
            var transitionPixel = new Pixel(this.x, this.y, startLength, undefined, this.color)
            newPixels.push(new Pixel(this.x, this.y, endLength, transitionPixel));

            // upper right
            transitionPixel = new Pixel(this.x + startLength, this.y, startLength, undefined, this.color);
            newPixels.push(new Pixel(this.x + startLength+gap, this.y, endLength, transitionPixel));

            // lower left
            transitionPixel = new Pixel(this.x, this.y + startLength, startLength, undefined, this.color)
            newPixels.push(new Pixel(this.x, this.y+ startLength+ gap, endLength, transitionPixel));

            // // lower right
            transitionPixel = new Pixel(this.x + startLength, this.y + startLength, startLength, undefined, this.color)
            newPixels.push(new Pixel(this.x + startLength + gap, this.y + startLength + gap, endLength, transitionPixel));
        }

        return newPixels;
    }

    shoudSplit(x,y, currentTime){
        var animationTween = (currentTime - this.creationTime);

        return (x > this.x && x < (this.x+this.length) &&
           y > this.y && y < this.y+this.length &&
           !(animationTween < this.animationLength && this.oldPixel != undefined) &&
           this.length/2 > MIN_PIXEL_LENGTH );
    }

}





function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function getColorFromPicture(x, y, xLength, yLength)
{
    //return new Color(255,0,0);
    numberOfPixels = xLength * yLength;
    var r = 0, g = 0, b = 0;
    var data = pictureCtx.getImageData(x,y,xLength, yLength).data;
    var counter = 0;
    for(var a = 0; a < numberOfPixels; a++)
    {

        var i = a*4;
        if(data[i] != undefined)
            r+=data[i];
        if(data[i+1] != undefined)
            g += data[i+1];
        if(data[i+2] != undefined)
            b += data[i+2];
        if(data[i] != undefined &&
            data[i+1] != undefined &&
            data[i+2] != undefined)
            counter++;



    }
    r /= counter;
    b /= counter;
    g /= counter;

    var returnColor = new Color(r, g, b);
    if(counter === 0 )
    {
        returnColor = new Color(255,255,255);
    }

    return returnColor;

}

function initCanvas() {
    canvas  = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    width = canvas.height= imageWidth;
    height = canvas.width = imageHeight;
    canvas.style.width = imageWidth*CANVAS_RATIO+"px";
    canvas.style.height = imageHeight*CANVAS_RATIO+"px";


    world = new World();
    world.addPixel(new Pixel(0, 0 , imageWidth));

    world.draw();

}
