class MovableObject {
  x = 250;
  y = 250;
  img;
  height = 100; 
  width = 150;
  imageCache = [];

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  loadImages(pathsArray) {
    pathsArray.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
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