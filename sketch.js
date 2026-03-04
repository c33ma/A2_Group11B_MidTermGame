let gameState = "start";

// WORLD + PLAYER
let worldWidth = 2200; // bigger = more aisle to explore
let floorY = 360;
let player = { x: 120, y: floorY, r: 18, speed: 4 };
let camX = 0;

// ITEMS + LIST
let items = [];
let shoppingList = ["apple", "milk", "bread"];
let collected = [];

// FEEDBACK MESSAGE (toast)
let toastText = "";
let toastTimer = 0; // frames remaining

let hints = {
  apple: "Red fruit that grows on trees!",
  banana: "Long yellow fruit monkeys love!",
  milk: "White drink from cows!",
  bread: "Soft food used for sandwiches!",
  juice: "Sweet drink made from fruit!",
  cereal: "Crunchy breakfast in a box!",
  yogurt: "Creamy snack in a cup!",
  cheese: "A dairy snack that's yellow-ish!",
  cookie: "Sweet treat that pairs with milk!",
  carrot: "Orange veggie that bunnies love!"
};

function setup() {
  let canvas = createCanvas(900, 500);
  canvas.parent("game-container");

  // Spread items across a long aisle
  items = [
    makeItem("apple", 180, 230, "🍎"),
    makeItem("banana", 360, 230, "🍌"),
    makeItem("milk", 540, 230, "🥛"),
    makeItem("bread", 720, 230, "🍞"),
    makeItem("juice", 900, 230, "🧃"),
    makeItem("cereal", 1120, 230, "🥣"),
    makeItem("yogurt", 1300, 230, "🍦"),
    makeItem("cheese", 1480, 230, "🧀"),
    makeItem("cookie", 1660, 230, "🍪"),
    makeItem("carrot", 1840, 230, "🥕")
  ];
}

function draw() {
  background(245);

  if (toastTimer > 0) toastTimer--;

  if (gameState === "start") {
    drawStartScreen();
    return;
  }

  if (gameState === "win") {
    drawWinScreen();
    return;
  }

  // GAME
  handleMovement();
  updateCamera();

  // Draw WORLD (with camera)
  push();
  translate(-camX, 0);

  drawAisleWorld();
  drawItemsWorld();
  drawPlayerWorld();
  drawHoverHintWorld();

  pop();

  // Draw UI (no camera translate)
  drawShoppingListUI();
  drawToastUI();
  drawControlsUI();
}

function makeItem(name, x, y, emoji) {
  return { name, x, y, emoji, radius: 28 };
}

function drawStartScreen() {
  textAlign(CENTER);
  fill(50);
  textSize(40);
  text("Grocery Helper", width / 2, 175);

  textSize(18);
  text("Walk through the aisle and grab the items on your list.", width / 2, 225);

  textSize(16);
  text("Controls: A/D or Arrow Keys to move • Click items to pick up", width / 2, 260);
  text("Click anywhere to start", width / 2, 300);
}

function drawWinScreen() {
  textAlign(CENTER);
  fill(50);
  textSize(40);
  text("Shopping Complete!", width / 2, 220);

  textSize(18);
  text("Click to play again", width / 2, 260);
}

function handleMovement() {
  if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) player.x -= player.speed;  // A / left
  if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) player.x += player.speed; // D / right

  player.x = constrain(player.x, 40, worldWidth - 40);
}

function updateCamera() {
  camX = constrain(player.x - width / 2, 0, worldWidth - width);
}

function drawAisleWorld() {
  // shelves band
  fill(220);
  rect(0, 170, worldWidth, 140);

  // shelf line
  fill(200);
  rect(0, 150, worldWidth, 20);

  // floor
  fill(235);
  rect(0, floorY, worldWidth, 80);
}

function drawPlayerWorld() {
  // cute lil "cart" vibe
  fill(90);
  ellipse(player.x, player.y, player.r * 2);

  textAlign(CENTER, CENTER);
  textSize(18);
  text("🛒", player.x, player.y - 1);
}

function drawItemsWorld() {
  textSize(40);
  textAlign(CENTER, CENTER);

  for (let it of items) {
    // slight shelf “slot”
    fill(255);
    rect(it.x - 26, it.y - 40, 52, 52, 10);

    // emoji item
    fill(0);
    text(it.emoji, it.x, it.y - 14);
  }
}

function drawHoverHintWorld() {
  let mx = mouseX + camX;
  let my = mouseY;

  for (let it of items) {
    if (dist(mx, my, it.x, it.y - 14) < it.radius) {
      // hint bubble
      let msg = hints[it.name] || "Hmm… what is this?";
      let bubbleW = 220;
      let bubbleH = 34;

      fill(255);
      stroke(160);
      rect(mx - bubbleW / 2, my - 55, bubbleW, bubbleH, 8);
      noStroke();

      fill(0);
      textAlign(CENTER, CENTER);
      textSize(12);
      text(msg, mx, my - 38);
      break;
    }
  }
}

function drawShoppingListUI() {
  fill(255);
  stroke(200);
  rect(20, 20, 220, 125, 12);
  noStroke();

  fill(0);
  textAlign(LEFT);
  textSize(16);
  text("Shopping List", 35, 45);

  for (let i = 0; i < shoppingList.length; i++) {
    let item = shoppingList[i];
    if (collected.includes(item)) {
      fill(0, 160, 0);
      text("✔ " + item, 35, 72 + i * 22);
    } else {
      fill(0);
      text("- " + item, 35, 72 + i * 22);
    }
  }
}

function drawToastUI() {
  if (toastTimer <= 0 || !toastText) return;

  let w = 520;
  let h = 44;
  let x = width / 2 - w / 2;
  let y = height - 70;

  fill(255);
  stroke(180);
  rect(x, y, w, h, 12);
  noStroke();

  fill(0);
  textAlign(CENTER, CENTER);
  textSize(14);
  text(toastText, width / 2, y + h / 2);
}

function drawControlsUI() {
  fill(0, 0, 0, 120);
  textAlign(RIGHT);
  textSize(12);
  text("Move: A/D or ←/→   •   Click items to pick up", width - 20, 25);
}

function showToast(msg) {
  toastText = msg;
  toastTimer = 120; // ~2 seconds at 60fps
}

function tryPickItem(itemName) {
  if (!shoppingList.includes(itemName)) {
    showToast("Not on your list — try checking the Shopping List ✨");
    return;
  }

  if (collected.includes(itemName)) {
    showToast("You already got that one! Keep going 😌");
    return;
  }

  collected.push(itemName);
  showToast("Nice! Added to your cart ✅");

  if (collected.length === shoppingList.length) {
    gameState = "win";
  }
}

function mousePressed() {
  if (gameState === "start") {
    gameState = "game";
    return;
  }

  if (gameState === "win") {
    collected = [];
    player.x = 120;
    gameState = "start";
    return;
  }

  // In-game clicking uses world coords
  let mx = mouseX + camX;
  let my = mouseY;

  // Check if clicking on an item
  let clickedSomething = false;
  for (let it of items) {
    if (dist(mx, my, it.x, it.y - 14) < it.radius) {
      clickedSomething = true;
      tryPickItem(it.name);
      break;
    }
  }

  if (!clickedSomething) {
    // optional: no message if clicking empty space (keeps it less spammy)
  }
}