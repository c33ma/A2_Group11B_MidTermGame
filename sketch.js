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

let loadingBg;
let storeBg;

function preload() {
  bgMusic = loadSound("music.mp3");
  loadingBg = loadImage("assets/loading-bg.png");
  storeBg = loadImage("assets/store-bg.png");
}

function setup() {
  let canvas = createCanvas(900, 500);
  canvas.parent("game-container");

  pixelDensity(1);
  noSmooth();
  textFont("Press Start 2P");

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

function drawPixelPanel(x, y, w, h, fillCol = "#f4ecd8", borderCol = "#2f2a24") {
  push();
  rectMode(CORNER);
  noStroke();

  fill(borderCol);
  rect(x, y, w, h);

  fill("#ffffff22");
  rect(x + 4, y + 4, w - 8, 6);

  fill(fillCol);
  rect(x + 6, y + 6, w - 12, h - 12);

  fill("#00000018");
  rect(x + 6, y + h - 14, w - 12, 8);
  pop();
}

function drawPixelButton(cx, cy, label) {
  textSize(12);

  let padding = 28;
  let w = textWidth(label) + padding * 2;
  let h = 46;

  let bx = cx - w / 2;
  let by = cy - h / 2;

  buttonBounds = { x: bx, y: by, w: w, h: h };

  let hover = mouseX > bx && mouseX < bx + w && mouseY > by && mouseY < by + h;

  push();
  if (hover) by -= 3;

  noStroke();
  fill("#5b2d22");
  rect(bx, by + 6, w, h);

  fill("#c95c43");
  rect(bx, by, w, h);

  fill("#efc66d");
  rect(bx + 4, by + 4, w - 8, h - 12);

  fill("#2f2a24");
  textAlign(CENTER, CENTER);
  text(label, cx, by + h / 2);
  pop();
}

function drawStart() {
  background(0);

  if (loadingBg) {
    image(loadingBg, 0, 0, width, height);
  }

  fill(0, 110);
  rect(0, 0, width, height);

  drawPixelPanel(width / 2 - 290, 95, 580, 230, "#f6edd9", "#2f2a24");

  fill("#c5281c");
  textAlign(CENTER);
  textSize(22);
  text("GROCERY HELPER", width / 2, 155);

  fill("#2f2a24");
  textSize(10);
  text("FIND EVERYTHING ON YOUR SHOPPING LIST", width / 2, 205);
  text("AND CLEAR ALL THREE AISLES", width / 2, 235);

  textSize(26);
  text("🛒", width / 2, 278);

  drawAutoButton(width / 2, 375, "START");
}

function drawInstructions() {
  if (loadingBg) {
    image(loadingBg, 0, 0, width, height);
  } else {
    background("#d8c6a4");
  }

  fill(0, 110);
  rect(0, 0, width, height);

  drawPixelPanel(110, 60, 680, 340, "#f6edd9", "#2f2a24");

  textAlign(CENTER);
  fill("#c5281c");
  textSize(20);
  text("HOW TO PLAY", width / 2, 115);

  fill("#2f2a24");
  textSize(10);

  text("MOVE WITH A / D OR ARROW KEYS", width / 2, 180);
  text("CLICK ITEMS TO COLLECT THEM", width / 2, 220);
  text("ONLY PICK WHAT IS ON YOUR LIST", width / 2, 260);
  text("USE HINTS TO TELEPORT TO THE NEXT ITEM", width / 2, 300);

  drawAutoButton(width / 2, 380, "CONTINUE");
}

function drawGame() {
  drawStoreBackground();

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
    "Continue",
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
  if (loadingBg) {
    image(loadingBg, 0, 0, width, height);
  } else {
    background("#d8c6a4");
  }

  fill(0, 110);
  rect(0, 0, width, height);

  drawPixelPanel(width / 2 - 250, height / 2 - 130, 500, 260, "#f6edd9", "#2f2a24");

  textAlign(CENTER);
  textSize(34);
  text(emoji, width / 2, height / 2 - 45);

  fill("#c5281c");
  textSize(16);
  text(title.toUpperCase(), width / 2, height / 2 + 5);

  fill("#2f2a24");
  textSize(9);
  text(subtitle.toUpperCase(), width / 2, height / 2 + 42);

  drawAutoButton(width / 2, height / 2 + 95, buttonText.toUpperCase());
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
  drawPixelButton(cx, cy, label);
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
  drawPixelPanel(width / 2 - 170, 10, 340, 42, "#f6edd9", "#2f2a24");

  fill("#2f2a24");
  textAlign(CENTER, CENTER);
  textSize(10);
  text(aisleName.toUpperCase(), width / 2, 31);
}

function drawStoreBackground() {
  background("#d5c2a1");

  if (storeBg) {
    image(storeBg, 0, 0, width, height);
    fill(255, 255, 255, 40);
    rect(0, 0, width, height);
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

  textSize(9);

  let label = hoveredItem.name.toUpperCase();
  let padding = 18;
  let w = textWidth(label) + padding * 2;

  noStroke();
  fill("#2f2a24");
  rect(mouseX + 12, mouseY - 34, w, 26);

  fill("#f6edd9");
  rect(mouseX + 16, mouseY - 30, w - 8, 18);

  fill("#2f2a24");
  textAlign(LEFT, CENTER);
  text(label, mouseX + 24, mouseY - 21);
}

function drawToast() {
  if (toastTimer <= 0) return;

  let w = 280;
  let h = 42;
  let x = width / 2 - w / 2;
  let y = height - 62;

  noStroke();
  fill("#2f2a24");
  rect(x, y, w, h);

  fill("#f6edd9");
  rect(x + 6, y + 6, w - 12, h - 12);

  fill("#2f2a24");
  textAlign(CENTER, CENTER);
  textSize(9);
  text(toastText.toUpperCase(), width / 2, y + 21);

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