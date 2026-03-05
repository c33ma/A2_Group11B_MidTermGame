let gameState = "start";

let worldWidth = 2200;
let floorY = 360;

let player = { x: 120, y: floorY, speed: 4 };

let camX = 0;

let currentLevel = 0;
let shelfRows = 1;
let aisleName = "";

let items = [];
let shoppingList = [];
let collected = [];

let hintsLeft = 0;

let itemEmojiMap = {};
let hoveredItem = null;

let fallingFruits = [];
let facing = 1;

let toastText = "";
let toastTimer = 0;

function setup() {
  let canvas = createCanvas(900, 500);
  canvas.parent("game-container");

  textFont("monospace");

  for (let it of ITEM_POOL) {
    itemEmojiMap[it.name] = it.emoji;
  }

  // falling fruit decoration
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
  if (gameState === "start") {
    drawStartScreen();
    return;
  }

  drawPastelBackground();

  handleMovement();
  updateCamera();

  hoveredItem = getHoveredItem();

  push();
  translate(-camX, 0);

  drawAisleWorld(worldWidth, floorY, shelfRows);
  drawItemsWorld(items);
  drawPlayerWorld(player);

  pop();

  drawShoppingListUI(currentLevel, collected, shoppingList);
  drawHintUI(hintsLeft);
  drawCartUI(collected, itemEmojiMap);

  drawItemHint();
  drawToast();
  drawTopBar();
}

function drawStartScreen() {
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
  text("Collect the correct groceries!", width / 2, 180);

  fill(255, 200, 220);
  rect(width / 2 - 70, 260, 140, 40, 10);

  fill(40);
  textSize(14);
  text("Start 🛒", width / 2, 285);
}

function drawTopBar() {
  fill(70);
  textAlign(CENTER);
  textSize(18);

  text("🍎 " + aisleName + " Aisle 🍌", width / 2, 30);
}

function drawPastelBackground() {
  for (let y = 0; y < height; y++) {
    let c = lerpColor(color(255, 220, 240), color(210, 235, 255), y / height);
    stroke(c);
    line(0, y, width, y);
  }
}

function drawAisleWorld(worldWidth, floorY, shelfRows) {
  for (let x = 0; x < worldWidth; x += 40) {
    for (let y = floorY; y < height; y += 40) {
      fill(240);
      stroke(220);
      rect(x, y, 40, 40);
    }
  }

  let shelfWidth = 170;

  for (let r = 0; r < shelfRows; r++) {
    let y = floorY - 130 - r * 110;

    for (let x = 200; x < worldWidth; x += 260) {
      fill(255, 238, 210);
      noStroke();
      rect(x - 10, y - 40, shelfWidth + 20, 90, 12);

      fill(255, 200, 160);
      rect(x, y - 35, shelfWidth, 14, 6);
      rect(x, y + 5, shelfWidth, 14, 6);
    }
  }
}

function drawItemsWorld(items) {
  for (let it of items) {
    let hover = dist(mouseX + camX, mouseY, it.x, it.y) < 20;

    push();
    translate(it.x, it.y - 10);

    if (hover) scale(1.25);

    fill(255);
    stroke(220);
    rect(-18, -28, 36, 36, 6);

    textAlign(CENTER, CENTER);
    textSize(22);
    text(it.emoji, 0, -10);

    pop();
  }
}

function drawPlayerWorld(player) {
  push();

  translate(player.x, player.y);

  scale(-facing, 1);

  textAlign(CENTER, CENTER);
  textSize(42);
  text("🛒", 0, -15);

  pop();
}

function getHoveredItem() {
  let mx = mouseX + camX;
  let my = mouseY;

  for (let it of items) {
    if (dist(mx, my, it.x, it.y) < 20) {
      return it;
    }
  }

  return null;
}

function drawItemHint() {
  if (!hoveredItem) return;

  fill(255);
  stroke(200);
  rect(mouseX + 10, mouseY - 30, 120, 30, 6);

  fill(40);
  noStroke();
  textSize(12);
  textAlign(LEFT, CENTER);

  text(hoveredItem.name, mouseX + 15, mouseY - 15);
}

function drawToast() {
  if (toastTimer <= 0) return;

  fill(255);
  stroke(200);
  rect(width / 2 - 100, height - 60, 200, 40, 10);

  fill(40);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(14);

  text(toastText, width / 2, height - 40);

  toastTimer--;
}

function handleMovement() {
  if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
    player.x -= player.speed;
    facing = -1;
  }

  if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
    player.x += player.speed;
    facing = 1;
  }

  player.x = constrain(player.x, 40, worldWidth - 40);
}

function updateCamera() {
  camX = constrain(player.x - width / 2, 0, worldWidth - width);
}

function mousePressed() {
  if (gameState === "start") {
    let bx = width / 2 - 70;
    let by = 260;
    let bw = 140;
    let bh = 40;

    if (mouseX > bx && mouseX < bx + bw && mouseY > by && mouseY < by + bh) {
      startLevel(1);
    }

    return;
  }

  let mx = mouseX + camX;
  let my = mouseY;

  for (let i = 0; i < items.length; i++) {
    let it = items[i];

    if (dist(mx, my, it.x, it.y) < 20) {
      if (shoppingList.includes(it.name)) {
        collected.push(it.name);
        items.splice(i, 1);

        toastText = "Added " + it.name + " ✔";
        toastTimer = 90;
      } else {
        toastText = "Wrong item ❌";
        toastTimer = 90;
      }

      break;
    }
  }
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

  items = spawnItemsForLevel(
    worldWidth,
    shelfRows,
    shoppingList,
    cfg.itemsToShow,
    cfg.allowed,
  );

  gameState = "game";
}
<<<<<<< HEAD

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
    rubberduck: "Quack! Wrong aisle 🦆",
  };

  if (!shoppingList.includes(itemName)) {
    showToast(
      funny[itemName] || "Not on your list — check the Shopping List ✨",
    );
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
=======
>>>>>>> 22df219ab658f817ecc1defda9468bad88a34bdc
