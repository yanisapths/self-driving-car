class Sensor {
  constructor(car) {
    this.car = car;
    this.rayCount = 5;
    this.rayLength = 150;
    this.raySpread = Math.PI / 2;

    this.rays = [];
    this.readings=[];
  }

  update(roadBorders) {
    this.#castRays();
    this.readings=[];
    for(let i=0; i< this.rays.length; i++) {
        this.readings.push(
            this.#getReading(this.rays[i],roadBorders)
        );
    }
  }

  #getReading(ray,roadBorders) {
    let touches=[];

    for(let i=0;i<roadBorders.length;i++){
        const touch=getIntersection(
            ray[0],
            ray[1],
            roadBorders[i][0],
            roadBorders[i][1]
        );
        if(touch){
            touches.push(touch);
        }
    }

    if(touches.length==0){
        // if no touching, no reading anything
        return null;
    }else {
        // getIntersection()
        // return {
        //     x:
        //     y:
        //     offset: 0.9
        // }
        const offsets=touches.map(e=>e.offset);

        // If array touches many different things, like cars, boerders, etc.
        // We want to know the nearest one after the ray touches that all the other ones don't exist
        const minOffset=Math.min(...offsets); // ... operator is spreading the array into many different individual values
        
        // ** Modern JS Arrow Functions **
        // If you have one (and just one) parameter, you could omit the parentheses
        return touches.find(e=>e.offset == minOffset);
    }    
  }

  #castRays() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1) //If rayCount = 1 it will be divided by zero => no ray, so we check if ray Count is 1 make it appear at the center
        ) + this.car.angle;
      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };
      this.rays.push([start, end]);
    }
   }

  draw(ctx) {
    for (let i = 0; i < this.rayCount; i++) {
        let end=this.rays[i][1];
        if(this.readings[i]){
            //if there is readings
            end=this.readings[i]; //which calls getIntersection()
        }

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "yellow";
        ctx.moveTo(
            this.rays[i][0].x, 
            this.rays[i][0].y
        );
        ctx.lineTo(
            end.x, 
            end.y
        );
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        ctx.moveTo(
            this.rays[i][1].x, 
            this.rays[i][1].y
        );
        ctx.lineTo(
            end.x, 
            end.y
        );
        ctx.stroke();
    }
  }
}
