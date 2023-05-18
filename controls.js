class Controls {
  constructor() {
    this.forwards = false;
    this.left = false;
    this.right = false;
    this.reverse = false;

    this.#addKeyboardListeners();
  }

  // addKeyboardListeners is a private method, you cannot access this puside the Controls class
  #addKeyboardListeners() {
    document.onkeydown = (event) => {
      switch (event.key) {
        case "ArrowLeft":
          this.left = true;
          break;
        case "ArrowRight":
          this.right = true;
          break;
        case "ArrowUp":
          this.up = true;
          break;
        case "ArrowDown":
          this.down = true;
          break;
      }
      console.log(this);
    };
    document.onkeyup = (event) => {
      switch (event.key) {
        case "ArrowLeft":
          this.left = false;
          break;
        case "ArrowRight":
          this.right = false;
          break;
        case "ArrowUp":
          this.up = false;
          break;
        case "ArrowDown":
          this.down = false;
          break;
      }
      console.log(this);
    };
  }
}
