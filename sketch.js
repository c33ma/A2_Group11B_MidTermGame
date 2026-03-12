let gameState = "start";

let worldWidth = 2200;
let floorY = 420;

let player = { x: 120, y: floorY, speed: 0, targetSpeed: 0 };

let camX = 0;

let currentLevel = 0;
let aisleName = "";

let items = [];
let shoppingList = [];
let collected = [];

let hintsLeft = 3;

let itemEmojiMap = {};
let hoveredItem = null;

let fallingFruits = [];
let facing = 1;

let toastText = "";
let toastTimer = 0;

let bgMusic;
let musicStarted = false;

let highlightedItem = null;
let highlightTimer = 0;

let fade = 0;
let fadeTarget = 0;
let nextState = null;

let teleportFade = 0;

let pickups = [];

let buttonBounds = null;

function preload() {
  bgMusic = loadSound("music.mp3");
}

function setup() {
  let canvas = createCanvas(900, 500);
  canvas.parent("game-container");

  textFont("monospace");

  for (let it of ITEM_POOL) {
    itemEmojiMap[it.name] = it.emoji;
  }

  for (let i = 0; i < 12; i++) {
    fallingFruits.push({
      x: random(width),
      y: random(height),
      speed: random(1, 2),
      emoji: random(["🍎", "🍌", "🍓", "🍇", "🍉"]),
    });
  }
}

function draw() {
  updateFade();
  updatePickups();

  if (gameState === "start") drawStart();
  else if (gameState === "instructions") drawInstructions();
  else if (gameState === "game") drawGame();
  else if (gameState === "levelcomplete") drawLevelComplete();
  else if (gameState === "fail") drawFail();
  else if (gameState === "win") drawWin();

  drawFade();
  drawTeleportFade();
}

function drawStart() {
  background(255, 220, 235);

  textAlign(CENTER);

  for (let f of fallingFruits) {
    f.y += f.speed;

    textSize(26);
    text(f.emoji, f.x, f.y);

    if (f.y > height) {
      f.y = -20;
      f.x = random(width);
    }
  }

  fill(40);
  textSize(36);
  text("🍓 Grocery Helper 🍌", width / 2, 120);

  textSize(16);
  text("Find the groceries on your list!", width / 2, 180);

  drawAutoButton(width / 2, 280, "Start Shopping 🛒");
}

function drawInstructions() {
  background(255, 235, 245);

  textAlign(CENTER);

  fill(40);
  textSize(34);
  text("How To Play 🛒", width / 2, 100);

  fill(255);
  stroke(210);
  rect(width / 2 - 320, 150, 640, 250, 16);

  fill(60);
  noStroke();
  textSize(16);

  text(
    "Move using A / D or Arrow Keys.\n\n" +
      "Click items on shelves to collect them.\n\n" +
      "Only collect items in your shopping list.\n\n" +
      "Use hints to teleport to the next item.",
    width / 2,
    230,
  );

  drawAutoButton(width / 2, 440, "Continue Shopping 🛍️");
}

function drawGame() {
  drawPastelBackground();

  handleMovement();
  updateCamera();

  hoveredItem = getHoveredItem();

  push();
  translate(-camX, 0);

  drawAisleWorld(worldWidth, floorY);
  drawItemsWorld(items);
  drawPlayerWorld(player);

  pop();

  drawShoppingListUI(currentLevel, collected, shoppingList);
  drawHintUI(hintsLeft);
  drawCartUI(collected, itemEmojiMap);

  drawItemHint();
  drawToast();
  drawTopBar();

  drawPickups();
}

function drawLevelComplete() {
  drawEndScreen(
    "Level " + currentLevel + " Complete!",
    "Great shopping!",
    "Continue ➜",
    "🥳",
  );
}

function drawFail() {
  drawEndScreen(
    "Wrong Groceries",
    "Some items were not on the list.",
    "Retry Level",
    "😅",
  );
}

function drawWin() {
  drawEndScreen(
    "All Levels Complete!",
    "You are a master shopper.",
    "Play Again",
    "🏆",
  );
}

function drawEndScreen(title, subtitle, buttonText, emoji) {
  background(255, 240, 220);

  let cardW = 420;
  let cardH = 240;

  let x = width / 2 - cardW / 2;
  let y = height / 2 - cardH / 2;

  fill(0, 30);
  rect(x + 6, y + 6, cardW, cardH, 18);

  fill(255);
  stroke(220);
  rect(x, y, cardW, cardH, 18);

  textAlign(CENTER);

  textSize(40);
  text(emoji, width / 2, y + 60);

  fill(40);
  textSize(24);
  text(title, width / 2, y + 110);

  textSize(14);
  fill(90);
  text(subtitle, width / 2, y + 140);

  drawAutoButton(width / 2, y + 190, buttonText);
}

