class MovableObject {
  x = 250;
  y = 250;
  img;
  height = 100; 
  width = 150;
  speed = 0.15; // Default speed
  otherDirection = false; // Default direction
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

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  moveLeft(x, speed) {
    setInterval(() => {
            this.x -= speed; // Move left at a constant speed
            if (this.x < -50) {
                this.x = 800; // Reset position to the right side of the canvas
            }
        }, 1000 / 60); // 60 FPS
  }

   moveRight(x, speed) {
    setInterval(() => {
            this.x += speed; // Move left at a constant speed
            if (this.x > 800) {
                this.x = -50; // Reset position to the right side of the canvas
            }
        }, 1000 / 60); // 60 FPS
  }

  moveUp(y, speed) {
    setInterval(() => {
        this.y -= speed; // Move up at a constant speed
        if (this.y < -50) {
            this.y = 500; // Reset position to the top side of the canvas
        }
    }
    , 1000 / 60); // 60 FPS
  }

   moveDown(y, speed) {
    setInterval(() => {
        this.y += speed; // Move up at a constant speed
        if (this.y > 500) {
            this.y = -50; // Reset position to the top side of the canvas
        }
    }
    , 1000 / 60); // 60 FPS
  }


  getPosition() {
    return { x: this.x, y: this.y };
  }

  getSize() {
    return { width: this.width, height: this.height };
  }
}