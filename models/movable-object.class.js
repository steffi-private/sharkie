class MovableObject {
  x = 250;
  y = 250;
  img;
  height = 100; 
  width = 150;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  move(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }

  getSize() {
    return { width: this.width, height: this.height };
  }
}