function mousePressed() {
  if (buttonBounds) {
    if (
      mouseX > buttonBounds.x &&
      mouseX < buttonBounds.x + buttonBounds.w &&
      mouseY > buttonBounds.y &&
      mouseY < buttonBounds.y + buttonBounds.h
    ) {
      if (gameState === "start") {
        startTransition("instructions");
        startMusic();
        return;
      }

      if (gameState === "instructions") {
        startTransition("game");
        startLevel(1);
        return;
      }

      if (gameState === "fail") {
        startTransition("game");
        startLevel(currentLevel);
        return;
      }

      if (gameState === "levelcomplete") {
        startTransition("game");
        startLevel(currentLevel + 1);
        return;
      }

      if (gameState === "win") {
        startTransition("game");
        startLevel(1);
        return;
      }
    }
  }

  if (gameState !== "game") return;

  if (
    mouseX > width - 200 &&
    mouseX < width - 20 &&
    mouseY > 20 &&
    mouseY < 80
  ) {
    if (hintsLeft > 0) {
      let target = shoppingList.find((i) => !collected.includes(i));
      let targetItem = items.find((it) => it.name === target);

      if (targetItem) {
        teleportFade = 255;

        player.x = targetItem.x;

        highlightedItem = targetItem;
        highlightTimer = 120;

        toastText = "Hint used!";
        toastTimer = 90;
      }

      hintsLeft--;
    }

    return;
  }

  let mx = mouseX + camX;
  let my = mouseY;

  for (let i = 0; i < items.length; i++) {
    let it = items[i];

    if (dist(mx, my, it.x, it.y) < 26) {
      pickups.push({
        x: it.x,
        y: it.y,
        emoji: it.emoji,
        scale: 1,
      });

      collected.push(it.name);
      items.splice(i, 1);

      toastText = "Added " + it.name;
      toastTimer = 90;

      if (collected.length === shoppingList.length) checkLevelResult();

      break;
    }
  }
}

function handleMovement() {
  player.targetSpeed = 0;

  if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
    player.targetSpeed = -4;
    facing = -1;
  }

  if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
    player.targetSpeed = 4;
    facing = 1;
  }

  player.speed = lerp(player.speed, player.targetSpeed, 0.15);

  player.x += player.speed;

  player.x = constrain(player.x, 40, worldWidth - 40);
}

function updateCamera() {
  let targetCam = player.x - width / 2;
  targetCam = constrain(targetCam, 0, worldWidth - width);

  camX = lerp(camX, targetCam, 0.1);
}

function drawAutoButton(cx, cy, label) {
  textSize(16);

  let padding = 30;
  let w = textWidth(label) + padding;
  let h = 48;

  let bx = cx - w / 2;
  let by = cy - h / 2;

  buttonBounds = { x: bx, y: by, w: w, h: h };

  let hover = mouseX > bx && mouseX < bx + w && mouseY > by && mouseY < by + h;

  push();

  translate(cx, cy);

  if (hover) scale(1.05);

  fill(200, 255, 200);
  rectMode(CENTER);
  rect(0, 0, w, h, 12);

  fill(40);
  textAlign(CENTER, CENTER);
  text(label, 0, 2);

  pop();
}

function startMusic() {
  if (!musicStarted) {
    bgMusic.setVolume(0.3);
    bgMusic.loop();
    musicStarted = true;
  }
}

function startTransition(state) {
  nextState = state;
  fadeTarget = 255;
}

function updateFade() {
  fade = lerp(fade, fadeTarget, 0.2);

  if (fade > 250 && nextState) {
    gameState = nextState;
    nextState = null;
    fadeTarget = 0;
  }
}

function drawFade() {
  if (fade < 1) return;

  fill(255, fade);
  rect(0, 0, width, height);
}

function drawTeleportFade() {
  if (teleportFade <= 0) return;

  fill(255, teleportFade);
  rect(0, 0, width, height);

  teleportFade -= 12;
}

function updatePickups() {
  for (let p of pickups) {
    p.y -= 0.6;
    p.scale *= 0.92;
  }

  pickups = pickups.filter((p) => p.scale > 0.05);
}

function drawPickups() {
  for (let p of pickups) {
    push();
    translate(p.x - camX, p.y);
    scale(p.scale);

    textSize(28);
    textAlign(CENTER, CENTER);
    text(p.emoji, 0, 0);

    pop();
  }
}

function drawTopBar() {
  fill(70);
  textAlign(CENTER);
  textSize(18);
  text("🛒 " + aisleName, width / 2, 30);
}

function drawPastelBackground() {
  for (let y = 0; y < height; y++) {
    let c = lerpColor(color(255, 220, 240), color(210, 235, 255), y / height);
    stroke(c);
    line(0, y, width, y);
  }
}

function getHoveredItem() {
  let mx = mouseX + camX;
  let my = mouseY;

  for (let it of items) {
    if (dist(mx, my, it.x, it.y) < 26) return it;
  }

  return null;
}

function drawItemHint() {
  if (!hoveredItem) return;

  textSize(12);

  let padding = 24;
  let w = textWidth(hoveredItem.name) + padding;

  fill(255);
  stroke(200);
  rect(mouseX + 10, mouseY - 32, w, 30, 8);

  fill(40);
  noStroke();
  textAlign(LEFT, CENTER);

  text(hoveredItem.name, mouseX + 20, mouseY - 16);
}

function drawToast() {
  if (toastTimer <= 0) return;

  fill(255);
  stroke(200);

  rect(width / 2 - 120, height - 60, 240, 40, 10);

  fill(40);
  noStroke();

  textAlign(CENTER, CENTER);
  textSize(14);

  text(toastText, width / 2, height - 40);

  toastTimer--;
}

function checkLevelResult() {
  let wrong = false;

  for (let item of collected) {
    if (!shoppingList.includes(item)) {
      wrong = true;
      break;
    }
  }

  if (wrong) {
    gameState = "fail";
    return;
  }

  if (currentLevel < 3) gameState = "levelcomplete";
  else gameState = "win";
}

function keyPressed() {
  if (key === "r") startLevel(currentLevel || 1);
}

function startLevel(levelNum) {
  currentLevel = levelNum;

  let cfg = LEVELS[currentLevel - 1];

  worldWidth = cfg.world;
  aisleName = cfg.aisle || "Grocery";

  collected = [];
  shoppingList = [...cfg.list];

  player.x = 120;
  camX = 0;

  hintsLeft = cfg.hints || 3;

  items = spawnItemsForLevel(worldWidth, shoppingList, cfg.itemsToShow);

  gameState = "game";
}
