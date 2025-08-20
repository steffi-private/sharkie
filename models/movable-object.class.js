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
  energy = 100; // Default energy level
  lastHit = 0; // Timestamp of the last hit to prevent multiple hits in a short time

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

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawFrame(ctx) {
    if (this instanceof Character || this instanceof PufferFish || this instanceof JellyFish) {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
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

  isColliding(movableObject) {
    return this.x + this.width > movableObject.x &&
      this.y + this.height > movableObject.y &&
      this.x < movableObject.x &&
      this.y < movableObject.y + movableObject.height;
  }

  isHit(damage) {
    this.energy -= damage; // Reduce energy by the damage amount  
    if (this.energy < 0) {
      this.energy = 0; // Ensure energy doesn't go below zero
    }
  console.log(`Energy after hurt: ${this.energy}`);
    this.lastHit = Date.now(); // Update the last hit timestamp
  console.log(`Last hit timestamp: ${this.lastHit}`);
  }

  isHurt() {
    let timeSinceLastHit = Date.now() - this.lastHit;
    return timeSinceLastHit < 1000 && this.energy > 0; // Check if the last hit was within the last second and energy is above zero
  }

  isDead() {
        return this.energy <= 0;
  }
  
  getPosition() {
    return { x: this.x, y: this.y };
  }

  getSize() {
    return { width: this.width, height: this.height };
  }
}