class World{

    constructor(backgroundColor = new Color(0,0,0))
    {
        this.backgroundColor = backgroundColor;
        this.orbs = [];
        this.lastUpdate = new Date();
        this.lightPosition;
    }

    addOrb(orb)
    {
        this.orbs.push(orb);
        this.lightPosition = orb.position;
    }

    draw()
    {
        ctx.beginPath();
        ctx.fillStyle = this.backgroundColor.toString();
        ctx.rect(0, 0, canvas.width, canvas.height );
        ctx.fill();

        // var textGrd=ctx.createRadialGradient(this.lightPosition.x,this.lightPosition.y, 1,
        //     this.lightPosition.x,this.lightPosition.y, canvas.width/5);
        //
        // textGrd.addColorStop(0,"rgba(0,255,0,.3)");
        // textGrd.addColorStop(1,"rgba(0,255,0,0)");
        //
        // ctx.fillStyle = textGrd;
        // fitTextOnCanvas("I feel trapped","verdana",canvas.height/2, canvas.width/10);
        //
        //
        // var textGrd=ctx.createRadialGradient(this.lightPosition.x - 50,this.lightPosition.y - 50, 1,
        //     this.lightPosition.x - 50 ,this.lightPosition.y- 50, canvas.width/5);
        //
        // textGrd.addColorStop(0,"rgba(255,0,0,.3)");
        // textGrd.addColorStop(1,"rgba(255,0,0,0)");
        // ctx.fillStyle = textGrd;
        //
        //
        // fitTextOnCanvas("I feel trapped","verdana",canvas.height/2, canvas.width/10);
        //
        // var textGrd=ctx.createRadialGradient(this.lightPosition.x +50 ,this.lightPosition.y + 50, 1,
        //     this.lightPosition.x + 50,this.lightPosition.y + 50, canvas.width/5);
        //
        // textGrd.addColorStop(0,"rgba(0,0,255,.3)");
        // textGrd.addColorStop(1,"rgba(0,0,255,0)");
        //
        // ctx.fillStyle = textGrd;
        // fitTextOnCanvas("I feel trapped","verdana",canvas.height/2, canvas.width/10);





        //ctx.fillText('Hello world', canvas.width/2, canvas.height/2)

        var now = new Date();
        var deltaTime = now - this.lastUpdate;
        deltaTime = Math.min(1000, deltaTime)

        this.orbs.forEach(
            (orb) => {
                orb.update(deltaTime)
                orb.draw()
                orb.drawText("I feel trapped", this.orbs.length);
                //this.lightPosition = orb.position;
            }
        )



        this.lastUpdate = now;
        myRequestAnimationFrame(()=>this.draw());

    }

}



function fitTextOnCanvas(text,fontface,yPosition, xPadding){

    // start with a large font size
    var fontsize=300;

    // lower the font size until the text fits the canvas
    do{
        fontsize--;
        ctx.font=fontsize+"px "+fontface;
    }while(ctx.measureText(text).width > width - 2*xPadding)


    ctx.fillText(text,xPadding,yPosition);
    return fontsize+"px "+fontface;

}


const TAIL_LENGTH = 100;
const TAIL_START_ALPHA = .7;

class Orb{

    constructor(position, radius, color, movement)
    {
        this.position = position;
        this.color = color;
        this.movement = movement;
        this.radius = radius;
        this.tail = [this.position];
    }

    renderTailHelper(startPosition, currentDistance, index, tail)
    {
        var lastPosition = tail[index];
        var distance = lastPosition.distance(startPosition);
        var maxDistance = TAIL_LENGTH - currentDistance;
        var currentAlpha = TAIL_START_ALPHA - (currentDistance/TAIL_LENGTH);

        if(distance > maxDistance)
        {
            var direction = lastPosition.clone().subtract(this.position).normalize();
            lastPosition = startPosition.clone().add(direction.multiplyScalar(maxDistance));
        }
        distance = Math.min(maxDistance, distance);
        var color1 = new Color(0,0,0);

        if(distance != 0)
        {
            color1 = new Color(this.color.r, this.color.g, this.color.b);
            var alpha1 = currentAlpha - currentAlpha*(distance/TAIL_LENGTH);
            color1.a = alpha1;

            var color2 = new Color(this.color.r, this.color.g, this.color.b);
            var alpha2 = currentAlpha;
            color2.a = alpha2;

            var gradient = ctx.createLinearGradient(lastPosition.x,lastPosition.y, startPosition.x, startPosition.y);
            gradient.addColorStop(0, color1.toString());
            gradient.addColorStop(1, color2.toString());

            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.moveTo(lastPosition.x, lastPosition.y);
            ctx.lineTo(startPosition.x, startPosition.y);
            ctx.stroke();
        }

        if(distance != maxDistance)
        {
            if(index+1 < tail.length)
            {
                this.renderTailHelper(lastPosition, distance+currentDistance, index+1, tail)
                ctx.beginPath();
                ctx.fillStyle = color1.toString();
                ctx.arc(lastPosition.x,lastPosition.y,this.radius, 0 ,2*Math.PI);
                ctx.fill();
            }
        }
        return distance;
    }

