const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;//200px --> a road going upward
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

//canvas.width/2 --> the road starts @ the center , canvas.width --> the road has 0.9* width of the canvas
const road = new Road(carCanvas.width / 2, carCanvas.width*0.9);
//road.getLaneCenter(1)-x 100-y 30-width 50-height
const car = new Car(road.getLaneCenter(1),100,30,50,"AI");
const traffic=[
  new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2)
]
animate();

function animate(time) {
  for(let i=0; i< traffic.length; i++) {
    traffic[i].update(road.borders,[]); // leaving the traffic empty here, sothat the car is nor damaged by itself and there won't be so many obstacles
  }
  car.update(road.borders,traffic);

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0,-car.y+carCanvas.height*0.7);

  road.draw(carCtx);
  for(let i=0;i< traffic.length;i++) {
    traffic[i].draw(carCtx,"red");
  }
  car.draw(carCtx,"blue");

  carCtx.restore();
  networkCtx.lineDashOffset=-time/50;
  Visualizer.drawNetwork(networkCtx,car.brain);
  requestAnimationFrame(animate);
}
