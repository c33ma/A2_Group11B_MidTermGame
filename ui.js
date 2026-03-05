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

    for (let x = 0; x < worldWidth; x += 200) {
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

    if (hover) scale(1.15);

    fill(255);
    stroke(210);
    rect(-20, -20, 40, 40, 8);

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
  rect(20, 60, 200, 160, 10);

  fill(40);
  noStroke();

  textSize(14);
  textAlign(LEFT);

  text("Level " + currentLevel + " / 3", 30, 80);
  text("Shopping List:", 30, 105);

  for (let i = 0; i < shoppingList.length; i++) {
    let item = shoppingList[i];
    let y = 130 + i * 22;

    if (collected.includes(item)) {
      fill(120, 200, 120);
    } else {
      fill(40);
    }

    text("- " + item, 30, y);
  }
}

function drawHintUI(hintsLeft) {
  fill(255);
  stroke(200);
  rect(width - 120, 60, 100, 40, 10);

  fill(40);
  noStroke();

  textAlign(CENTER, CENTER);
  textSize(13);

  text("Hint (" + hintsLeft + ")", width - 70, 80);
}

function drawCartUI(collected, itemEmojiMap) {
  fill(255);
  stroke(200);
  rect(width - 120, 110, 100, 60, 10);

  fill(40);
  noStroke();

  textAlign(CENTER);
  textSize(12);

  text("Cart", width - 70, 130);

  text(collected.length, width - 70, 155);
}
