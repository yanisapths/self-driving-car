const canvas=document.getElementById("myCanvas");
canvas.height=window.innerHeight;

//200px --> a road going upward
canvas.width=200; 

const ctx = canvas.getContext("2d");

//100-x 100-y 30-width 50-height
const car=new Car(100,100,30,50); 
car.draw(ctx);

