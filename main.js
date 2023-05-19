const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;//200px --> a road going upward
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

//canvas.width/2 --> the road starts @ the center , canvas.width --> the road has 0.9* width of the canvas
const road = new Road(carCanvas.width / 2, carCanvas.width*0.9);
//road.getLaneCenter(1)-x 100-y 30-width 50-height
const N = 1000;
const cars = geneateCars(N);

let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
  for(let i=0;i<cars.length;i++){
    cars[i].brain=JSON.parse(localStorage.getItem("bestBrain"));
    if(i!=0){
      NeuralNetwork.mutate(cars[i].brain,0.1);
    }
  }
}

const traffic=[
  new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2,getRandomColor()),
  new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",2,getRandomColor()),
  new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",2,getRandomColor()),
  new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",2,getRandomColor()),
  new Car(road.getLaneCenter(1),-500,30,50,"DUMMY",2,getRandomColor()),
  new Car(road.getLaneCenter(1),-700,30,50,"DUMMY",2,getRandomColor()),
  new Car(road.getLaneCenter(2),-700,30,50,"DUMMY",2,getRandomColor()),
]
animate();

function save(){
  localStorage.setItem("bestBrain",JSON.stringify(bestCar.brain));
}

function discard(){
  localStorage.removeItem("bestBrain");
}

function geneateCars(N){
  const cars=[];
    for(let i=0;i<N;i++){
      cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return cars;
}

function animate(time) {
  for(let i=0; i< traffic.length; i++) {
    traffic[i].update(road.borders,[]); // leaving the traffic empty here, sothat the car is nor damaged by itself and there won't be so many obstacles
  }
  for(let i=0; i< cars.length; i++) {
    cars[i].update(road.borders,traffic);
  }

  //Find the best car that has minimum y value (goes upward the most)
  bestCar = cars.find(
    c=>c.y==Math.min( // find y that is the minimum from all the y values
      ...cars.map(c=>c.y)
    ));

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

  road.draw(carCtx);
  for(let i=0;i< traffic.length;i++) {
    traffic[i].draw(carCtx);
  }

  carCtx.globalAlpha=0.2;
  for(let i=0; i< cars.length; i++) {
    cars[i].draw(carCtx);
  }
  carCtx.globalAlpha=1;
  bestCar.draw(carCtx,true);

  carCtx.restore();

  networkCtx.lineDashOffset=-time/50;
  Visualizer.drawNetwork(networkCtx,bestCar.brain);
  requestAnimationFrame(animate);
}