    draw()
    {
        ctx.lineWidth= 10;
        var alphaStep = 1/TAIL_LENGTH;
        ctx.lineWidth= this.radius*2;

        if(this.tail.length > 0)
        {
            this.renderTailHelper(this.position, 0, 0, this.tail)


            // var lastPosition = this.tail[0];
            // var currentPosition = this.position;
            // var distance = lastPosition.distance(this.position);
            // if(distance > TAIL_LENGTH)
            // {
            //     var direction = lastPosition.clone().subtract(this.position).normalize();
            //     lastPosition = this.position.clone().add(direction.multiplyScalar(TAIL_LENGTH));
            // }
            // distance = Math.min(TAIL_LENGTH, distance);
            // if(distance != 0)
            // {
            //     var color1 = new Color(this.color.r, this.color.g, this.color.b);
            //     var alpha1 = TAIL_START_ALPHA - TAIL_START_ALPHA*(distance/TAIL_LENGTH);
            //     color1.a = alpha1;
            //
            //
            //     var color2 = new Color(this.color.r, this.color.g, this.color.b);
            //     var alpha2 = TAIL_START_ALPHA;
            //     color2.a = alpha2;
            //
            //     var gradient = ctx.createLinearGradient(lastPosition.x,lastPosition.y, currentPosition.x, currentPosition.y);
            //     gradient.addColorStop(0, color1.toString());
            //     gradient.addColorStop(1, color2.toString());
            //
            //     ctx.beginPath();
            //     ctx.strokeStyle = gradient;
            //     ctx.moveTo(lastPosition.x, lastPosition.y);
            //     ctx.lineTo(currentPosition.x, currentPosition.y);
            //     ctx.stroke();
            // }
        }



        ctx.beginPath();
        ctx.fillStyle = this.color.toString();
        ctx.arc(this.position.x,this.position.y,this.radius, 0 ,2*Math.PI);
        ctx.fill();


    }

    drawText(text, numberOfOrbs)
    {

        var textGrd=ctx.createRadialGradient(this.position.x ,this.position.y, 1,
            this.position.x,this.position.y, canvas.width/4);

        var color1String = "rgba("+this.color.r+","+this.color.g+","+this.color.b+","+(Math.round((1/numberOfOrbs)*100) / 100 )+")";
        var color2String = "rgba("+this.color.r+","+this.color.g+","+this.color.b+",0)";


        textGrd.addColorStop(0,color1String);
        textGrd.addColorStop(1,color2String);

        ctx.fillStyle = textGrd;
        fitTextOnCanvas(text, "verdana", height/2, width/10);
    }

    bounce(normal)
    {
        //r=d−2(d⋅n)n

        this.tail.unshift(this.position);
        var scalar = 2*this.movement.dot(normal);
        var subVec = normal.clone().multiplyScalar(scalar)
        this.movement = this.movement.clone().subtract(subVec);
    }

    update(deltaTime)
    {
        if(deltaTime != 0)
        {
            var distanceTraveled = Victor.fromObject(this.movement);
            distanceTraveled.multiplyScalar(deltaTime/1000);
            distanceTraveled.add(this.position);
            this.position = distanceTraveled;
        }

        //check sides
        var minX = this.position.x - this.radius;
        var maxX = this.position.x + this.radius;
        var minY = this.position.y - this.radius;
        var maxY = this.position.y + this.radius;

        if(minX < 0 && this.movement.x < 0)
        {
            this.bounce(new Victor(1,0))
        }
        if(minY < 0 && this.movement.y < 0)
        {
            this.bounce(new Victor(0,1))
        }
        if(maxY > canvas.height && this.movement.y > 0)
        {
            this.bounce(new Victor(0,-1))
        }
        if(maxX > canvas.width && this.movement.x > 0)
        {
            this.bounce(new Victor(-1,0))
        }
    }

}
