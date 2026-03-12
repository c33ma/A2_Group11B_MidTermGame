function drawAisleWorld(worldWidth, floorY) {
  let shelfLevels = [floorY - 60, floorY - 130, floorY - 200];

  for (let y of shelfLevels) {
    fill(255, 255, 255, 35);
    rect(0, y - 4, worldWidth, 8);

    fill("#203a5a");
    rect(0, y + 8, worldWidth, 6);
  }

  for (let x = 0; x < worldWidth; x += 40) {
    for (let y = floorY; y < height; y += 40) {
      fill(255, 248, 235, 18);
      rect(x, y, 40, 40);
    }
  }
}

function drawItemsWorld(items) {

  for (let it of items) {

    let hover = dist(mouseX + camX, mouseY, it.x, it.y) < 26;

    push();
    translate(it.x, it.y);

    let bob = sin(frameCount * 0.05 + it.x) * 2;
    translate(0, bob);

    if (highlightedItem === it && highlightTimer > 0) {

      noStroke();

      fill(255, 240, 120, 80);
      rect(-24, -24, 48, 48);

      fill(255, 250, 180, 120);
      rect(-18, -18, 36, 36);

      highlightTimer--;
    }

    if (hover) {
      scale(1.1);
    }

    // item card
    noStroke();

    fill("#2f2a24");
    rect(-20, -20, 40, 40);

    fill("#f6edd9");
    rect(-16, -16, 32, 32);

    fill("#ffffff55");
    rect(-16, -16, 32, 5);

    textAlign(CENTER, CENTER);
    textSize(20);
    text(it.emoji, 0, 2);

    pop();
  }
}

function drawPlayerWorld(player) {

  push();
  translate(player.x, player.y);

  // shadow
  noStroke();
  fill(0, 50);
  ellipse(0, -2, 36, 12);

  rectMode(CENTER);

  stroke("#2f2a24");
  strokeWeight(3);
  noFill();

  // cart basket
  rect(0, -22, 28, 18);

  // handle
  line(14, -28, 24, -42);

  // wheels
  fill("#2f2a24");
  noStroke();
  ellipse(-8, -8, 7, 7);
  ellipse(8, -8, 7, 7);

  // groceries inside
  fill("#ef6f51");
  rect(-6, -24, 6, 6);

  fill("#7bc96f");
  rect(2, -26, 6, 8);

  fill("#f4c95d");
  rect(7, -22, 5, 5);

  pop();
}

function drawShoppingListUI(currentLevel, collected, shoppingList) {

  drawFixedPanel(18, 18, 240, 185);

  fill("#2f2a24");
  noStroke();

  textSize(10);
  textAlign(LEFT, TOP);

  text("LEVEL " + currentLevel + " / 3", 34, 36);
  text("SHOPPING LIST", 34, 66);

  for (let i = 0; i < shoppingList.length; i++) {

    let item = shoppingList[i];
    let y = 98 + i * 24;
    let emoji = itemEmojiMap[item] || "❓";

    if (collected.includes(item)) {

      fill("#4c9a4c");
      text("OK " + emoji + " " + item.toUpperCase(), 34, y);

    } else {

      fill("#2f2a24");
      text("- " + emoji + " " + item.toUpperCase(), 34, y);

    }
  }
}

function drawHintUI(hintsLeft) {

  drawFixedPanel(width - 196, 18, 178, 64);

  textAlign(CENTER, CENTER);

  fill("#2f2a24");
  textSize(11);

  text("💡 HINT " + hintsLeft, width - 107, 49);
}

function drawCartUI(collected, itemEmojiMap) {

  drawFixedPanel(width - 196, 95, 178, 104);

  fill("#2f2a24");
  noStroke();

  textAlign(CENTER, TOP);
  textSize(10);

  text("CART", width - 107, 112);

  let emojis = collected.map((item) => itemEmojiMap[item] || "❓");

  for (let i = 0; i < emojis.length; i++) {

    let x = width - 164 + (i % 4) * 34;
    let y = 145 + floor(i / 4) * 28;

    fill("#dbc9a8");
    rect(x - 12, y - 14, 24, 24);

    fill("#2f2a24");
    textSize(16);
    text(emojis[i], x, y + 2);
  }
}

function drawFixedPanel(x, y, w, h) {

  noStroke();

  fill("#2f2a24");
  rect(x, y, w, h);

  fill("#f6edd9");
  rect(x + 6, y + 6, w - 12, h - 12);

  fill("#ffffff33");
  rect(x + 6, y + 6, w - 12, 6);

  fill("#00000012");
  rect(x + 6, y + h - 14, w - 12, 8);
}