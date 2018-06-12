class Vector2{

    constructor(x ,y)
    {
        this.x = x;
        this.y = y;
    }

    getNormal()
    {
        var mag = this.getMag();
        return new Vector2(this.x / mag, this.y / mag);
    }

    getMag()
    {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2),2);
    }

    add(vector)
    {
        return new Vector2(this.x + vector.x, this.y +vector.y);
    }

    mult(mag)
    {
        return new Vector2(this.x * mag, this.y * mag);
    }
}
