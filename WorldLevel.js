class WorldLevel {
  constructor(json) {
    this.schemaVersion = json.schemaVersion ?? 1;

    this.w = json.world?.w ?? 2400;
    this.h = json.world?.h ?? 1600;
    this.bg = json.world?.bg ?? [235, 235, 235];
    this.gridStep = json.world?.gridStep ?? 160;

    this.obstacles = json.obstacles ?? [];
    this.camLerp = json.camera?.lerp ?? 0.12;

    this.desserts = []; // empty for now
  }

  drawBackground() {
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

    fill(255, 228, 196);
    rect(0, 0, this.w, this.h);

    fill(139, 69, 19);
    rect(0, this.h * 0.75, this.w, this.h * 0.25);

    // Draw desserts
    for (const d of this.desserts) {
      push();
      translate(d.x + d.w / 2, d.y + d.h / 2); // Center of the dessert area
      noStroke();

      // Use a uniform size based on the smaller dimension to prevent stretching
      let size = min(d.w, d.h);
      let hw = size / 2;
      let hh = size / 2;

      if (d.type === 0) {
        // 🍪 Macaron / Cake
        // Bottom shell
        fill(d.color[0], d.color[1], d.color[2]);
        rect(-hw, hh * 0.2, size, hh * 0.8, 20);
        
        // Filling (Cream)
        fill(255);
        rect(-hw, -hh * 0.2, size, hh * 0.4, 5);
        
        // Top shell
        fill(d.color[0], d.color[1], d.color[2]);
        rect(-hw, -hh, size, hh * 0.8, 20);

      } else if (d.type === 1) {
        // 🍩 Donut
        // Dough
        fill(210, 180, 140); 
        ellipse(0, 0, size, size);
        
        // Glaze
        fill(d.color[0], d.color[1], d.color[2]);
        ellipse(0, 0, size * 0.85, size * 0.85);
        
        // Hole
        fill(255, 228, 196); // Match ground color
        ellipse(0, 0, size * 0.3, size * 0.3);

      } else {
        // 🍦 Ice Cream
        // Cone
        fill(210, 140, 60);
        triangle(
          -hw * 0.6, 0,
          hw * 0.6, 0,
          0, hh * 1.4
        );
        
        // Waffle pattern on cone
        stroke(180, 110, 40);
        strokeWeight(1);
        line(-hw * 0.3, hh * 0.1, 0, hh * 0.6);
        line(hw * 0.3, hh * 0.1, 0, hh * 0.6);
        noStroke();

        // Scoop
        fill(d.color[0], d.color[1], d.color[2]);
        ellipse(0, -hh * 0.3, size * 0.9, size * 0.7);
        
        // Cherry on top
        fill(255, 50, 50);
        ellipse(0, -hh * 0.9, size * 0.2, size * 0.2);
      }
      pop();
    }

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