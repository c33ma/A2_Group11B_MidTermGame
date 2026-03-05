let gameState = "start";

let worldWidth = 2200;
let floorY = 420;

let player = { x: 120, y: floorY, speed: 4 };

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
  if (gameState === "start") {
    drawCuteStartScreen();
    return;
  }

  if (gameState === "levelcomplete") {
    drawCuteLevelComplete();
    return;
  }

  if (gameState === "fail") {
    drawCuteFailScreen();
    return;
  }

  if (gameState === "win") {
    drawCuteWinScreen();
    return;
  }

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
}

function drawCuteStartScreen() {
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
  text("Collect the groceries!", width / 2, 180);

  fill(200, 255, 200);
  rect(width / 2 - 70, 260, 140, 40, 10);

  fill(40);
  textSize(14);
  text("Start 🛒", width / 2, 285);
}

function drawCuteLevelComplete() {
  background(220, 255, 220);

  textAlign(CENTER);

  fill(40);
  textSize(36);
  text("Level " + currentLevel + " Complete ✔", width / 2, 200);

  textSize(18);
  text("Click to continue shopping!", width / 2, 250);
}

function drawCuteFailScreen() {
  background(255, 220, 220);

  textAlign(CENTER);

  fill(40);
  textSize(36);
  text("Oops! Wrong groceries ❌", width / 2, 200);

  textSize(18);
  text("Your cart had items not on the list.", width / 2, 240);

  textSize(16);
  text("Press R to retry the level", width / 2, 280);
}

function drawCuteWinScreen() {
  background(255, 235, 210);

  textAlign(CENTER);

  fill(40);
  textSize(38);
  text("You finished all levels! 🎉", width / 2, 200);

  textSize(18);
  text("Master Grocery Shopper!", width / 2, 240);

  textSize(16);
  text("Press R to play again", width / 2, 280);
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
    if (dist(mx, my, it.x, it.y) < 26) {
      return it;
    }
  }

  return null;
}

function drawItemHint() {
  if (!hoveredItem) return;

  fill(255);
  stroke(200);
  rect(mouseX + 10, mouseY - 30, 140, 30, 6);

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

  rect(width / 2 - 110, height - 60, 220, 40, 10);

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

    if (mouseX > bx && mouseX < bx + 140 && mouseY > by && mouseY < by + 40) {
      startLevel(1);
    }

    return;
  }

  if (gameState === "levelcomplete") {
    startLevel(currentLevel + 1);
    return;
  }

  if (
    mouseX > width - 190 &&
    mouseX < width - 20 &&
    mouseY > 40 &&
    mouseY < 86
  ) {
    if (hintsLeft > 0) {
      let target = shoppingList.find((i) => !collected.includes(i));

      let targetItem = items.find((it) => it.name === target);

      if (targetItem) {
        player.x = targetItem.x;

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
      collected.push(it.name);

      items.splice(i, 1);

      if (shoppingList.includes(it.name)) {
        toastText = "Added " + it.name + " ✔";
      } else {
        toastText = "Added " + it.name + " (not on list)";
      }

      toastTimer = 90;

      if (collected.length === shoppingList.length) {
        checkLevelResult();
      }

      break;
    }
  }
}

function checkLevelResult() {
  let wrongItem = false;

  for (let item of collected) {
    if (!shoppingList.includes(item)) {
      wrongItem = true;
      break;
    }
  }

  if (wrongItem) {
    gameState = "fail";
    return;
  }

  if (currentLevel < 3) {
    gameState = "levelcomplete";
  } else {
    gameState = "win";
  }
}

function keyPressed() {
  if (key === "r") {
    startLevel(currentLevel || 1);
  }
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
