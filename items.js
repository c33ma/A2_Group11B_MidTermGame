// items.js
// Item pool + spawning logic

const ITEM_POOL = [
  { name: "apple", emoji: "🍎", hint: "Red fruit that grows on trees!" },
  { name: "banana", emoji: "🍌", hint: "Long yellow fruit monkeys love!" },
  { name: "milk", emoji: "🥛", hint: "White drink from cows!" },
  { name: "bread", emoji: "🍞", hint: "Soft food used for sandwiches!" },
  { name: "juice", emoji: "🧃", hint: "Sweet drink made from fruit!" },
  { name: "cereal", emoji: "🥣", hint: "Crunchy breakfast in a box!" },
  { name: "yogurt", emoji: "🍦", hint: "Creamy snack in a cup!" },
  { name: "cheese", emoji: "🧀", hint: "A salty dairy snack!" },
  { name: "cookie", emoji: "🍪", hint: "Sweet treat that pairs with milk!" },
  { name: "carrot", emoji: "🥕", hint: "Orange veggie bunnies love!" },
  { name: "grapes", emoji: "🍇", hint: "Small purple fruit in a bunch!" },
  { name: "tomato", emoji: "🍅", hint: "Red veggie-fruit used in salads!" },
  { name: "egg", emoji: "🥚", hint: "Breakfast food in a shell!" },
  { name: "fish", emoji: "🐟", hint: "Seafood that swims!" },
  { name: "rice", emoji: "🍚", hint: "White grains, super common meal!" },
  { name: "icecream", emoji: "🍨", hint: "Cold dessert that melts!" },
  { name: "donut", emoji: "🍩", hint: "Round sweet treat with a hole!" },
  { name: "pizza", emoji: "🍕", hint: "Cheesy slice with toppings!" },

  // Decoys (fun wrong items)
  { name: "teddy", emoji: "🧸", hint: "A toy… why is this here??" },
  { name: "socks", emoji: "🧦", hint: "Not groceries bestie 😭" },
  { name: "toiletpaper", emoji: "🧻", hint: "Helpful… but not food!" },
  { name: "rubberduck", emoji: "🦆", hint: "Quack?! Wrong aisle!" }
];

function findItemByName(name) {
  return ITEM_POOL.find((p) => p.name === name) || null;
}

// Shelf row -> y position (side-view shelf layers)
function shelfYForRow(row) {
  if (row === 1) return 250; // lower
  if (row === 2) return 200; // middle
  return 160; // top
}

function makeSpawnedItem(proto, x, y) {
  return {
    name: proto.name,
    emoji: proto.emoji,
    hint: proto.hint,
    x,
    y,
    radius: 28
  };
}

function spawnItemsForLevel(worldWidth, shelfRows, shoppingList, itemsToShow, allowedNames = []) {
  let items = [];

  // Always include required items
  let needed = shoppingList.map(findItemByName).filter(Boolean);

  // Build an “allowed pool” so each level feels like an aisle
  let allowedPool = [];
  if (allowedNames && allowedNames.length > 0) {
    allowedPool = allowedNames.map(findItemByName).filter(Boolean);
  } else {
    allowedPool = [...ITEM_POOL];
  }

  // Add some decoys into every level (fun factor)
  let decoys = ["teddy", "socks", "toiletpaper", "rubberduck"]
    .map(findItemByName)
    .filter(Boolean);

  // Extras should come from allowed pool + some decoys
  let extras = shuffle([...allowedPool, ...decoys]).filter((p) => !shoppingList.includes(p.name));

  // Pick the set shown (and shuffle so required items aren't clustered)
  let chosen = shuffle([...needed, ...extras]).slice(0, itemsToShow);

  // Slots across aisle
  let leftPad = 160;
  let rightPad = 160;
  let usable = worldWidth - leftPad - rightPad;
  let step = chosen.length > 1 ? usable / (chosen.length - 1) : 0;

  let slots = [];
  for (let i = 0; i < chosen.length; i++) slots.push(leftPad + i * step);

  // Shuffle placement so list items are spread out
  slots = shuffle(slots);
  chosen = shuffle(chosen);

  for (let i = 0; i < chosen.length; i++) {
    let x = slots[i];
    let row = 1 + floor(random(shelfRows));
    let y = shelfYForRow(row);
    items.push(makeSpawnedItem(chosen[i], x, y));
  }

  return items;
}