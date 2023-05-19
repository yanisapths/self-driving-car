class Car {
  //properties/attributes of a car
  constructor(x, y, width, height,controlType,maxSpeed=4,color="crimson") {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = maxSpeed;
    this.friction = 0.05;
    this.angle = 0;
    this.damaged=false;

    this.useBrain=controlType=="AI";

    if(controlType!="DUMMY"){
      this.sensor = new Sensor(this);
      this.brain=new NeuralNetwork([this.sensor.rayCount, 6,4]);
       // size of layer = rayCount  // layers: 6 (1hidden layer,1output) //neurons= 4 
    }
    this.controls = new Controls(controlType);

    this.img=new Image();
    this.img.src="car.png"

    this.mask=document.createElement("canvas");
    this.mask.width=width;
    this.mask.height=height;

    const maskCtx = this.mask.getContext("2d");
    this.img.onload=()=>{
      maskCtx.fillStyle=color;
      maskCtx.rect(0,0,this.width,this.height);
      maskCtx.fill();

      maskCtx.globalCompositeOperation="destination-atop";
      maskCtx.drawImage(this.img,0,0,this.width,this.height);
    }
  }

  update(roadBorders,traffic) {
    if(!this.damaged){
      this.#move();
      this.polygon=this.#createPolygon();
      this.damaged=this.#aseessDamage(roadBorders,traffic);
    }
    if(this.sensor){
      this.sensor.update(roadBorders,traffic);
      const offsets=this.sensor.readings.map(
        s=>s==null?0:1-s.offset
      );
      const outputs=NeuralNetwork.feedForward(offsets,this.brain);

      if(this.useBrain){
        this.controls.forward=outputs[0];
        this.controls.left=outputs[1];
        this.controls.right=outputs[2];
        this.controls.reverse=outputs[3];
      }
    }
  }

  #aseessDamage(roadBorders,traffic){
    for(let i=0; i<roadBorders.length; i++){
      if(polysIntersect(this.polygon,roadBorders[i])){
        return true;
      }
    }
    for(let i=0; i<traffic.length; i++){
      if(polysIntersect(this.polygon,traffic[i].polygon)){
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

  draw(ctx,drawSensor=false) {
     // In addition to a car, the sensor is called to drawed itself
     if(this.sensor && drawSensor){
      this.sensor.draw(ctx);
    }
    
    ctx.save();
    ctx.translate(this.x,this.y);
    ctx.rotate(-this.angle);

    if(!this.damaged){
      ctx.drawImage(this.mask,
        -this.width/2,
        -this.height/2,
        this.width,
        this.height);
      ctx.globalCompositeOperation = 'multiply';
    }
    ctx.drawImage(this.img,
        -this.width/2,
        -this.height/2,
        this.width,
        this.height);
    ctx.restore();
  }
}

