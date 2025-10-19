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
        // only try to draw when this.img is a real HTMLImageElement (avoid uncaught canvas errors)
        try {
           if (this.img && (this.img instanceof HTMLImageElement || this.img instanceof Image) && this.img.complete) {
                ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
            }
        } catch (e) { /* defensive: ignore draw errors to avoid crashing the whole render loop */ }
    }


    loadImages(pathsArray) {
        pathsArray.forEach((path) => {
        let img = new Image();
        img.src = path;
        this.imageCache[path] = img;
      });
    }



}
