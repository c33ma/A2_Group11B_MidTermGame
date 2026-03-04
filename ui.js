// ui.js
// Drawing functions + toast + SMART hover hint (shows over item, but flips above shopping list if blocked)

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

function drawItemsWorld(items, camX) {
  textAlign(CENTER, CENTER);
  textSize(40);

  let mx = mouseX + camX;
  let my = mouseY;

  for (let it of items) {
    let hovered = dist(mx, my, it.x, it.y - 18) < it.radius;

    // slot background + hover glow
    if (hovered) {
      stroke(120);
      strokeWeight(3);
      fill(255);
      rect(it.x - 28, it.y - 46, 56, 56, 12);
      noStroke();
    } else {
      fill(255);
      rect(it.x - 26, it.y - 44, 52, 52, 10);
    }

    fill(0);
    text(it.emoji, it.x, it.y - 18);
  }
}

// Shopping list UI (semi-transparent unless hovering header)
function drawShoppingListUI(currentLevel, collected, shoppingList) {
  const x = 20;
  const y = 20;
  const w = 240;

  const headerH = 78;
  const lineH = 20;
  const paddingBottom = 16;
  const h = headerH + shoppingList.length * lineH + paddingBottom;

  const headerHoverH = 60;
  const isHoverHeader =
    mouseX >= x && mouseX <= x + w &&
    mouseY >= y && mouseY <= y + headerHoverH;

  const alpha = isHoverHeader ? 255 : 180;

  fill(255, 255, 255, alpha);
  stroke(200, 200, 200, alpha);
  rect(x, y, w, h, 12);
  noStroke();

  fill(0);
  textAlign(LEFT);
  textSize(16);
  text(`Level ${currentLevel} / 6`, x + 15, y + 25);
  text("Shopping List", x + 15, y + 48);

  for (let i = 0; i < shoppingList.length; i++) {
    const item = shoppingList[i];
    const rowY = y + headerH + i * lineH - 4;

    if (collected.includes(item)) {
      fill(0, 160, 0);
      text("✔ " + item, x + 15, rowY);
    } else {
      fill(0);
      text("- " + item, x + 15, rowY);
    }
  }
}

function drawHoverHintSmart(hoveredItem, camX) {
  if (!hoveredItem) return;

  const padding = 12;

  const label = `${hoveredItem.emoji} ${hoveredItem.name} — ${hoveredItem.hint}`;

  textSize(13);
  const bubbleW = min(420, textWidth(label) + 24);
  const bubbleH = 30;

  // FOLLOW CURSOR like before
  let bx = mouseX + 14;
  let by = mouseY - bubbleH - 10;

  // shopping list bounds
  const listX = 20;
  const listY = 20;
  const listW = 240;

  const headerH = 78;
  const lineH = 20;
  const paddingBottom = 16;
  const listH = headerH + shoppingList.length * lineH + paddingBottom;

  // check overlap with shopping list
  const overlapsList =
    bx < listX + listW &&
    bx + bubbleW > listX &&
    by < listY + listH &&
    by + bubbleH > listY;

  // if overlapping list, move ABOVE list instead
  if (overlapsList) {
    by = listY - bubbleH - 8;
  }

  // keep on screen
  bx = constrain(bx, 10, width - bubbleW - 10);
  by = constrain(by, 10, height - bubbleH - 10);

  // draw bubble
  fill(255);
  stroke(200);
  rect(bx, by, bubbleW, bubbleH, 8);

  noStroke();
  fill(0);
  textAlign(LEFT, CENTER);
  text(label, bx + padding, by + bubbleH / 2);
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
  text(
    "Move: A/D or ←/→ • Click items • Hover for hints • Press H or click 🐱 Hint",
    width - 20,
    25
  );
}

function drawCartUI(collected, itemEmojiMap) {
  let x = 20;
  let y = height - 55;
  let w = 360;
  let h = 38;

  fill(255);
  stroke(200);
  rect(x, y, w, h, 12);
  noStroke();

  fill(0);
  textAlign(LEFT, CENTER);
  textSize(14);
  text("Cart:", x + 12, y + h / 2);

  textSize(20);
  let startX = x + 70;
  for (let i = 0; i < collected.length; i++) {
    let name = collected[i];
    let emoji = itemEmojiMap[name] || "✅";
    text(emoji, startX + i * 26, y + h / 2 + 1);
  }
}

function drawHintUI(hintsLeft) {
  let x = width - 190;
  let y = 40;
  let w = 170;
  let h = 46;

  fill(255);
  stroke(200);
  rect(x, y, w, h, 12);
  noStroke();

  fill(0);
  textAlign(LEFT, CENTER);
  textSize(14);
  text("🐱 Hint", x + 12, y + h / 2);

  textAlign(RIGHT, CENTER);
  textSize(12);
  text(`${hintsLeft} left`, x + w - 12, y + h / 2);
}