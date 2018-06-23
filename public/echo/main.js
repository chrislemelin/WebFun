const CANVAS_RATIO = .9;
const ORB_SPEED = 500;
const ORB_RADIUS = 10;
const MAX_ORBS = 25;

var world;


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

    width = canvas.width = window.innerWidth * CANVAS_RATIO;
    height = canvas.height = window.innerHeight * CANVAS_RATIO;

    world = new World();

    randomOrb(world, new Color(255,255,255))

    world.draw();

}

function randomOrb(world, color)
{
    var x = ORB_RADIUS + Math.floor(Math.random()*canvas.width - ORB_RADIUS*2 );
    var y = ORB_RADIUS + Math.floor(Math.random()*canvas.height - ORB_RADIUS*2 );

    var angle = Math.random() * Math.PI * 2;
    var movement = new Victor(Math.cos(angle), Math.sin(angle));

    movement.normalize().multiplyScalar(ORB_SPEED);
    world.addOrb(new Orb(new Victor(x,y), ORB_RADIUS, color, movement));

}

function addNewOrb(x, y)
{
    //var color = new Color(Math.random()*255, Math.random()*255,Math.random()*255)
    var color = new Color(255,255,255);
    var angle = Math.random() * Math.PI * 2;

    var movement = new Victor(Math.cos(angle), Math.sin(angle));

    movement.normalize().multiplyScalar(ORB_SPEED);

    world.addOrb(new Orb(new Victor(x,y), ORB_RADIUS, color, movement));

}

function handleClick(event)
{
    if(world.orbs.length < MAX_ORBS)
    {
        var rect = canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        x = x*CANVAS_RATIO;
        y = y*CANVAS_RATIO;
        addNewOrb(x,y);
    }


}

window.onresize = function() {
    width = canvas.width = window.innerWidth * CANVAS_RATIO;
    height = canvas.height = window.innerHeight * CANV_RATIO;
}

function init() {
    document.body.addEventListener("click", handleClick);
    initCanvas();
}

window.onload = init;
