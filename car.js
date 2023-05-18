class Car {
  //properties/attributes of a car
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = 3;
    this.friction = 0.05;
    this.angle = 0;

    this.sensor = new Sensor(this);
    this.controls = new Controls();
  }

  update(roadBorders) {
    if(!this.damaged){
      this.#move();
      this.polygon=this.#createPolygon();
      this.damaged=this.#aseessDamage(roadBorders);
    }
    this.sensor.update(roadBorders);
  }

  #aseessDamage(roadBorders){
    for(let i=0; i<roadBorders.length; i++){
      if(polysIntersect(this.polygon,roadBorders[i])){
        return true;
      }
    }
  }

  //create car shape, car can be multiple shapes by changing values in this method for complex shapes
  #createPolygon() {
    const points=[];
    const rad=Math.hypot(this.width, this.height)/2;
    const alpha=Math.atan2(this.width,this.height);
    // tangent of the angle (arc tan) = width/height
    //           w
    //     ---------------
    //     |      |    /
    //     |      |   / 
    //     |      |a / rad
    // h   |      |^/
    //     |      |/
    //     |
    //     |
    //     |

    points.push({
      x: this.x-Math.sin(this.angle-alpha)*rad,
      y: this.y-Math.cos(this.angle-alpha)*rad,
    });
    points.push({
      x: this.x-Math.sin(this.angle+alpha)*rad,
      y: this.y-Math.cos(this.angle+alpha)*rad,
    });
    points.push({
      x: this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
      y: this.y-Math.cos(Math.PI+this.angle-alpha)*rad,
    });
    points.push({
      x: this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
      y: this.y-Math.cos(Math.PI+this.angle+alpha)*rad,
    });
    return points
  }

  //# = private method
  #move() {
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2; //divide by 2 for slower movement
      //negative sign indicates that the car is going backward
    }
    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    if (Math.abs(this.speed) < this.friction) {
      //make the car stops moving
      this.speed = 0;
    }
    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1;
      if (this.controls.left) {
        this.angle += 0.03 * flip;
      }
      if (this.controls.right) {
        this.angle -= 0.03 * flip;
      }
    }

    //make the car move based on its angle
    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
    this.y -= this.speed;
  }

  draw(ctx) {
    if(this.damaged){
      // if this car is damaged --> makes the car gray
      ctx.fillStyle="gray";
    }else{
      ctx.fillStyle="black";
    }
   ctx.beginPath();
   ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
   for(let i=1;i<this.polygon.length;i++){
    ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
   }
   ctx.fill();
    // In addition to a car, the sensor is called to drawed itself
    this.sensor.draw(ctx);
  }
}
