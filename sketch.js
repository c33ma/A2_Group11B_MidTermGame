// sketch.js
// Main game loop + movement + camera + click logic

let gameState = "start"; // start, game, levelComplete, winAll

// WORLD + PLAYER + CAMERA
let worldWidth = 2200;
let floorY = 360;
let player = { x: 120, y: floorY, r: 18, speed: 4 };
let camX = 0;

// LEVEL DATA
let currentLevel = 0; // 1..6
let shelfRows = 1;

// GAME DATA
let items = [];
let shoppingList = [];
let collected = [];

// TOAST
let toastText = "";
let toastTimer = 0;

function setup() {
  let canvas = createCanvas(900, 500);
  canvas.parent("game-container");
}

function draw() {
  background(245);
  if (toastTimer > 0) toastTimer--;

  if (gameState === "start") {
    drawStartScreen();
    return;
  }

  if (gameState === "levelComplete") {
    drawLevelComplete(currentLevel);
    return;
  }

  if (gameState === "winAll") {
    drawWinAll();
    return;
  }

  // GAME
  handleMovement();
  updateCamera();

  push();
  translate(-camX, 0);

  drawAisleWorld(worldWidth, floorY, shelfRows);
  drawItemsWorld(items);
  drawPlayerWorld(player);
  drawHoverHintWorld(items, camX);

  pop();

  drawShoppingListUI(currentLevel, collected, shoppingList);
  drawToastUI(toastText, toastTimer);
  drawControlsUI();
}

// ---------- Level control ----------
function startLevel(levelNum) {
  currentLevel = levelNum;

  let cfg = LEVELS[currentLevel - 1];
  shelfRows = cfg.shelves;
  worldWidth = cfg.world;

  collected = [];
  shoppingList = [...cfg.list];

  player.x = 120;
  camX = 0;

  items = spawnItemsForLevel(worldWidth, shelfRows, shoppingList, cfg.itemsToShow);

  gameState = "game";
}

function finishLevelIfDone() {
  if (collected.length === shoppingList.length) {
    if (currentLevel < LEVELS.length) gameState = "levelComplete";
    else gameState = "winAll";
  }
}

// ---------- Movement + camera ----------
function handleMovement() {
  if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) player.x -= player.speed;
  if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) player.x += player.speed;
  player.x = constrain(player.x, 40, worldWidth - 40);
}

function updateCamera() {
  camX = constrain(player.x - width / 2, 0, worldWidth - width);
}

// ---------- Toast + picking ----------
function showToast(msg) {
  toastText = msg;
  toastTimer = 120;
}

function tryPickItem(itemName) {
  if (!shoppingList.includes(itemName)) {
    showToast("Not on your list — check the Shopping List ✨");
    return;
  }
  if (collected.includes(itemName)) {
    showToast("You already got that one 😌");
    return;
  }

  collected.push(itemName);
  showToast("Nice! Added to your cart ✅");
  finishLevelIfDone();
}

// ---------- Mouse input ----------
function mousePressed() {
  if (gameState === "start") {
    startLevel(1);
    return;
  }

  if (gameState === "levelComplete") {
    startLevel(currentLevel + 1);
    return;
  }

  if (gameState === "winAll") {
    startLevel(1);
    return;
  }

  // In-game click uses world coords
  let mx = mouseX + camX;
  let my = mouseY;

  for (let it of items) {
    if (dist(mx, my, it.x, it.y - 18) < it.radius) {
      tryPickItem(it.name);
      break;
    }
  }
}