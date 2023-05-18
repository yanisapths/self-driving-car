const canvas = document.getElementById("myCanvas");
//200px --> a road going upward
canvas.width = 200;

const ctx = canvas.getContext("2d");
//canvas.width/2 --> the road starts @ the center , canvas.width --> the road has 0.9* width of the canvas
const road = new Road(canvas.width / 2, canvas.width*0.9);
//100-x 100-y 30-width 50-height
const car = new Car(road.getLaneCenter(1),100,30,50);

animate();

function animate() {
  car.update(road.borders);

  canvas.height = window.innerHeight;

  ctx.save();
  ctx.translate(0,-car.y+canvas.height*0.7);

  road.draw(ctx);
  car.draw(ctx);

  ctx.restore();
  requestAnimationFrame(animate);
}
