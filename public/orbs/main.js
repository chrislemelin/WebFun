const CANVAS_RATIO = .9;
const ORB_SPEED = 500;
var ORB_RADIUS = 10;


var myRequestAnimationFrame =  window.requestAnimationFrame ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function(callback) {setTimeout(callback, 1)};



function initCanvas()
{
    canvas  = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    //ORB_RADIUS = canvas.width/1;


    width = canvas.width = window.innerWidth * CANVAS_RATIO;
    height = canvas.height = window.innerHeight * CANVAS_RATIO;


    world = new World();

    Math.floor(Math.random()*canvas.width) + 1

    randomOrb(world, new Color(255,0,0))
    randomOrb(world, new Color(255,255,0))
    randomOrb(world, new Color(0,0,255))

    world.draw();

}

function randomOrb(world, color)
{
    var x = ORB_RADIUS + Math.floor(Math.random()*canvas.width - ORB_RADIUS*2 );
    var y = ORB_RADIUS + Math.floor(Math.random()*canvas.height - ORB_RADIUS*2 );

    var movement = new Victor(0,0);
    while(movement.magnitude() == 0 )
    {
        movement = new Victor(Math.random(),Math.random());
    }
    movement.normalize().multiplyScalar(ORB_SPEED);
    world.addOrb(new Orb(new Victor(x,y), ORB_RADIUS, color, movement));

}


window.onresize = function() {
    width = canvas.width = window.innerWidth * CANVAS_RATIO;
    height = canvas.height = window.innerHeight * CANV_RATIO;
}

function init() {

    initCanvas();
}

window.onload = init;
