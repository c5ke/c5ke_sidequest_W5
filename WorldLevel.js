class WorldLevel {
  constructor(json) {
    this.schemaVersion = json.schemaVersion ?? 1;

    // World size and background
    this.w = json.world?.w ?? 2400;
    this.h = json.world?.h ?? 1600;
    this.bg = json.world?.bg ?? [235, 235, 235];
    this.gridStep = json.world?.gridStep ?? 160;

    this.obstacles = json.obstacles ?? [];
    this.camLerp = json.camera?.lerp ?? 0.12;

    // Desserts will be generated after p5 is ready
    this.desserts = [];
  }

  drawBackground() {
    // Vanilla → strawberry gradient sky
    for (let y = 0; y < height; y++) {
      let t = y / height;
      let r = lerp(255, 255, t);
      let g = lerp(240, 182, t);
      let b = lerp(220, 193, t);
      stroke(r, g, b);
      line(0, y, width, y);
    }
  }

  drawWorld() {
    noStroke();

    // Base layers
    fill(255, 228, 196); // vanilla cake base
    rect(0, 0, this.w, this.h);

    fill(139, 69, 19); // chocolate layer
    rect(0, this.h * 0.75, this.w, this.h * 0.25);

    // Draw desserts
    for (const d of this.desserts) {
      fill(d.color[0], d.color[1], d.color[2]);

      if (d.type === 0) {
        // 🍰 Cake
        rect(d.x, d.y, d.w, d.h, 20);
        fill(255);
        rect(d.x, d.y - 8, d.w, 10, 10);
      } 
      else if (d.type === 1) {
        // 🍩 Donut
        ellipse(d.x + d.w/2, d.y + d.h/2, d.w, d.h);
        fill(255, 228, 196);
        ellipse(d.x + d.w/2, d.y + d.h/2, d.w*0.4, d.h*0.4);
      } 
      else {
        // 🍦 Ice cream
        fill(222, 184, 135);
        triangle(
          d.x, d.y + d.h,
          d.x + d.w, d.y + d.h,
          d.x + d.w/2, d.y + d.h + d.h*0.5
        );
        fill(255, 182, 193);
        ellipse(d.x + d.w/2, d.y + d.h/2, d.w, d.h);
      }

      // Sprinkles
      fill(255, 255, 200);
      for (let i=0; i<5; i++){
        ellipse(d.x + random(d.w), d.y + random(d.h), 4, 4);
      }
    }

    // Optional: grid overlay
    stroke(245);
    for (let x = 0; x <= this.w; x += this.gridStep) line(x, 0, x, this.h);
    for (let y = 0; y <= this.h; y += this.gridStep) line(0, y, this.w, y);
  }

  drawHUD(player, camX, camY) {
    noStroke();
    fill(20);
    text("Dessert World — Smooth Camera + JSON", 12, 20);
    text(
      `camLerp(JSON): ${this.camLerp}  Player: ${player.x | 0},${player.y | 0}  Cam: ${camX | 0},${camY | 0}`,
      12,
      40
    );
  }
}