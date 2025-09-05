class DrawableObject {
    img;
    imageCache = [];
    currentImage = 0;

    x = 0; // Default x position
    y = 0; // Default y position
  
    height = 100; 
    width = 150;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
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

    loadImages(pathsArray) {
        pathsArray.forEach((path) => {
        let img = new Image();
        img.src = path;
        this.imageCache[path] = img;
      });
    }







}
