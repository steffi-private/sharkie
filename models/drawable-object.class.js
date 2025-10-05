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


    loadImages(pathsArray) {
        pathsArray.forEach((path) => {
        let img = new Image();
        img.src = path;
        this.imageCache[path] = img;
      });
    }



}
