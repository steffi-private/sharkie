class MovableObject {
  x = 0; // Default x position
  y = 0; // Default y position
  img;
  height = 100; 
  width = 150;
  speed = 0.15; // Default speed
  otherDirection = false; // Default direction
  imageCache = [];
  speedY = 0; // Vertical speed for gravity effect
  acceleration = 1.5; // Gravity acceleration

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

  applyGravity() {
    setInterval(() => {
      if(this.isAboveGround() || this.speedY > 0) {
      this.y-= this.speedY;
      this.speedY -= this.acceleration; 
      } 
    } , 1000 / 25); // 25 FPS
  }

  isAboveGround() {
    return this.y < 250; // Assuming 250 is the ground level
  }

  moveLeft() {
    this.x -= this.speed;
  }

  moveRight() { 
    this.x += this.speed;
  }

  moveDown() {
    this.y += this.speed; // Move up at a constant speed
  }

  jump() {
    this.speedY = 20; // Set vertical speed for jumping
  }
  
  getPosition() {
    return { x: this.x, y: this.y };
  }

  getSize() {
    return { width: this.width, height: this.height };
  }
}