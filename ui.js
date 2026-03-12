function drawAisleWorld(worldWidth, floorY) {
  let shelfLevels = [floorY - 66, floorY - 136, floorY - 206];

  noStroke();

  for (let y of shelfLevels) {
    fill(255, 255, 255, 32);
    rect(0, y - 2, worldWidth, 4);

    fill("#4f6787");
    rect(0, y + 10, worldWidth, 5);
  }

  for (let x = 0; x < worldWidth; x += 40) {
    for (let y = floorY; y < height; y += 40) {
      fill(255, 248, 235, 10);
      rect(x, y, 40, 40);
    }
  }
}

function drawItemsWorld(items) {
  for (let it of items) {
    let hover = dist(mouseX + camX, mouseY, it.x, it.y) < 34;

    push();
    translate(it.x, it.y);

    let bob = sin(frameCount * 0.05 + it.x) * 2;
    translate(0, bob);

    if (highlightedItem === it && highlightTimer > 0) {
      noStroke();
      fill(255, 240, 120, 90);
      ellipse(0, 0, 66, 66);

      fill(255, 250, 180, 110);
      ellipse(0, 0, 48, 48);

      highlightTimer--;
    }

    if (hover) {
      scale(1.15);
    }

    textAlign(CENTER, CENTER);
    textSize(42);
    textFont("sans-serif");
    fill(255);
    stroke(60, 40, 20, 120);
    strokeWeight(1.5);
    text(it.emoji, 0, 0);

    pop();
  }
}

function drawPlayerWorld(player) {
  push();
  translate(player.x, player.y);

  fill(0, 0, 0, 45);
  noStroke();
  ellipse(0, -4, 70, 18);

  if (playerSprite) {
    imageMode(CENTER);
    image(playerSprite, 0, -28, 120, 120);
    imageMode(CORNER);
  } else {
    textAlign(CENTER, CENTER);
    textFont("sans-serif");
    textSize(64);
    text("🛒", 0, -20);
  }

  pop();
}

function drawShoppingListUI(currentLevel, collected, shoppingList) {
  drawFixedPanel(18, 18, 250, 190);

  fill("#3f2e1f");
  noStroke();
  textSize(10);
  textAlign(LEFT, TOP);
  textFont("Press Start 2P");

  text("LEVEL " + currentLevel + " / 3", 34, 34);
  text("SHOPPING LIST", 34, 62);

  for (let i = 0; i < shoppingList.length; i++) {
    let item = shoppingList[i];
    let y = 94 + i * 24;
    let emoji = itemEmojiMap[item] || "❓";
    let isDone = collected.includes(item);

    fill(isDone ? "#4c9a4c" : "#3f2e1f");
    textSize(10);
    textFont("Press Start 2P");
    text(isDone ? "OK" : "-", 34, y);

    textSize(20);
    textFont("sans-serif");
    noStroke();
    fill(255);
    text(emoji, 64, y - 2);

    textSize(10);
    textFont("Press Start 2P");
    fill(isDone ? "#4c9a4c" : "#3f2e1f");
    text(item.toUpperCase(), 88, y);
  }
}

function drawHintUI(hintsLeft) {
  drawFixedPanel(width - 196, 18, 178, 58);

  fill("#3f2e1f");
  noStroke();
  textAlign(CENTER, CENTER);
  textFont("Press Start 2P");
  textSize(11);
  text("💡 HINT " + hintsLeft, width - 107, 46);
}

function drawCartUI(collected, itemEmojiMap) {
  drawFixedPanel(width - 196, 88, 178, 112);

  fill("#3f2e1f");
  noStroke();
  textAlign(CENTER, TOP);
  textFont("Press Start 2P");
  textSize(10);
  text("CART", width - 107, 104);

  for (let i = 0; i < collected.length; i++) {
    let item = collected[i];
    let emoji = itemEmojiMap[item] || "❓";
    let x = width - 164 + (i % 4) * 34;
    let y = 140 + floor(i / 4) * 28;

    textSize(22);
    textAlign(CENTER, CENTER);
    textFont("sans-serif");
    fill(255);
    text(emoji, x, y);
  }
}

function drawFixedPanel(x, y, w, h) {
  noStroke();

  fill("#7a5a3a");
  rect(x, y, w, h);

  fill("#f6edd9");
  rect(x + 4, y + 4, w - 8, h - 8);

  fill(255, 255, 255, 28);
  rect(x + 4, y + 4, w - 8, 4);

  fill(0, 0, 0, 12);
  rect(x + 4, y + h - 10, w - 8, 6);
}