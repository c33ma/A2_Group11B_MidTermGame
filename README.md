# A2_Group11B_MidTermGame

# Grocery Helper

## Group Number
11B

## Group Members
- Yasmeen Kamal — 21072839
- Iba Abbasi — 21086411
- Moosa Malik — 20913010
- Elizabeth Ciceu — 21076645
- Chloe Ma — 21094314

## Description
Grocery Helper is a cozy, pastel-themed shopping game where players move through a grocery store aisle and collect the items shown on their shopping list. The game was designed around the topic of intellectual disability and cognitive accessibility, with a focus on creating a simple, supportive, and low-pressure experience.

Rather than representing disability through stereotypes or difficulty, the game explores how thoughtful design choices can make everyday tasks more accessible. Grocery Helper uses clear visual cues, a small shopping list, immediate feedback, and a hint system to reduce cognitive load and support understanding. The goal is to show how accessible design can help players complete everyday tasks more comfortably and confidently.

## Setup and Interaction Instructions
Run the project using a local server or p5.js live preview.

### Controls
- **A / D** or **Arrow Keys** to move
- **Mouse click** to collect items
- **Hint button** to teleport to the next required item

### Objective
- Find everything on your shopping list
- Only collect the correct items
- Use hints if needed
- Complete all levels successfully

## Core Mechanics
- Side-scrolling movement through a grocery aisle
- Clicking items to collect them
- Matching collected items to a shopping list
- Hint system that teleports the player to the next required item
- Visual highlighting for hinted items
- Level progression across multiple grocery aisles

## Accessibility and Disability Representation
This game was designed with cognitive accessibility in mind. Since the assignment topic focuses on intellectual disability, the game emphasizes supportive design features rather than punishment or complexity. The shopping list uses both words and visuals, the cart displays collected food icons, and the hint system reduces frustration by guiding players toward the next correct item.

These design choices help reduce memory load, simplify decision-making, and make the main task easier to understand. Through this design, Grocery Helper aims to demonstrate how clear interfaces, visual support, and low-pressure mechanics can make gameplay more inclusive.

## Process and Design Rationale
Our team wanted to create a game that was cute, simple, and easy to understand, while still meaningfully connecting to the assignment theme. We chose a grocery shopping concept because it is familiar, visually clear, and naturally suited to step-by-step task completion.

To support accessibility, we used:
- short instructions
- visual item cues
- a limited number of goals at one time
- a hint feature with visual highlighting
- immediate feedback when items are collected
- a supportive, low-pressure interface

These features were intended to model how accessible design can support players with intellectual disabilities by making tasks clearer and reducing cognitive overload.

## Iteration Notes

### Post-Playtest
Feedback summary:  
During playtesting, players understood the general goal of the game, but several people found the hint system unclear at first. Feedback suggested that the game needed stronger onboarding, more explicit explanation of how hints work, and clearer visual feedback when a hint is used. Players also noted that the gameplay would feel more intuitive if the next required item was more obviously highlighted.

Three changes we plan to make:
1. Clarify hint usage and behavior in the UI, including explaining that hints teleport the player to the next required item and showing how many hints are available.
2. Add an onboarding instruction screen at the beginning of the game to explain the core mechanics, including movement, collecting items, and using hints.
3. Make hints more visually obvious by adding a glow or highlight effect to the target item, with optional supporting label text when a hint is activated.

### Post-Showcase
Feedback summary:  
During the showcase, feedback was positive about the game’s overall atmosphere, especially its visuals and music. However, players noted that some text was bleeding outside of its UI containers, which affected readability. There was also confusion around the shopping cart movement, as it was not immediately clear how movement through the aisle worked. A suggestion was made to make the background or aisle movement feel more intuitive by keeping the cart visually static or adding a clearer movement indicator.

Two improvements we plan to make:
1. Fix text overflow and UI spacing so that all instructions, labels, and interface text remain clearly contained within their designated boxes.
2. Clarify the shopping cart movement system by either keeping the cart visually centered while the aisle moves, or adding a stronger movement indicator so players better understand how navigation works.

## Assets
Custom assets were created using GenAI and edited for use in the game.

GenAI asset development log:  
- https://chatgpt.com/share/69b2025f-777c-8008-ace6-2d64bef82f37

Custom assets used:
- `apples.png`
- `banana.png`
- `eggs.png`
- `shoppingcart.png`

Other visual elements:
- emoji-based grocery item icons rendered in p5.js
- UI panels, backgrounds, and shelf visuals created in code

## References
1. Government of Canada. 2025. *Designing for users with cognitive disabilities*. Digital Accessibility Toolkit. Retrieved March 12, 2026 from https://a11y.canada.ca/en/designing-for-users-with-cognitive-disabilities/

2. Leandro Soares Guedes, Ryan Colin Gibson, Kirsten Ellis, Laurianne Sitbon, and Monica Landoni. 2022. *Designing with and for People with Intellectual Disabilities*. In *Proceedings of the 24th International ACM SIGACCESS Conference on Computers and Accessibility (ASSETS ’22)*, Article 106, 1–6. Association for Computing Machinery, New York, NY, USA. https://doi.org/10.1145/3517428.3550406