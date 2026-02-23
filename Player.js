class Player {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.s = (speed ?? 3) * 0.5; // Slowed down for reflective pacing
  }

  updateInput(level) {
    const dx =
      (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) -
      (keyIsDown(LEFT_ARROW) || keyIsDown(65));

    const dy =
      (keyIsDown(DOWN_ARROW) || keyIsDown(83)) -
      (keyIsDown(UP_ARROW) || keyIsDown(87));

    const len = max(1, abs(dx) + abs(dy));
    this.x += (dx / len) * this.s;
    this.y += (dy / len) * this.s;

    // River current: move player with the river if they are on it
    if (level && level.isOnRiver(this.x, this.y)) {
      this.x += 1.2; // Match the visual flow speed (frameCount * 1.2)
    }
  }

  draw() {
    push();
    translate(this.x, this.y);
    noStroke();

    // Single rounded whipped cream dollop
    fill(255);
    // Main body - a full ellipse for a round bottom
    ellipse(0, 0, 36, 30);
    
    // Top swirl/peak
    fill(250);
    ellipse(0, -8, 20, 16);
    fill(245);
    triangle(-6, -11, 6, -11, 0, -24);

    pop();
  }
}
