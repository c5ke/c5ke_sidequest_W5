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
      // Softer, more ethereal gradient
      let r = lerp(255, 250, t);
      let g = lerp(245, 230, t);
      let b = lerp(250, 240, t);
      stroke(r, g, b);
      line(0, y, width, y);
    }

    // Add subtle floating "sugar dust" for atmosphere
    noStroke();
    fill(255, 255, 255, 150);
    for (let i = 0; i < 10; i++) {
      let x = (noise(frameCount * 0.005, i) * width);
      let y = (noise(i, frameCount * 0.005) * height);
      ellipse(x, y, 2, 2);
    }
  }

  drawWorld() {
    noStroke();

    // Ground (Biscuit/Sand color)
    fill(255, 228, 196);
    rect(0, 0, this.w, this.h);

    // Chocolate River (Flowing through the world)
    fill(60, 30, 10); // Dark chocolate
    let riverY = this.h * 0.45;
    let riverH = 150;
    rect(0, riverY, this.w, riverH);
    
    // Subtle river flow highlights for meditative motion
    stroke(90, 50, 20);
    strokeWeight(3);
    for (let i = 0; i < 15; i++) {
      let flowX = (frameCount * 1.2 + i * 250) % this.w;
      line(flowX, riverY + 30, flowX + 60, riverY + 30);
      line((flowX + 120) % this.w, riverY + 75, (flowX + 180) % this.w, riverY + 75);
      line((flowX + 40) % this.w, riverY + 120, (flowX + 100) % this.w, riverY + 120);
    }
    noStroke();

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

  isOnRiver(px, py) {
    let riverY = this.h * 0.45;
    let riverH = 150;
    return py > riverY && py < riverY + riverH;
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