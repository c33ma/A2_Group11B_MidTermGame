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
let playerSprite;

function preload() {
  bgMusic = loadSound("music.mp3");

  loadingBg = loadImage("assets/images/loading-bg.png");
  storeBg = loadImage("assets/images/store-bg.png");

  playerSprite = loadImage("assets/images/shoppingcart.png");
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

function drawPixelPanel(x, y, w, h, fillCol = "#f4ecd8", borderCol = "#7a5a3a") {
  push();
  noStroke();

  fill(borderCol);
  rect(x, y, w, h);

  fill(fillCol);
  rect(x + 4, y + 4, w - 8, h - 8);

  fill(255, 255, 255, 28);
  rect(x + 4, y + 4, w - 8, 4);

  fill(0, 0, 0, 14);
  rect(x + 4, y + h - 10, w - 8, 6);
  pop();
}

function drawPixelButton(cx, cy, label) {
  textSize(12);

  let padding = 26;
  let w = textWidth(label) + padding * 2;
  let h = 44;

  let bx = cx - w / 2;
  let by = cy - h / 2;

  buttonBounds = { x: bx, y: by, w: w, h: h };

  let hover = mouseX > bx && mouseX < bx + w && mouseY > by && mouseY < by + h;

  push();

  let offsetY = hover ? -3 : 0;

  noStroke();
  fill("#8a6140");
  rect(bx, by + 5 + offsetY, w, h);

  fill("#c97b4a");
  rect(bx, by + offsetY, w, h);

  fill("#efc66d");
  rect(bx + 4, by + 4 + offsetY, w - 8, h - 10);

  fill("#3f2e1f");
  textAlign(CENTER, CENTER);
  text(label, cx, by + h / 2 + offsetY);

  pop();
}

function drawStart() {
  background("#cdbb9b");

  if (loadingBg) {
    image(loadingBg, 0, 0, width, height);
  }

  fill(0, 0, 0, 28);
  rect(0, 0, width, height);

  drawAutoButton(width / 2, height - 95, "START");
}

function drawInstructions() {
  background("#d8c6a4");

  if (loadingBg) {
    image(loadingBg, 0, 0, width, height);
  }

  fill(0, 0, 0, 65);
  rect(0, 0, width, height);

  drawPixelPanel(120, 90, 660, 260, "#f6edd9", "#7a5a3a");

  textAlign(CENTER);
  fill("#c5281c");
  textSize(20);
  text("HOW TO PLAY", width / 2, 135);

  fill("#3f2e1f");
  textSize(10);
  text("FIND EVERYTHING ON YOUR SHOPPING LIST", width / 2, 190);
  text("MOVE WITH A / D OR ARROW KEYS", width / 2, 225);
  text("CLICK ITEMS TO COLLECT THEM", width / 2, 260);
  text("USE HINTS TO TELEPORT TO THE NEXT ITEM", width / 2, 295);

  drawAutoButton(width / 2, 390, "CONTINUE");
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
    "🥳"
  );
}

function drawFail() {
  drawEndScreen(
    "Wrong Groceries",
    "Some items were not on the list.",
    "Retry Level",
    "😅"
  );
}

function drawWin() {
  drawEndScreen(
    "All Levels Complete!",
    "You are a master shopper.",
    "Play Again",
    "🏆"
  );
}

function drawEndScreen(title, subtitle, buttonText, emoji) {
  background("#d8c6a4");

  if (loadingBg) {
    image(loadingBg, 0, 0, width, height);
  }

  fill(0, 0, 0, 80);
  rect(0, 0, width, height);

  drawPixelPanel(width / 2 - 250, height / 2 - 130, 500, 260, "#f6edd9", "#7a5a3a");

  textAlign(CENTER);
  textSize(34);
  text(emoji, width / 2, height / 2 - 45);

  fill("#c5281c");
  textSize(16);
  text(title.toUpperCase(), width / 2, height / 2 + 5);

  fill("#3f2e1f");
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

    if (dist(mx, my, it.x, it.y) < 30) {
      pickups.push({
        x: it.x,
        y: it.y,
        emoji: it.emoji,
        name: it.name,
        scale: 1
      });

      collected.push(it.name);
      items.splice(i, 1);

      toastText = "Added " + it.name;
      toastTimer = 90;

      if (collected.length === shoppingList.length) {
        checkLevelResult();
      }

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

    textSize(38);
    textAlign(CENTER, CENTER);
    text(p.emoji, 0, 0);

    pop();
  }
}

function drawTopBar() {
  drawPixelPanel(width / 2 - 170, 10, 340, 38, "#f6edd9", "#7a5a3a");

  fill("#3f2e1f");
  textAlign(CENTER, CENTER);
  textSize(10);
  text(aisleName.toUpperCase(), width / 2, 28);
}

function drawStoreBackground() {
  background("#d5c2a1");

  if (storeBg) {
    image(storeBg, 0, 0, width, height);
    fill(255, 255, 255, 16);
    rect(0, 0, width, height);
  }
}

function getHoveredItem() {
  let mx = mouseX + camX;
  let my = mouseY;

  for (let it of items) {
    if (dist(mx, my, it.x, it.y) < 30) return it;
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
  fill("#7a5a3a");
  rect(mouseX + 12, mouseY - 34, w, 24);

  fill("#f6edd9");
  rect(mouseX + 16, mouseY - 30, w - 8, 16);

  fill("#3f2e1f");
  textAlign(LEFT, CENTER);
  text(label, mouseX + 24, mouseY - 21);
}

function drawToast() {
  if (toastTimer <= 0) return;

  let w = 280;
  let h = 38;
  let x = width / 2 - w / 2;
  let y = height - 58;

  noStroke();
  fill("#7a5a3a");
  rect(x, y, w, h);

  fill("#f6edd9");
  rect(x + 4, y + 4, w - 8, h - 8);

  fill("#3f2e1f");
  textAlign(CENTER, CENTER);
  textSize(9);
  text(toastText.toUpperCase(), width / 2, y + 19);

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