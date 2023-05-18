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
    this.#move();
    this.sensor.update(roadBorders);
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
    // Rotation using canvas context
      // 1.save the context
      // 2.translate to the point where the rotation to be center at
      // 3.rotate by minus angle
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(-this.angle);

    ctx.beginPath();
    ctx.rect(
      -this.width / 2, 
      -this.height / 2, 
      this.width, 
      this.height
    );
    ctx.fill();

    ctx.restore();
    
    // In addition to a car, the sensor is called to drawed itself
    this.sensor.draw(ctx);
  }
}
