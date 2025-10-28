class BackgroundObject extends MovableObject {
    width = 720;
    height = 480;

  constructor(imagePath, x, y, width, height) {
      super(); 
      this.loadImage(imagePath);
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
  }

}