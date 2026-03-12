const ITEM_POOL = [
  { name: "apple", emoji: "🍎" },
  { name: "banana", emoji: "🍌" },
  { name: "milk", emoji: "🥛" },
  { name: "bread", emoji: "🍞" },
  { name: "juice", emoji: "🧃" },
  { name: "cereal", emoji: "🥣" },
  { name: "butter", emoji: "🧈" },
  { name: "cheese", emoji: "🧀" },
  { name: "cookie", emoji: "🍪" },
  { name: "carrot", emoji: "🥕" },
  { name: "grapes", emoji: "🍇" },
  { name: "tomato", emoji: "🍅" },
  { name: "egg", emoji: "🥚" },
  { name: "fish", emoji: "🐟" },
  { name: "rice", emoji: "🍚" },
  { name: "icecream", emoji: "🍨" },
  { name: "donut", emoji: "🍩" },
  { name: "pizza", emoji: "🍕" },
  { name: "teddy", emoji: "🧸" },
  { name: "socks", emoji: "🧦" },
  { name: "toiletpaper", emoji: "🧻" },
  { name: "rubberduck", emoji: "🦆" },
];

function spawnItemsForLevel(worldWidth, shoppingList, itemsToShow) {
  let shelfLevels = [354, 284, 214];
  let shelfSpacing = 180;

  let slots = [];

  for (let y of shelfLevels) {
    for (let x = 90; x < worldWidth - 60; x += shelfSpacing) {
      slots.push({ x: x, y: y });
    }
  }

  slots = shuffle(slots);

  let items = [];
  let usedNames = [];

  for (let name of shoppingList) {
    let proto = ITEM_POOL.find((p) => p.name === name);
    if (!proto || slots.length === 0) continue;

    let pos = slots.pop();

    items.push({
      name: proto.name,
      emoji: proto.emoji,
      x: pos.x,
      y: pos.y,
    });

    usedNames.push(proto.name);
  }

  let extraPool = shuffle(ITEM_POOL.filter((p) => !usedNames.includes(p.name)));

  while (items.length < itemsToShow && slots.length > 0 && extraPool.length > 0) {
    let proto = extraPool.pop();
    let pos = slots.pop();

    items.push({
      name: proto.name,
      emoji: proto.emoji,
      x: pos.x,
      y: pos.y,
    });

    usedNames.push(proto.name);
  }

  return items;
}