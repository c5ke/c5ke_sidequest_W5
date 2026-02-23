/*
Week 5 — Dessert World + Smooth Camera
Course: GBDA302 | Instructors: Dr. Karen Cochrane & David Han
*/

const VIEW_W = 800;
const VIEW_H = 480;

let worldData;
let level;
let player;

let camX = 0;
let camY = 0;

function preload() {
  // Load JSON world before setup
  worldData = loadJSON("world.json");
}

function setup() {
  createCanvas(VIEW_W, VIEW_H);
  textFont("sans-serif");
  textSize(14);

  // Create world level
  level = new WorldLevel(worldData);

  // Create player
  const start = worldData.playerStart ?? { x: 300, y: 300, speed: 3 };
  player = new Player(start.x, start.y, start.speed);

  // Initialize camera
  camX = player.x - width / 2;
  camY = player.y - height / 2;

  // Generate desserts safely
  generateDesserts(level);
}

function draw() {
  player.updateInput(level);

  // Keep player inside world
  player.x = constrain(player.x, 0, level.w);
  player.y = constrain(player.y, 0, level.h);

  // Target camera (center on player)
  let targetX = player.x - width / 2;
  let targetY = player.y - height / 2;

  // Clamp target camera
  const maxCamX = max(0, level.w - width);
  const maxCamY = max(0, level.h - height);
  targetX = constrain(targetX, 0, maxCamX);
  targetY = constrain(targetY, 0, maxCamY);

  // Smooth follow using JSON lerp (slowed down for meditative feel)
  const camLerp = level.camLerp * 0.3; 
  camX = lerp(camX, targetX, camLerp);
  camY = lerp(camY, targetY, camLerp);

  // Draw background & world
  level.drawBackground();
  push();
  translate(-camX, -camY);
  level.drawWorld();
  player.draw();
  pop();

  // HUD
  level.drawHUD(player, camX, camY);
}

function keyPressed() {
  if (key === "r" || key === "R") {
    const start = worldData.playerStart ?? { x: 300, y: 300, speed: 3 };
    player = new Player(start.x, start.y, start.speed);
  }
}

// 🍦 Generate desserts (safe, fixed sprinkles)
function generateDesserts(level) {
  // Desserts on obstacles
  for (const o of level.obstacles) {
    const sprinkles = [];
    for (let i = 0; i < 5; i++) {
      sprinkles.push({
        x: o.x + random(o.w),
        y: o.y + random(o.h),
        size: random(2, 4)
      });
    }
    level.desserts.push({
      x: o.x,
      y: o.y,
      w: o.w,
      h: o.h,
      type: floor(random(3)),
      color: [random(230, 255), random(180, 220), random(180, 220)],
      sprinkles
    });
  }

  // Extra scattered desserts
  for (let i = 0; i < 50; i++) {
    const w = random(40, 80);
    const h = random(30, 70);
    const x = random(0, level.w - w);
    const y = random(0, level.h - h);

    const sprinkles = [];
    for (let j = 0; j < 5; j++) {
      sprinkles.push({
        x: x + random(w),
        y: y + random(h),
        size: random(2, 4)
      });
    }

    level.desserts.push({
      x,
      y,
      w,
      h,
      type: floor(random(3)),
      color: [random(230, 255), random(180, 220), random(180, 220)],
      sprinkles
    });
  }
}