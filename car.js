class Car {
  //properties of a car
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.controls = new Controls();
  }

  //update method checks if the control stays forward, move the car upwards else go down
  update() {
    if (this.controls.forward) {
      this.y -= 2; // go forward
    }
    if (this.controls.reverse) {
      this.y += 2; // go downwards
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.rect(
      // x is the center inside the car having top-bottom/left-right sides
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    ctx.fill();
  }
}
