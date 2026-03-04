// levels.js
// Level configs: every 2 levels adds a shelf row + more items

const LEVELS = [
  { level: 1, shelves: 1, world: 2000, itemsToShow: 10, list: ["apple", "milk", "bread"] },
  { level: 2, shelves: 1, world: 2400, itemsToShow: 12, list: ["banana", "juice", "bread", "milk"] },

  { level: 3, shelves: 2, world: 2600, itemsToShow: 14, list: ["apple", "cheese", "egg", "cereal"] },
  { level: 4, shelves: 2, world: 2900, itemsToShow: 16, list: ["tomato", "fish", "milk", "bread", "cookie"] },

  { level: 5, shelves: 3, world: 3200, itemsToShow: 18, list: ["grapes", "rice", "cheese", "juice", "yogurt"] },
  { level: 6, shelves: 3, world: 3500, itemsToShow: 20, list: ["pizza", "donut", "icecream", "milk", "bread", "apple"] }
];