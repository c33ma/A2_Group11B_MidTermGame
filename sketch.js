// sketch.js

let gameState = "start"; // start, game, levelComplete, winAll

let worldWidth = 2200;
let floorY = 360;
let player = { x: 120, y: floorY, r: 18, speed: 4 };
let camX = 0;

let currentLevel = 0;
let shelfRows = 1;
let aisleName = "";

let items = [];
let shoppingList = [];
let collected = [];

let toastText = "";
let toastTimer = 0;

// hint system
let hintsLeft = 0;
let catActive = false;
let catTargetX = 0;

// quick emoji map for cart UI
let itemEmojiMap = {};

// tracks which shelf item is hovered
let hoveredItem = null;

function setup() {
  let canvas = createCanvas(900, 500);
  canvas.parent("game-container");

  // build emoji map from ITEM_POOL
  for (let it of ITEM_POOL) itemEmojiMap[it.name] = it.emoji;
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

  handleMovement();
  updateCamera();
  updateCat();

  // compute hovered item each frame (world coords)
  hoveredItem = getHoveredItem();

  // WORLD
  push();
  translate(-camX, 0);

  drawAisleWorld(worldWidth, floorY, shelfRows);
  drawItemsWorld(items, camX);
  drawPlayerWorld(player);

  // cat indicator
  if (catActive) drawCatArrowWorld();

  pop();

  // UI (order matters: list first, then smart hint can decide to flip above list if needed)
  drawShoppingListUI(currentLevel, collected, shoppingList);
  drawHoverHintSmart(hoveredItem, camX);
  drawHintUI(hintsLeft);
  drawCartUI(collected, itemEmojiMap);
  drawToastUI(toastText, toastTimer);

  // aisle label
  fill(0, 0, 0, 120);
  textAlign(CENTER);
  textSize(12);
  text(aisleName, width / 2, 25);

  drawControlsUI();
}

// Returns the item the mouse is hovering over (or null)
function getHoveredItem() {
  let mx = mouseX + camX;
  let my = mouseY;

  for (let it of items) {
    if (dist(mx, my, it.x, it.y - 18) < it.radius) {
      return it;
    }
  }
  return null;
}

function startLevel(levelNum) {
  currentLevel = levelNum;

  let cfg = LEVELS[currentLevel - 1];
  shelfRows = cfg.shelves;
  worldWidth = cfg.world;
  aisleName = cfg.aisle || "";

  collected = [];
  shoppingList = [...cfg.list];

  player.x = 120;
  camX = 0;

  hintsLeft = cfg.hints ?? 1;
  catActive = false;
  hoveredItem = null;

  items = spawnItemsForLevel(
    worldWidth,
    shelfRows,
    shoppingList,
    cfg.itemsToShow,
    cfg.allowed
  );

  gameState = "game";
}

function finishLevelIfDone() {
  if (collected.length === shoppingList.length) {
    if (currentLevel < LEVELS.length) gameState = "levelComplete";
    else gameState = "winAll";
  }
}

function handleMovement() {
  if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) player.x -= player.speed;
  if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) player.x += player.speed;
  player.x = constrain(player.x, 40, worldWidth - 40);
}

function updateCamera() {
  camX = constrain(player.x - width / 2, 0, worldWidth - width);
}

function showToast(msg) {
  toastText = msg;
  toastTimer = 120;
}

function tryPickItem(itemName) {
  const funny = {
    teddy: "Bestie that’s a teddy bear 🧸 not groceries 😭",
    socks: "Socks are cute but not on the list 🧦",
    toiletpaper: "Important item… but not on your list 🧻",
    rubberduck: "Quack! Wrong aisle 🦆"
  };

  if (!shoppingList.includes(itemName)) {
    showToast(funny[itemName] || "Not on your list — check the Shopping List ✨");
    return;
  }

  if (collected.includes(itemName)) {
    showToast("You already got that one 😌");
    return;
  }

  collected.push(itemName);
  showToast("Nice! Added to your cart ✅");

  // if cat was guiding to that spot, stop guiding
  if (catActive && abs(player.x - catTargetX) < 80) catActive = false;

  finishLevelIfDone();
}

// ---------- CAT HINT ----------
function useHint() {
  if (hintsLeft <= 0) {
    showToast("No hints left this level 😼");
    return;
  }

  let remaining = shoppingList.filter((n) => !collected.includes(n));
  if (remaining.length === 0) return;

  let targetName = random(remaining);
  let target = items.find((it) => it.name === targetName);

  if (!target) {
    showToast("Cat can't find it… try exploring!");
    return;
  }

  hintsLeft--;
  catActive = true;
  catTargetX = target.x;

  showToast(`🐱 Follow the cat! It knows where "${targetName}" is.`);
}

function updateCat() {
  if (!catActive) return;

  if (abs(player.x - catTargetX) < 60) {
    catActive = false;
    showToast("🐱 Here it is! Hover + click to pick it up.");
  }
}

function drawCatArrowWorld() {
  let dir = catTargetX > player.x ? 1 : -1;
  let arrowX = player.x + dir * 40;
  let arrowY = player.y - 60;

  textAlign(CENTER, CENTER);
  textSize(22);
  text("🐱", player.x, player.y - 60);

  textSize(24);
  text(dir === 1 ? "➡️" : "⬅️", arrowX, arrowY);
}

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

  // click hint button area (top-right)
  if (
    mouseX > width - 190 &&
    mouseX < width - 20 &&
    mouseY > 40 &&
    mouseY < 86
  ) {
    useHint();
    return;
  }

  // in-game click for items (world coords)
  let mx = mouseX + camX;
  let my = mouseY;

  for (let it of items) {
    if (dist(mx, my, it.x, it.y - 18) < it.radius) {
      tryPickItem(it.name);
      break;
    }
  }
}

// state transitions
function keyPressed() {
  if (gameState === "game" && (key === "h" || key === "H")) {
    useHint();
  }
}