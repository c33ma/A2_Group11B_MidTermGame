function drawAisleWorld(worldWidth, floorY) {
  for (let x = 0; x < worldWidth; x += 40) {
    for (let y = floorY; y < height; y += 40) {
      fill(240);
      stroke(225);
      rect(x, y, 40, 40);
    }
  }

  let shelfLevels = [floorY - 60, floorY - 130, floorY - 200];

  for (let y of shelfLevels) {
    stroke(210);
    strokeWeight(4);
    line(0, y, worldWidth, y);

    fill(0, 20);
    noStroke();
    rect(0, y + 4, worldWidth, 4);

    for (let x = 0; x < worldWidth; x += 200) {
      stroke(210);
      strokeWeight(2);
      line(x, y, x, y + 12);
    }
  }
}

function drawItemsWorld(items) {
  for (let it of items) {
    let hover = dist(mouseX + camX, mouseY, it.x, it.y) < 26;

    push();

    translate(it.x, it.y);

    /* floating motion */

    let bob = sin(frameCount * 0.05 + it.x) * 2;
    translate(0, bob);

    /* hint glow */

    if (highlightedItem === it && highlightTimer > 0) {
      let glow = sin(frameCount * 0.2) * 4 + 24;

      noStroke();
      fill(255, 240, 180, 90);
      ellipse(0, 0, glow * 2, glow * 2);

      highlightTimer--;
    }

    /* hover feedback */

    if (hover) scale(1.12);

    /* item box */

    fill(255);
    stroke(210);
    rect(-20, -20, 40, 40, 8);

    /* emoji */

    textAlign(CENTER, CENTER);
    textSize(24);
    text(it.emoji, 0, 3);

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

function drawShoppingListUI(currentLevel, collected, shoppingList) {
  fill(255);
  stroke(200);
  rect(20, 20, 220, 170, 10);

  fill(40);
  noStroke();

  textSize(14);
  textAlign(LEFT);

  text("Level " + currentLevel + " / 3", 30, 40);
  text("Shopping List:", 30, 70);

  for (let i = 0; i < shoppingList.length; i++) {
    let item = shoppingList[i];
    let y = 100 + i * 22;

    if (collected.includes(item)) {
      fill(120, 200, 120);
      text("✔ " + item, 30, y);
    } else {
      fill(40);
      text("- " + item, 30, y);
    }
  }
}

function drawHintUI(hintsLeft) {
  fill(255);
  stroke(200);
  rect(width - 200, 20, 180, 60, 10);

  fill(40);
  noStroke();

  textAlign(CENTER, CENTER);
  textSize(15);

  text("Hint (" + hintsLeft + ")", width - 110, 50);
}

function drawCartUI(collected, itemEmojiMap) {
  fill(255);
  stroke(200);
  rect(width - 200, 95, 180, 70, 10);

  fill(40);
  noStroke();

  textAlign(CENTER);
  textSize(13);

  text("Cart", width - 110, 120);
  text(collected.length, width - 110, 150);
}
