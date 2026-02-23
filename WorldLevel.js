class WorldLevel {
  constructor(json) {
    this.schemaVersion = json.schemaVersion ?? 1;

    this.w = json.world?.w ?? 2400;
    this.h = json.world?.h ?? 1600;
    this.bg = json.world?.bg ?? [235, 235, 235];
    this.gridStep = json.world?.gridStep ?? 160;

    this.obstacles = json.obstacles ?? [];

    // NEW: camera tuning knob from JSON (data-driven)
    this.camLerp = json.camera?.lerp ?? 0.12;
  }

  drawBackground() {
  // Soft vanilla → strawberry gradient
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
    fill(this.bg[0], this.bg[1], this.bg[2]);
    

    stroke(245);
    for (let x = 0; x <= this.w; x += this.gridStep) line(x, 0, x, this.h);
    for (let y = 0; y <= this.h; y += this.gridStep) line(0, y, this.w, y);

    noStroke();
    for (const o of this.obstacles) {
  fill(random(230,255), random(180,220), random(180,220));
  rect(o.x, o.y, o.w, o.h, o.r ?? 20);

  // Sprinkle dots
  fill(255);
  for (let i = 0; i < 10; i++) {
    ellipse(
      o.x + random(o.w),
      o.y + random(o.h),
      4,
      4
    );
  }
}
    for (const o of this.obstacles) rect(o.x, o.y, o.w, o.h, o.r ?? 0);
  }

  drawHUD(player, camX, camY) {
    noStroke();
    fill(20);
    text("Example 4 — JSON world + smooth camera (lerp).", 12, 20);
    text(
      "camLerp(JSON): " +
        this.camLerp +
        "  Player: " +
        (player.x | 0) +
        "," +
        (player.y | 0) +
        "  Cam: " +
        (camX | 0) +
        "," +
        (camY | 0),
      12,
      40,
    );
  }
}
