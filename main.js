const canvas = document.getElementById("myCanvas");
//200px --> a road going upward
canvas.width = 200;

const ctx = canvas.getContext("2d");
//canvas.width/2 --> the road starts @ the center , canvas.width --> the road has 0.9* width of the canvas
const road = new Road(canvas.width / 2, canvas.width*0.9);
//road.getLaneCenter(1)-x 100-y 30-width 50-height
const car = new Car(road.getLaneCenter(1),100,30,50,"KEYS");
const traffic=[
  new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2)
]
animate();

function animate() {
  for(let i=0; i< traffic.length; i++) {
    traffic[i].update(road.borders,[]); // leaving the traffic empty here, sothat the car is nor damaged by itself and there won't be so many obstacles
  }
  car.update(road.borders,traffic);

  canvas.height = window.innerHeight;

  ctx.save();
  ctx.translate(0,-car.y+canvas.height*0.7);

  road.draw(ctx);
  for(let i=0;i< traffic.length;i++) {
    traffic[i].draw(ctx,"red");
  }
  car.draw(ctx,"blue");

  ctx.restore();
  requestAnimationFrame(animate);
}
