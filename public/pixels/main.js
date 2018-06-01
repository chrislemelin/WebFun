
var myRequestAnimationFrame =  window.requestAnimationFrame ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function(callback) {setTimeout(callback, 1)};

Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};

MAX_PIXELS=1000;


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
const MIN_LENGTH = 5;

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

    update(){


        //gug do a thing
    }

    split()
    {
        var gap = 0;
        var newPixels = [];
        var startLength = this.length/2;
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

        return (x > this.x && x < this.x+this.length &&
           y > this.y && y < this.y+this.length &&
           !(animationTween < this.animationLength && this.oldPixel != undefined) &&
           this.length/2 - 0 > MIN_LENGTH );
    }

}

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
        return 'rgba('+ this.r + ', ' + this.g + ', ' + this.b + ' ,'+this.a+')';
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

/// graphics helper functions
function tween(num1, num2, ratio)
{
    var difference = num2 - num1;
    return (ratio * difference) + num1;
}

function randomColor()
{
    return new Color(Math.random()*255,Math.random()*255,Math.random()*255);
}

function getColorFromPicture(x, y, xLength, yLength)
{
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

    return returnColor;

}

function initCanvas() {
    canvas  = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    width = canvas.height= imageWidth;
    height = canvas.width = canvas.style.height =imageHeight;
    canvas.style.width =imageWidth+"px";
    canvas.style.height = imageHeight+"px";


    world = new World();
    world.addPixel(new Pixel(0, 0 , imageWidth));

    world.draw();

}

function initPicture()
{
    url_string = window.location.href;
    var url = new URL(url_string);
    var id = url.searchParams.get("id");
    if(c != null)
    {
        loadCanvas('https://i.imgur.com/'+id+".png");
    }
    else {
        //default
        loadCanvas('https://i.imgur.com/MGphLLc.jpg');
    }
}

function loadCanvas(url)
{
    var pixelCanvas = document.getElementById('picture');

    var img = new Image();
    img1.crossOrigin = "Anonymous";


    //drawing of the test image - img1
    img1.onload = function () {

        pixelCanvas.width = imageWidth =  Math.min(img1.width, MAX_PIXELS);
        pixelCanvas.height = imageHeight = Math.min(img1.height, MAX_PIXELS);

        //draw background image
        pictureCtx.drawImage(img, 0, 0);

        //var data = pictureCtx.getImageData(100, 100, 4, 4).data;

        initCanvas();

    };

    img1.src = url
}


function imgurUpload() {
    var applicationId = '2ab48d8265ee7ba';
    var auth = 'Client-ID ' + applicationId;

    $.ajax({
      url: 'https://api.imgur.com/3/image',
      type: 'POST',
      headers: {
        Authorization: auth,
        Accept: 'application/json'
      },
      data: {
        image: localStorage.dataBase64,
        type: 'base64'
      },
      success: function(result) {
          var link ="https://chrislemelin.gitlab.io/WebFun/pixels/?id="+result.data.id;
          $("#displayText").html("Success: copy this <a href="+link+">"+link+"</a>");

        },
      error: function(result) {
          $("#displayText").html("that file is wack");
      }

    });
  }


function imageIsLoaded(e) {

    $('#myImg').attr('src', e.target.result);
    localStorage.dataBase64 = e.target.result.substring(22);
};


function initCallbacks()
{
    $(":file").change(function () {

           if (this.files && this.files[0]) {
               var reader = new FileReader();

               reader.onload = imageIsLoaded;
               reader.readAsDataURL(this.files[0]);
           }
       });
    $("#send").click(imgurUpload);
    document.body.addEventListener("mousemove",handleMouseMove);


}



window.onresize = function() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

    world.draw();
}

function handleMouseMove(event)
{
    var rect = canvas.getBoundingClientRect();

    world.handleMouseMove(event.clientX - rect.left, event.clientY - rect.top);
}

function init() {
    pictureCtx = document.getElementById('picture').getContext('2d');
    initPicture();
    initCallbacks();
    localStorage.dataBase64="";


}

window.onload = init;
