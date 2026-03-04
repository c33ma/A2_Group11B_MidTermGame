// ui.js
// All drawing functions + toast + hover hint

function drawStartScreen() {
  textAlign(CENTER);
  fill(50);
  textSize(40);
  text("Grocery Helper", width / 2, 170);

  textSize(18);
  text("Walk the aisle, hover for hints, and collect your list.", width / 2, 220);

  textSize(16);
  text("A/D or ←/→ to move • Click items to pick up", width / 2, 255);
  text("Click anywhere to start Level 1", width / 2, 300);
}

function drawLevelComplete(currentLevel) {
  textAlign(CENTER);
  fill(50);
  textSize(38);
  text(`Level ${currentLevel} Complete!`, width / 2, 210);

  textSize(18);
  text("Click to start the next level", width / 2, 255);
}

function drawWinAll() {
  textAlign(CENTER);
  fill(50);
  textSize(40);
  text("You finished all 6 levels! 🎉", width / 2, 210);

  textSize(18);
  text("Click to play again from Level 1", width / 2, 255);
}

function drawAisleWorld(worldWidth, floorY, shelfRows) {
  // shelves background band
  fill(220);
  rect(0, 120, worldWidth, 200);

  // shelf planks
  for (let r = 1; r <= shelfRows; r++) {
    let y = shelfYForRow(r) - 55;
    fill(200);
    rect(0, y, worldWidth, 14);
  }

  // floor
  fill(235);
  rect(0, floorY, worldWidth, 80);
}

function drawPlayerWorld(player) {
  fill(90);
  ellipse(player.x, player.y, player.r * 2);
  textAlign(CENTER, CENTER);
  textSize(18);
  text("🛒", player.x, player.y - 1);
}

function drawItemsWorld(items) {
  textAlign(CENTER, CENTER);
  textSize(40);

  for (let it of items) {
    fill(255);
    rect(it.x - 26, it.y - 44, 52, 52, 10);
    fill(0);
    text(it.emoji, it.x, it.y - 18);
  }
}

function drawHoverHintWorld(items, camX) {
  let mx = mouseX + camX;
  let my = mouseY;

  for (let it of items) {
    if (dist(mx, my, it.x, it.y - 18) < it.radius) {
      let bubbleW = 240;
      let bubbleH = 34;

      fill(255);
      stroke(160);
      rect(mx - bubbleW / 2, my - 55, bubbleW, bubbleH, 8);
      noStroke();

      fill(0);
      textAlign(CENTER, CENTER);
      textSize(12);
      text(it.hint, mx, my - 38);
      break;
    }
  }
}

function drawShoppingListUI(currentLevel, collected, shoppingList) {
  fill(255);
  stroke(200);
  rect(20, 20, 240, 150, 12);
  noStroke();

  fill(0);
  textAlign(LEFT);
  textSize(16);
  text(`Level ${currentLevel} / 6`, 35, 45);
  text("Shopping List", 35, 68);

  for (let i = 0; i < shoppingList.length; i++) {
    let item = shoppingList[i];

    if (collected.includes(item)) {
      fill(0, 160, 0);
      text("✔ " + item, 35, 95 + i * 20);
    } else {
      fill(0);
      text("- " + item, 35, 95 + i * 20);
    }
  }
}

function drawToastUI(toastText, toastTimer) {
  if (toastTimer <= 0 || !toastText) return;

  let w = 560;
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
  text("Move: A/D or ←/→   •   Click items to pick up   •   Hover for hints", width - 20, 25);
}