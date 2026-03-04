// levels.js

const LEVELS = [
  {
    level: 1,
    shelves: 1,
    world: 2000,
    itemsToShow: 10,
    hints: 1,
    aisle: "Fruit Aisle",
    allowed: ["apple", "banana", "grapes", "carrot", "tomato"],
    list: ["apple", "milk", "bread"]
  },
  {
    level: 2,
    shelves: 1,
    world: 2400,
    itemsToShow: 12,
    hints: 1,
    aisle: "Dairy Aisle",
    allowed: ["milk", "cheese", "yogurt", "egg"],
    list: ["banana", "juice", "bread", "milk"]
  },
  {
    level: 3,
    shelves: 2,
    world: 2600,
    itemsToShow: 14,
    hints: 1,
    aisle: "Breakfast Aisle",
    allowed: ["cereal", "milk", "bread", "egg", "yogurt"],
    list: ["apple", "cheese", "egg", "cereal"]
  },
  {
    level: 4,
    shelves: 2,
    world: 2900,
    itemsToShow: 16,
    hints: 1,
    aisle: "Snack Aisle",
    allowed: ["cookie", "juice", "bread", "cheese", "donut"],
    list: ["tomato", "fish", "milk", "bread", "cookie"]
  },
  {
    level: 5,
    shelves: 3,
    world: 3200,
    itemsToShow: 18,
    hints: 1,
    aisle: "Mixed Aisle",
    allowed: ["grapes", "rice", "cheese", "juice", "yogurt", "milk", "bread"],
    list: ["grapes", "rice", "cheese", "juice", "yogurt"]
  },
  {
    level: 6,
    shelves: 3,
    world: 3500,
    itemsToShow: 20,
    hints: 1,
    aisle: "Chaos Aisle",
    allowed: ["pizza", "donut", "icecream", "milk", "bread", "apple", "cookie", "juice"],
    list: ["pizza", "donut", "icecream", "milk", "bread", "apple"]
  }
];