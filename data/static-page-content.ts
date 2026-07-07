export type PageStaticContent = {
  heading: string;
  description: string;
  howTo: string[];
  tips: string[];
  faqs: Array<{ q: string; a: string }>;
};

export const PAGE_CONTENT: Record<string, PageStaticContent> = {
  // ── GAMES ─────────────────────────────────────────────────────────────────

  xo: {
    heading: 'About Emoji XO',
    description:
      'Emoji XO is a fresh take on classic Tic-Tac-Toe where you replace boring X and O markers with any emoji you like. Play on a standard 3×3 grid, or raise the stakes with a 4×4 or 5×5 board for a longer, more strategic match. Challenge a friend in two-player mode, or test your wits against the computer AI at any skill level.',
    howTo: [
      'Choose your board size: 3×3 for a quick game, 4×4 or 5×5 for a bigger challenge.',
      'Pick your emoji piece — tap the emoji selector and choose any character you like.',
      'Select whether you want to play against a friend on the same device or versus the computer.',
      'Take turns placing your emoji on empty squares by tapping or clicking a cell.',
      'The first player to line up three (or more) of their emoji in a row, column, or diagonal wins.',
      'Hit "New Game" to rematch with the same settings or change them up.',
    ],
    tips: [
      'Control the center square on a 3×3 board — it appears in four winning lines, giving you the most flexibility.',
      'On 4×4 and 5×5 grids, watch for fork setups where you threaten two winning lines simultaneously, forcing your opponent to block only one.',
      'Against the computer, switch up your opening move each game to discover weaknesses in its strategy at each difficulty level.',
      'In two-player mode on a 5×5 board, blocking your opponent is just as important as building your own line — keep an eye on both plans.',
    ],
    faqs: [
      {
        q: 'Can I play Emoji XO against the computer?',
        a: 'Yes. When setting up a new game, choose "vs Computer" and pick a difficulty level. The AI adjusts its strategy based on the level you select.',
      },
      {
        q: 'How do I win on a 4×4 or 5×5 board?',
        a: 'On larger boards you still need to connect four (4×4) or five (5×5) of your emoji in an unbroken row, column, or diagonal to win.',
      },
      {
        q: 'Can I use any emoji as my piece?',
        a: 'Yes — both players can independently choose any emoji from the full selector. Your pieces just need to be different from each other so you can tell them apart.',
      },
    ],
  },

  snake: {
    heading: 'About Emoji Snake',
    description:
      'Emoji Snake puts a colorful spin on the timeless snake game by replacing the classic pixel worm with a trail of expressive emoji characters. Guide your snake around the board to eat the food emoji that appears, growing longer with every bite. The challenge is keeping track of your ever-lengthening body — one collision with the walls or yourself ends the run.',
    howTo: [
      'Press the play button (or any arrow key on desktop) to start the game.',
      'Use the arrow keys on keyboard, or swipe on mobile, to steer your snake in four directions.',
      'Eat the food emoji that appears on the board to grow longer and earn points.',
      'Avoid running into the walls at the edges of the board.',
      'Avoid colliding with any part of your own snake body.',
      'Try to survive as long as possible and beat your high score.',
    ],
    tips: [
      'Hug the walls when your snake is short to leave the center open — that free space becomes crucial as you grow.',
      'Think a few moves ahead before going for food near a corner; corners are easy traps when your body is long.',
      'Develop a loose spiral or figure-eight pattern to keep yourself from accidentally cutting off your own escape routes.',
      'The snake speeds up as your score climbs — practise quick directional reversals to react in time.',
    ],
    faqs: [
      {
        q: 'Does Emoji Snake get faster as you play?',
        a: 'Yes. The snake gradually increases speed as your score grows, making later stages of the game more demanding.',
      },
      {
        q: 'How do I control the snake on mobile?',
        a: 'Swipe in the direction you want to turn. The game detects touch gestures, so no on-screen buttons are needed.',
      },
      {
        q: 'What happens if I hit a wall?',
        a: 'Hitting a wall ends the game immediately, just like colliding with your own body. Your final score is shown and you can start a new run.',
      },
    ],
  },

  minesweeper: {
    heading: 'About Emoji Minesweeper',
    description:
      'Emoji Minesweeper reimagines the classic Windows puzzle game with emoji-styled tiles that make it feel fresh and friendly. Hidden beneath the grid are mines — your goal is to uncover every safe tile without triggering one. Numbers on revealed tiles tell you exactly how many mines are touching that cell, giving you the logical clues you need to work outward safely.',
    howTo: [
      'Click or tap any tile to reveal it and start the game — the first click is always safe.',
      'Read the number on each revealed tile: it shows how many of the eight surrounding tiles contain mines.',
      'Use the numbers to deduce which covered tiles are safe and which are mines.',
      'Right-click (or long-press on mobile) to plant a flag emoji on a tile you believe hides a mine.',
      'Continue revealing safe tiles until the entire board is uncovered — that is a win.',
      'If you click a mine, the game ends and all mine locations are revealed.',
    ],
    tips: [
      'When a numbered tile is already surrounded by exactly that many flags, all remaining covered neighbors are safe — click them freely.',
      'Corners and edges reduce the number of unknown neighbors around a tile, making deductions easier — start logic chains there.',
      'If you are stuck with no safe deduction, choose a tile in an open area away from known mines to minimise risk.',
      'Use flags liberally to track what you know; a well-flagged board lets you scan quickly without re-solving the same area twice.',
    ],
    faqs: [
      {
        q: 'Is the first click always safe in Emoji Minesweeper?',
        a: 'Yes. The mine layout is generated after your first click, so you will never hit a mine on the opening move.',
      },
      {
        q: 'How do I flag a suspected mine on mobile?',
        a: 'Long-press a tile to toggle a flag on or off. Flagged tiles cannot be accidentally opened with a regular tap.',
      },
      {
        q: 'Are there different difficulty levels?',
        a: 'Yes. You can choose between beginner, intermediate, and expert grids, each with a larger board and more mines than the last.',
      },
    ],
  },

  hangman: {
    heading: 'About Emoji Hangman',
    description:
      'Emoji Hangman puts a unique twist on the word-guessing classic: instead of a random word, you are trying to uncover the official Unicode name of a mystery emoji. Each round shows you an emoji and a row of blanks representing the letters in its name — your job is to guess letter by letter before running out of attempts. It is a great way to learn the actual names behind familiar faces and symbols.',
    howTo: [
      'A random emoji appears at the top of the screen along with blank dashes for each letter in its Unicode name.',
      'Tap or click letters on the on-screen keyboard (or type on desktop) to guess a letter.',
      'Correct guesses reveal that letter in every position it appears in the name.',
      'Wrong guesses add a stroke to the hangman drawing — you have a limited number of incorrect guesses.',
      'Keep guessing until you complete the name or the drawing is finished.',
      'After each round, the full Unicode name is revealed so you can learn it for next time.',
    ],
    tips: [
      'Start with high-frequency letters like E, A, R, S, and T — Unicode emoji names use English words and these appear constantly.',
      'Look closely at the emoji itself for context clues; a face emoji name likely contains "FACE" and an animal name likely contains the animal word.',
      'Watch out for compound names like "SMILING FACE WITH HEART-EYES" — the hyphens and spaces are shown as blanks too.',
      'Vowels first is a classic hangman strategy: guessing A, E, I, O, U early reveals the skeleton of the word and guides consonant choices.',
    ],
    faqs: [
      {
        q: 'What are the words in Emoji Hangman based on?',
        a: 'Each puzzle uses the official Unicode character name of the emoji — for example, the 😀 emoji has the name "GRINNING FACE".',
      },
      {
        q: 'How many wrong guesses am I allowed?',
        a: 'You get six incorrect guesses before the hangman drawing is complete and the round ends.',
      },
      {
        q: 'Can I skip an emoji I do not know?',
        a: 'Yes. There is a skip button that moves you to a new random emoji without counting as a loss.',
      },
    ],
  },

  'bubble-shooter': {
    heading: 'About Emoji Bubble Shooter',
    description:
      'Emoji Bubble Shooter replaces the usual coloured bubbles with a vibrant assortment of emoji characters, turning a beloved casual game into something more visually playful. Aim your launcher at the ceiling of bubbles and fire to match three or more of the same emoji — matched groups pop and disappear, lowering the cluster. Chain reactions happen when isolated bubbles lose their support and fall, earning bonus points.',
    howTo: [
      'A launching emoji appears at the bottom of the screen; a preview shows which emoji is loaded next.',
      'Aim by moving your mouse or dragging on mobile — a dotted guide line shows your trajectory.',
      'Click or tap to fire the emoji upward.',
      'When three or more identical emoji touch after a shot, they pop and are cleared from the board.',
      'Bubbles left hanging without a connection to the ceiling also fall, scoring bonus points.',
      'Clear the entire board to complete the level, or keep playing to maximise your score.',
    ],
    tips: [
      'Use the side walls to bank shots around obstacles — ricocheting off a wall can reach clusters that have no direct line of fire.',
      'Save shots by targeting key "anchor" bubbles that hold large hanging groups; removing one can drop a cascade of emoji at once.',
      'Check the next-emoji preview before shooting — if the current emoji has no good match, plan an angle that positions it somewhere useful.',
      'Try to fire in bursts that create chain reactions rather than popping clusters one at a time; chains multiply your score quickly.',
    ],
    faqs: [
      {
        q: 'How do I trigger a chain reaction?',
        a: 'Pop a cluster that is holding other bubbles above empty space — those detached bubbles fall automatically, scoring bonus points on top of the original match.',
      },
      {
        q: 'What happens if the bubbles reach the bottom of the screen?',
        a: 'The game ends when the cluster descends past the danger line at the bottom. Clear rows quickly to keep the ceiling high.',
      },
      {
        q: 'Can I bank the shot off the walls?',
        a: 'Yes. The side walls reflect your shot at the same angle, which is useful for reaching bubbles tucked in corners.',
      },
    ],
  },

  'emoji-puzzle': {
    heading: 'About Emoji Memory Match',
    description:
      'Emoji Memory Match is a card-flipping concentration game that challenges you to find matching pairs hidden among a face-down grid of emoji tiles. Each turn you flip two cards — if they match, they stay face up; if not, they flip back over and you must remember their positions. Three difficulty levels let you start small with a 4×4 grid and work up to a demanding 8×8 board.',
    howTo: [
      'Choose a difficulty: Easy (4×4, 8 pairs), Medium (6×6, 18 pairs), or Hard (8×8, 32 pairs).',
      'All emoji tiles start face down — click or tap any tile to flip it over and reveal the emoji.',
      'Click a second tile to try to find its match.',
      'If both tiles show the same emoji, they remain face up and you earn a point.',
      'If they do not match, both tiles flip back face down after a brief pause — remember their positions.',
      'Continue until all pairs are matched. Your total moves and time are recorded at the end.',
    ],
    tips: [
      'Use the first several flips as a "scouting" phase — you will not match much yet, but you are building a mental map of where things are.',
      'Focus on the corners and edges first; those positions are easiest to remember because they have fewer surrounding tiles to confuse them.',
      'When you flip a tile and already know where its match is, resist the urge to rush — double-check your memory before clicking.',
      'On the 8×8 hard board, group the tiles mentally into quadrants and memorise one section at a time.',
    ],
    faqs: [
      {
        q: 'How many pairs are on each difficulty level?',
        a: 'Easy has 8 pairs on a 4×4 grid, Medium has 18 pairs on a 6×6 grid, and Hard has 32 pairs on an 8×8 grid.',
      },
      {
        q: 'Is there a time limit?',
        a: 'There is no hard time limit — the game tracks how long you take and how many moves you use, so you can challenge yourself to improve both.',
      },
      {
        q: 'Are the emoji pairs the same every game?',
        a: 'No. The emoji selection and their positions are randomised at the start of each new game, so every playthrough is different.',
      },
    ],
  },

  'older-or-newer': {
    heading: 'About Older or Newer',
    description:
      'Older or Newer is a trivia-style game that tests your knowledge of emoji history. Two emoji are displayed side by side and you must decide which one was introduced in an earlier Unicode version. With more than 3,700 emoji spanning from the first Unicode standards in 2010 all the way through 2024, there are plenty of surprising answers to discover.',
    howTo: [
      'Two emoji appear on screen at the same time, each showing only the character — no hints.',
      'Think about when each emoji might have been added to the Unicode standard.',
      'Click or tap the emoji you believe is older (came first in Unicode history).',
      "The game reveals both emoji's Unicode versions and release years after your guess.",
      'Score a point for each correct answer and keep a streak going for bonus points.',
      'The game continues with a new pair — see how many you can get right in a row.',
    ],
    tips: [
      'Older emoji tend to be simpler, more "universal" concepts — faces, hands, hearts, and common objects were added in early rounds.',
      'Newer emoji often represent niche ideas, specific foods, inclusive skin tones, or recently coined symbols like newer flag emojis.',
      'Technology and internet-culture emoji like certain symbols debuted earlier than you might expect — Unicode has been around since the 1990s.',
      'Track the version numbers shown after each answer; patterns emerge that help you calibrate future guesses.',
    ],
    faqs: [
      {
        q: 'Which Unicode version came first?',
        a: 'Emoji were formally part of Unicode from version 6.0 (2010). Earlier versions had some symbol characters, but the major emoji sets began with 6.0 and grew through each subsequent release up to Unicode 16.0 in 2024.',
      },
      {
        q: 'How many emoji are in the game?',
        a: 'The game draws from a pool of over 3,700 emoji covering all Unicode versions from 2010 through 2024.',
      },
      {
        q: 'What counts as a correct answer?',
        a: 'You must tap the emoji that belongs to the earlier Unicode version number. If both emoji share the same version, the game will not pair them together.',
      },
    ],
  },

  'guess-the-animal': {
    heading: 'About Guess the Animal',
    description:
      'Guess the Animal is a straightforward but engaging quiz that shows you one of 130 animal emoji and asks you to type the name of the creature it represents. It sounds simple, but some of the rarer animals can catch even experienced emoji users off guard. After every correct answer you are rewarded with a surprising or little-known fun fact about that animal, turning each round into a quick nature lesson.',
    howTo: [
      'An animal emoji appears in the centre of the screen.',
      'Type the name of the animal in the text field — common names are accepted (e.g. "elephant", not the scientific name).',
      'Press Enter or tap Submit to check your answer.',
      'If correct, a fun fact about that animal is shown before moving on.',
      'If incorrect, you can try again or skip to see the answer.',
      'Work through all 130 animals and track how many you got on the first try.',
    ],
    tips: [
      'Many emoji animals are represented by faces rather than full bodies — focus on distinguishing features like horns, beaks, or ear shape.',
      'The game accepts common English names; if your answer is being rejected, try an alternative common name (e.g. "puma" vs "mountain lion").',
      'Rarer entries like insects, sea creatures, and birds often trip people up — pay special attention to those categories.',
      'Read every fun fact even when you already knew the animal — the bonus information is curated to be genuinely interesting.',
    ],
    faqs: [
      {
        q: 'How many animals are in the game?',
        a: 'The game includes all 130 animal emoji in the standard Unicode set, from common mammals to insects, reptiles, and sea creatures.',
      },
      {
        q: 'Does spelling matter?',
        a: 'Minor spelling variations are handled gracefully, but try to enter recognisable English names. The game gives you feedback if it cannot match your answer.',
      },
      {
        q: 'Are the fun facts accurate?',
        a: 'Yes — each fun fact is sourced from established zoological information and is fact-checked for accuracy.',
      },
    ],
  },

  'guess-the-flag': {
    heading: 'About Guess the Flag',
    description:
      'Guess the Flag is a geography quiz built entirely around the flag emoji included in the Unicode standard. Each round shows you a flag emoji and asks you to identify the country or territory it represents. It covers nations from every continent, making it a useful and entertaining way to sharpen your world geography knowledge.',
    howTo: [
      'A flag emoji appears on screen — study the colours, symbols, and design.',
      'Type the country or territory name in the answer field, or select from multiple-choice options if that mode is active.',
      'Submit your answer to find out if you are correct.',
      'The correct country name and a brief note about the flag are revealed after each round.',
      'Your score tracks how many you have answered correctly out of the total shown.',
      'Replay to improve your accuracy or try to beat your previous streak.',
    ],
    tips: [
      'Group flags by their dominant colour or pattern — tricolour flags, cross designs, and star-and-stripe flags each have their own family of countries.',
      'Pay attention to crests, animals, or symbols overlaid on a plain background; those details usually narrow it down to one specific nation.',
      'Flags of smaller island nations and territories are the trickiest — spending time on those pays off in competitive rounds.',
      'Caribbean and Pacific island nations often share similar blue-and-green palettes; look for the distinguishing symbol in the centre.',
    ],
    faqs: [
      {
        q: 'How many flags are included?',
        a: 'The game covers all countries and territories that have an official flag emoji in the Unicode standard — over 250 entries.',
      },
      {
        q: 'Are territories and dependent regions included?',
        a: 'Yes. Many territories such as the Canary Islands, Guernsey, and various Caribbean and Pacific territories have their own flag emoji and appear in the quiz.',
      },
      {
        q: 'Does capitalisation matter when I type the answer?',
        a: 'No — the answer field is case-insensitive. Common alternate spellings and shortened names are also accepted.',
      },
    ],
  },

  'odd-one-out': {
    heading: 'About Odd One Out',
    description:
      'Odd One Out presents you with five emoji at a time, four of which share a hidden theme — fruit, weather, sports, emotions, and hundreds of other categories. Your task is to spot the one emoji that does not belong to that group. The categories grow more subtle and tricky as you progress, rewarding players who think creatively about how emoji can be connected.',
    howTo: [
      'Five emoji are displayed on the screen in a row.',
      'Study all five and look for a common thread connecting four of them.',
      'Tap or click the emoji you believe does not fit the theme.',
      'The game reveals the shared theme of the group and which emoji was the odd one out.',
      'Score points for each correct pick and build a streak for bonus multipliers.',
      'Keep playing through increasingly challenging rounds to test your lateral thinking.',
    ],
    tips: [
      'Do not fixate on the most obvious interpretation — "red things" might seem to link several emoji, but the intended category could be "Valentine\'s Day" or "danger symbols".',
      'Consider multiple category types: colour, shape, concept, cultural association, and word puns can all form the hidden theme.',
      'If you are torn between two answers, ask which one has the strongest connection to the other four rather than which one feels different.',
      'Later rounds deliberately use emoji that seem similar on the surface — slow down and think about each one individually before guessing.',
    ],
    faqs: [
      {
        q: 'How are the themes chosen?',
        a: 'Themes are hand-curated to cover a wide range of categories including colour, food type, emotion, sport, nature, and cultural concepts. Each puzzle is designed so the connection is fair but not always immediately obvious.',
      },
      {
        q: 'Can an emoji be the odd one out in more than one way?',
        a: 'The game is designed so there is one clear intended answer, but creative players sometimes spot additional valid patterns — the revealed explanation clarifies the intended reasoning.',
      },
      {
        q: 'Does the game get harder over time?',
        a: 'Yes. Early rounds use broad, clear categories while later rounds introduce more abstract or overlapping themes that require more careful thinking.',
      },
    ],
  },

  'emoji-wordle': {
    heading: 'About Emoji Wordle',
    description:
      "Emoji Wordle challenges you to guess a five-letter word drawn from an emoji's official Unicode name in six attempts. After each guess, tiles change colour to show how close you were: green means the letter is correct and in the right position, yellow means the letter is in the name but in the wrong spot, and grey means the letter does not appear in the target at all. It combines the logic of classic Wordle with the quirky vocabulary of Unicode emoji naming conventions.",
    howTo: [
      'Type a five-letter word and press Enter to submit your first guess.',
      'Each letter in your guess turns green (correct position), yellow (wrong position), or grey (not in the word).',
      'Use the colour feedback to narrow down the hidden word.',
      'Continue guessing — you have six total attempts to find the correct five-letter word.',
      'The word comes from the Unicode name of an emoji, which is revealed at the end of the round along with the emoji itself.',
      'Share your result grid (with emoji colour squares) to challenge friends.',
    ],
    tips: [
      'Open with a word rich in common vowels and consonants — words like CRANE, SLATE, or AUDIO eliminate many letters at once.',
      'Unicode emoji names use plain English words, so avoid obscure letter combinations and favour common vocabulary.',
      'Green letters are locked in — keep them in the same position every subsequent guess to avoid wasting attempts.',
      'If you have several yellows, rearrange those letters in a new word rather than adding new unknowns; you will solve the puzzle faster.',
    ],
    faqs: [
      {
        q: 'What words are used in Emoji Wordle?',
        a: 'Every target word is a five-letter segment taken from an official Unicode emoji name — for example, if the emoji is 🌊 "WATER WAVE", a puzzle might use WATER or WAVES as the hidden word.',
      },
      {
        q: 'Is there one puzzle per day like classic Wordle?',
        a: 'Emoji Wordle lets you play as many rounds as you like — a new puzzle is generated each time rather than being limited to one per day.',
      },
      {
        q: 'What do the colours mean?',
        a: 'Green means the letter is in the correct position. Yellow means the letter exists in the word but is in the wrong spot. Grey means the letter does not appear anywhere in the target word.',
      },
    ],
  },

  'emoji-2048': {
    heading: 'About Emoji 2048',
    description:
      'Emoji 2048 replaces the numbered tiles of the classic 2048 puzzle with a charming progression of emoji — starting from a tiny 🌱 seedling and merging your way up through plants, animals, and symbols until you reach the coveted 🏆 trophy. Slide all tiles in one direction at a time; matching emoji merge into the next emoji in the sequence, and a new tile appears after each move. The challenge is keeping the board from filling up before you reach the top.',
    howTo: [
      'Swipe or use arrow keys to slide all tiles on the board in one direction.',
      'When two identical emoji collide, they merge into the next emoji in the progression.',
      'A new tile (a 🌱 or 🌿) appears on the board after every move.',
      'Continue merging emoji to climb through the sequence toward the 🏆 trophy tile.',
      'The game ends when no moves remain — no empty spaces and no adjacent matching tiles.',
      'Try to achieve the highest emoji possible and beat your previous high score.',
    ],
    tips: [
      'Keep your highest-value emoji in one corner and build toward it — never slide in the direction that moves your best tile away from that corner.',
      'Avoid filling the board with low-value tiles; try to keep at least one row or column mostly clear as a "reset lane".',
      'Chain merges in a single swipe are powerful — position tiles so one move triggers multiple merges at once.',
      'Plan two or three moves ahead rather than reacting tile by tile; impulsive swipes are the fastest way to get stuck.',
    ],
    faqs: [
      {
        q: 'What is the highest emoji I can reach?',
        a: 'The highest tile is the 🏆 trophy, equivalent to the 2048 tile in the original game. Reaching it requires sustained strategic play.',
      },
      {
        q: 'How does the emoji sequence work?',
        a: 'Each merge produces the next emoji in a predefined chain — for example, two 🌱 seedlings merge into 🌿, and two 🌿 merge into the next stage. The full chain is visible in the progression guide.',
      },
      {
        q: 'Can I undo a move?',
        a: 'Yes. There is an undo button that reverses your last move, useful for recovering from an accidental swipe.',
      },
    ],
  },

  'whack-a-mole': {
    heading: 'About Emoji Whack-a-Mole',
    description:
      'Emoji Whack-a-Mole is a fast-paced tapping game where emoji faces pop up randomly across a 3×3 grid and you have to tap them before they disappear. You have 30 seconds to rack up as high a score as possible, and the speed of the emoji increases as the clock ticks down, keeping the pressure on from start to finish. It is a perfect quick-session game that tests reaction speed and focus.',
    howTo: [
      'Tap the "Start" button to begin the 30-second countdown.',
      'Emoji faces will pop up in random holes across the 3×3 grid.',
      'Tap an emoji as fast as you can before it ducks back down.',
      'Each successful tap earns you a point.',
      'The emoji appear and disappear faster as time runs out.',
      'When the timer hits zero, your final score is displayed — try to beat it on the next run.',
    ],
    tips: [
      'Keep your finger (or cursor) near the centre of the grid so you can reach any of the nine holes quickly without large movements.',
      'Focus on the holes rather than the specific emoji — reacting to motion is faster than reading the face first.',
      'Avoid tapping holes where an emoji just disappeared; they have a brief cooldown before another can appear there.',
      'On mobile, use a light touch for rapid successive taps — pressing too hard slows down your repeat speed.',
    ],
    faqs: [
      {
        q: 'How long is each game?',
        a: 'Each round lasts exactly 30 seconds. The timer is shown on screen so you always know how much time remains.',
      },
      {
        q: 'Does the game get faster?',
        a: 'Yes. Emoji appear and retreat more quickly as the game progresses, so later seconds are noticeably harder than the opening.',
      },
      {
        q: 'Is there a penalty for tapping an empty hole?',
        a: 'No penalty is applied for missing a tap — only successful hits count toward your score.',
      },
    ],
  },

  'speed-sort': {
    heading: 'About Speed Sort',
    description:
      'Speed Sort is a rapid-fire categorisation game that flashes an emoji on screen and gives you just three seconds to tap the correct category it belongs to. Over ten rounds you will sort emoji into groups like Food, Animals, Nature, Objects, and more — testing both your emoji knowledge and your ability to think fast under pressure. Your final score reflects both accuracy and speed.',
    howTo: [
      'Press Start to begin the first of ten rounds.',
      'An emoji appears prominently in the centre of the screen.',
      'A set of category buttons is shown below the emoji.',
      'Tap the category you believe the emoji belongs to within 3 seconds.',
      'A correct answer scores a point; an incorrect answer or timeout scores zero for that round.',
      'After ten rounds, your total score and accuracy percentage are displayed.',
    ],
    tips: [
      'Learn the category list before starting — knowing which options exist means you can eliminate wrong categories instantly rather than reading each one.',
      'Trust your first instinct; overthinking within a 3-second window almost always leads to a wrong tap on the last half-second.',
      'Some emoji are intentionally ambiguous — for example a 🌶 could be Food or Nature. The game uses consistent rules, so replay a few times to learn the edge cases.',
      'Keep your hand or cursor near the centre of the button row so you can reach any category without moving far.',
    ],
    faqs: [
      {
        q: 'What categories are used in Speed Sort?',
        a: 'Categories include Food & Drink, Animals & Nature, Travel & Places, Activities & Sports, Objects, and Symbols & Flags, matching the official Unicode emoji categories.',
      },
      {
        q: 'What happens if the 3-second timer runs out?',
        a: 'The round is counted as incorrect and you score zero for that emoji. The game moves on immediately to the next round.',
      },
      {
        q: 'Are the same ten emoji used every game?',
        a: 'No. A new set of ten emoji is drawn randomly each game from a large pool, so each playthrough tests different characters.',
      },
    ],
  },

  'emoji-timeline': {
    heading: 'About Emoji Timeline',
    description:
      'Emoji Timeline is a puzzle game that presents you with five emoji and challenges you to arrange them in chronological order from the oldest Unicode version to the newest. Each round is a fresh set of five emoji drawn from across the full Unicode history, and the difficulty lies in the fact that some surprisingly new-looking emoji actually predate much simpler ones. It is part trivia, part logical deduction.',
    howTo: [
      'Five emoji are shown on screen in a random scrambled order.',
      'Drag and drop the emoji cards to rearrange them from oldest (left) to newest (right).',
      'When you are satisfied with your order, press "Submit" to check your answer.',
      'The correct chronological order is revealed, showing the Unicode version and year for each emoji.',
      'You score points for each emoji placed in the correct position.',
      'A new set of five emoji is loaded for the next round.',
    ],
    tips: [
      'Very simple, universally understood emoji — like a smiley face or red heart — tend to be older than niche or culturally specific ones.',
      'Skin tone modifier support and gender variants were added in later Unicode versions, so inclusive emoji variants are usually newer.',
      'Food emoji expanded dramatically in Unicode 9.0 and 10.0 (2016-2017) — if you see avocado, bacon, or croissant, they are from that era.',
      'Flag emoji for individual regions and territories were added over many years; national flags tend to be older than sub-national flags.',
    ],
    faqs: [
      {
        q: 'How is the order determined?',
        a: 'The correct order is based on the official Unicode version in which each emoji was first introduced, from lowest version number (oldest) to highest (newest).',
      },
      {
        q: 'What if two emoji were added in the same Unicode version?',
        a: 'The game avoids pairing emoji from the same version in the same puzzle, so there is always a clear correct order.',
      },
      {
        q: 'How many rounds are in a game?',
        a: 'There is no fixed round limit — the game generates new puzzles continuously. You can stop whenever you like and your cumulative score is shown.',
      },
    ],
  },

  'emoji-pictionary': {
    heading: 'About Emoji Pictionary',
    description:
      'Emoji Pictionary gives you a text clue describing a word, phrase, film, or concept, and you have to figure out which single emoji best represents it — then type that emoji. With 40 clues per game and a 60-second overall timer, it blends vocabulary knowledge with emoji literacy in a way that is both challenging and laugh-out-loud fun. It is an excellent solo challenge or a great way to settle debates about what an emoji "really means".',
    howTo: [
      'Press Start to begin your 60-second game.',
      'A text clue appears on screen describing something the emoji should represent.',
      "Type the emoji character into the answer field — use your device's emoji keyboard or copy-paste.",
      'Press Enter or Submit to check your answer.',
      'A correct match scores a point and the next clue loads immediately.',
      'Work through as many of the 40 clues as possible before the timer runs out.',
    ],
    tips: [
      'Read the clue for multiple possible interpretations — "fire" could mean 🔥, but the clue might be describing enthusiasm, a campfire, or a chef\'s hot dish.',
      'Think about the most iconic or universally recognised emoji for a concept rather than an obscure variation.',
      "Use your device's built-in emoji search (available on most keyboards) to quickly look up emoji by keyword rather than scrolling through categories.",
      'If you are unsure, submit a guess anyway — wrong answers carry no penalty and a quick attempt is faster than agonising over it.',
    ],
    faqs: [
      {
        q: 'How do I input an emoji on desktop?',
        a: 'On Windows, press Win + . (period) to open the emoji picker. On macOS, press Cmd + Ctrl + Space. You can also copy an emoji from any website and paste it into the field.',
      },
      {
        q: 'Are there multiple correct answers for some clues?',
        a: 'Some clues accept a small set of equivalent emoji — for example, a clue about "fire" might accept both 🔥 and 🕯️ depending on the context. The exact accepted answers are shown after each question.',
      },
      {
        q: 'How are the 40 clues selected?',
        a: 'The 40 clues are drawn from a larger pool and randomised each game, so replaying gives you a different set to work through.',
      },
    ],
  },

  'missing-piece': {
    heading: 'About Missing Piece',
    description:
      'Missing Piece shows you a 3×3 grid of thematically related emoji with one tile hidden, and asks you to choose the correct missing emoji from four options. The challenge is that the four answer choices are deliberately similar — you need to understand the pattern or theme of the full grid, not just recognise an individual emoji. It rewards pattern recognition and attention to detail.',
    howTo: [
      'A 3×3 grid of emoji appears with one tile replaced by a question mark.',
      'Study the eight visible emoji to identify the theme or pattern connecting them.',
      'Four candidate emoji are shown below the grid as possible answers.',
      'Tap or click the emoji you believe belongs in the missing position.',
      "The correct emoji is revealed along with an explanation of the grid's theme.",
      'Score points for correct answers and move on to the next puzzle.',
    ],
    tips: [
      'Look at the grid as a whole before focusing on individual emoji — the connection is often a shared category, colour, or concept across all nine tiles.',
      'Check whether the grid is ordered (alphabetically by name, by Unicode version, by size) as well as themed — some puzzles use both.',
      'The four answer options are chosen to be plausible; one will match the theme perfectly while the others subtly diverge — identify the exact pattern before choosing.',
      'Read the row and column the hidden tile is in separately; sometimes the horizontal and vertical neighbours are different clues that together pinpoint the answer.',
    ],
    faqs: [
      {
        q: 'How many puzzles are there?',
        a: 'There is a large pool of hand-crafted puzzles that are served in random order. You are unlikely to see the same puzzle twice in a normal play session.',
      },
      {
        q: 'Are the wrong answer choices random?',
        a: 'No — the distractor options are carefully chosen to be emoji that could plausibly fit the theme but do not. This is intentional to make the puzzle genuinely challenging.',
      },
      {
        q: 'What kind of themes are used?',
        a: 'Themes include emoji categories (all food, all animals), colour families, emotional expressions, seasonal items, cultural sets, and conceptual groupings like "things that move".',
      },
    ],
  },

  'story-builder': {
    heading: 'About Story Builder',
    description:
      'Story Builder is a creative narrative game that guides you through six story stages — Setup, Rising Action, Conflict, Climax, Falling Action, and Resolution — asking you to pick one emoji per stage to represent that chapter. Your six chosen emoji are strung together into a shareable emoji story that you and others can interpret. Every combination tells a different tale, making each playthrough uniquely personal.',
    howTo: [
      'The game presents the first story stage (Setup) with a prompt describing what this chapter needs.',
      'A selection of emoji appears — choose the one that you feel best represents your story at this stage.',
      'Your chosen emoji is locked in for that chapter and the next stage is revealed.',
      'Continue picking one emoji per stage through all six chapters.',
      'After the final stage, your complete six-emoji story sequence is displayed.',
      'Copy or share your story sequence with friends and see how they interpret your choices.',
    ],
    tips: [
      'Do not overthink each choice — your instinctive pick usually produces the most interesting story and reveals something genuine about your perspective.',
      'Try to build a narrative arc: an early happy emoji followed by tension and resolution is more satisfying than six random unrelated picks.',
      "Replay with intentional themes in mind — a horror story, a romance, or a hero's journey all produce very different emoji sequences.",
      'Share your story before revealing your intended meaning and ask friends to guess the plot — their interpretations are often funnier than yours.',
    ],
    faqs: [
      {
        q: 'Is there a correct answer for each stage?',
        a: 'No — the game is entirely open-ended. There are no right or wrong choices. The goal is creative expression, not scoring.',
      },
      {
        q: 'How many stages are in a story?',
        a: 'Every story has exactly six stages, one for each phase of a classic narrative arc: Setup, Rising Action, Conflict, Climax, Falling Action, and Resolution.',
      },
      {
        q: 'Can I replay and try a different story?',
        a: 'Yes. Hit "New Story" to start a fresh run with a different set of emoji options at each stage.',
      },
    ],
  },

  // ── TOOLS ─────────────────────────────────────────────────────────────────

  'emoji-to-png': {
    heading: 'About Emoji to PNG',
    description:
      'Emoji to PNG lets you download any emoji as a high-quality PNG image file in seconds. Choose from output sizes ranging from 64 px all the way up to 1024 px, set a transparent or custom-colour background, and add padding around the emoji for cleaner use in designs. The rendered images use the system emoji font, ensuring crisp results at every size.',
    howTo: [
      'Search for or browse to the emoji you want to export.',
      'Select the output resolution: 64 px, 128 px, 256 px, 512 px, or 1024 px.',
      'Choose a background — transparent (default), white, or a custom hex colour.',
      'Adjust the padding slider to add space around the emoji inside the canvas.',
      'Click "Download PNG" to save the image to your device.',
      'Use the downloaded PNG in any design tool, presentation, or website.',
    ],
    tips: [
      'Use transparent background when you plan to place the emoji on a coloured or photographic background in your project.',
      'Export at 1024 px if you need to resize down later — starting large preserves quality better than upscaling a small image.',
      'Add a small amount of padding (around 10%) to prevent the emoji from being clipped by circle or rounded-corner cropping in social media platforms.',
      'White background exports are ideal for apps that do not support transparency, such as older image viewers or certain email clients.',
    ],
    faqs: [
      {
        q: 'What is the maximum PNG size I can download?',
        a: 'The tool supports export sizes up to 1024 × 1024 pixels. For most use cases — icons, stickers, social media posts — 256 px or 512 px is sufficient.',
      },
      {
        q: 'Does the exported emoji look the same on all devices?',
        a: "The image is rendered using the emoji font available in your browser, which is typically the system font for your operating system. The resulting PNG will look like that platform's emoji style.",
      },
      {
        q: 'Can I use the downloaded PNG commercially?',
        a: 'Emoji designs are subject to the licensing of the font vendor (Apple, Google, etc.). For commercial use, check the specific font licence or consider using open-licensed emoji sets such as Twemoji.',
      },
    ],
  },

  'emoji-favicon': {
    heading: 'About Emoji Favicon Generator',
    description:
      'Emoji Favicon Generator makes it effortless to set a distinctive favicon for your website using any emoji character. Simply choose an emoji, preview it at typical browser tab sizes, and download either an ICO file for maximum compatibility or a PNG for modern browsers. It is the fastest way to give your site a recognisable identity without needing any design software.',
    howTo: [
      'Pick the emoji you want to use as your favicon using the search or browse interface.',
      'Preview how the emoji looks at 16 px, 32 px, and 64 px — the sizes browsers use in tabs, bookmarks, and shortcuts.',
      'Choose your download format: ICO (compatible with all browsers including older ones) or PNG.',
      'Click "Download" to save the favicon file to your computer.',
      "Upload the file to your website's root directory and add the appropriate <link> tag to your HTML <head>.",
      'Check your browser tab to confirm the favicon is showing correctly.',
    ],
    tips: [
      'Simple, high-contrast emoji work best at small sizes — highly detailed emoji can become unrecognisable at 16 px or 32 px.',
      'If your site has a dark-mode design, test the favicon against a dark browser theme — light-coloured emoji may be hard to see.',
      'Download the ICO format if you need the widest browser support, including Internet Explorer and older Safari versions.',
      'After updating your favicon, hard-refresh your browser (Ctrl + Shift + R or Cmd + Shift + R) to clear the cached old icon.',
    ],
    faqs: [
      {
        q: 'Which file format should I use — ICO or PNG?',
        a: 'ICO is the traditional format with the broadest compatibility. PNG is simpler and works in all modern browsers. For new projects targeting modern users, PNG at 32 px or 64 px is usually sufficient.',
      },
      {
        q: 'How do I add the favicon to my website?',
        a: 'Upload the file to your root directory and add <link rel="icon" href="/favicon.ico"> (or .png) inside the <head> element of your HTML. Most site builders also have a favicon field in their settings panel.',
      },
      {
        q: 'Will the favicon look the same for all visitors?',
        a: "The favicon is a static image, so it will look the same regardless of the visitor's operating system — unlike inline emoji which render in the OS font.",
      },
    ],
  },

  'emoji-color-palette': {
    heading: 'About Emoji Color Palette',
    description:
      'Emoji Color Palette analyses any emoji and extracts the dominant colours from it, returning a palette of hex and RGB codes you can use directly in your design work. Whether you are building a branded UI, choosing a colour scheme inspired by a logo emoji, or simply curious what exact shades go into a specific character, this tool does the analysis instantly in your browser.',
    howTo: [
      'Search for or select the emoji you want to analyse.',
      'The tool renders the emoji and samples its pixel colours automatically.',
      'A palette of dominant colours is displayed, each with its hex code and RGB values.',
      'Click any colour swatch to copy the hex code to your clipboard.',
      'Use the copied colour values directly in CSS, design tools like Figma, or image editors.',
      'Try different emoji to compare palettes and find combinations that work together.',
    ],
    tips: [
      'Skin-tone modifier emoji yield different palettes — try multiple skin tone variants if you need a specific flesh-tone reference.',
      'Food and nature emoji tend to have rich, earthy palettes; flag emoji produce crisp, saturated national colours perfect for themed designs.',
      'Use the extracted palette as a starting point in Figma or Adobe XD by pasting the hex values into your swatches panel.',
      'If you need an accessible contrast pair, pick the lightest and darkest colours from the extracted palette and check their contrast ratio.',
    ],
    faqs: [
      {
        q: 'How accurate is the colour extraction?',
        a: "The tool renders the emoji using the browser's emoji font and samples the resulting pixels. The accuracy depends on the emoji font, but dominant colours are reliably identified.",
      },
      {
        q: 'Can I get RGB as well as hex values?',
        a: 'Yes. Each colour in the palette is shown with both its hex code (#rrggbb format) and its RGB values (r, g, b integers).',
      },
      {
        q: 'Why do colours differ between operating systems?',
        a: 'Different platforms (Apple, Google, Windows) use their own emoji designs, which may use slightly different shades for the same emoji. The tool analyses whichever font your browser uses.',
      },
    ],
  },

  'emoji-watermark': {
    heading: 'About Emoji Watermark',
    description:
      'Emoji Watermark lets you overlay any emoji onto a photo as a watermark, with full control over size, position, and opacity — all processed locally in your browser so your image is never uploaded to any server. It is ideal for protecting shared photos with a personal stamp, adding a playful signature to social media posts, or branding images for a creative project.',
    howTo: [
      'Click "Upload Photo" to select an image from your device — it loads directly in your browser.',
      'Choose the emoji you want to use as your watermark.',
      'Drag the watermark emoji to the position you want on the photo.',
      'Use the size slider to scale the emoji up or down relative to the image.',
      'Adjust the opacity slider to make the watermark subtle or prominent.',
      'Click "Download" to save the watermarked image to your device.',
    ],
    tips: [
      'Low opacity (20–40%) works well for a subtle copyright stamp that does not distract from the photo.',
      'Placing the watermark over a visually complex part of the image (textured background, busy scene) makes it harder to remove digitally.',
      'For social media branding, use full opacity and place the emoji in a corner — this doubles as a recognisable signature.',
      'Combine a semi-transparent emoji with a slight shadow effect to ensure the watermark remains visible on both light and dark photo backgrounds.',
    ],
    faqs: [
      {
        q: 'Is my photo uploaded to a server?',
        a: 'No. All processing happens entirely in your browser using the HTML Canvas API. Your image never leaves your device.',
      },
      {
        q: 'What image formats are supported?',
        a: 'You can upload JPG, PNG, and WebP images. The download is always provided as a PNG to preserve any transparent areas.',
      },
      {
        q: 'Can I add more than one watermark emoji?',
        a: 'The current tool supports a single emoji watermark per image. For multiple overlays, you can apply the tool sequentially.',
      },
    ],
  },

  'emoji-card': {
    heading: 'About Emoji Card Maker',
    description:
      'Emoji Card Maker is a quick design tool for creating shareable social media cards that pair a prominent emoji with custom text on a gradient background. Configure the emoji size, choose from a range of gradient presets or set your own colours, type your headline or message, and download a ready-to-post PNG in social-friendly dimensions. No design skills required.',
    howTo: [
      'Choose the emoji you want to feature on the card.',
      'Type your custom text — a headline, quote, or call to action.',
      'Select a background gradient from the preset swatches or set a custom start and end colour.',
      'Adjust the emoji size, text size, and layout alignment to your liking.',
      'Preview the card to see how it looks at social media dimensions.',
      'Click "Download PNG" to save the finished card to your device.',
    ],
    tips: [
      'High-contrast text colours against the gradient background improve readability — light text on dark gradients or vice versa works best.',
      'Keep your headline short: one punchy line fits cleanly and reads well in feed thumbnails where the card appears small.',
      "Choose a gradient that complements the emoji's colour palette for a more cohesive, intentional look.",
      'Square format (1:1) works across the widest range of platforms — Instagram, Twitter, LinkedIn, and messaging apps all handle it well.',
    ],
    faqs: [
      {
        q: 'What dimensions is the downloaded card?',
        a: 'The default output is 1080 × 1080 px (square), which is the recommended size for Instagram, Twitter, and LinkedIn posts.',
      },
      {
        q: 'Can I use a custom font?',
        a: 'The tool currently uses a clean system sans-serif font for broad compatibility. Custom font options may be added in future updates.',
      },
      {
        q: 'Can I use the card for commercial social media posts?',
        a: "The text and gradient are fully yours to use. The emoji rendering is subject to the emoji font licence of your browser's platform, so review that licence for commercial use.",
      },
    ],
  },

  'emoji-inspector': {
    heading: 'About Emoji Inspector',
    description:
      "Emoji Inspector is a developer and typographer's tool that decodes any text you paste into it, revealing the Unicode codepoint, official name, Unicode version, and category for every single character — including emoji, invisible joiners, skin tone modifiers, and variation selectors. It is the quickest way to understand exactly what is inside a complex emoji sequence or a block of pasted text.",
    howTo: [
      'Paste or type any text into the input field — emoji, mixed text, or anything from your clipboard.',
      'The tool instantly breaks the input down character by character.',
      'Each character is shown with its rendered glyph, Unicode codepoint (e.g. U+1F600), official name, Unicode version, and category.',
      "Click any row to copy that character's codepoint or name to your clipboard.",
      'Use the detail panel to read the full Unicode metadata for any selected character.',
      'Clear the field and paste new text to analyse something different.',
    ],
    tips: [
      'Paste a complex multi-person or family emoji to see how many individual codepoints are joined by Zero Width Joiner (ZWJ) sequences — the results are often surprising.',
      'Use it to debug text rendering issues: invisible characters, directional marks, and variation selectors are exposed and labelled here when they are invisible everywhere else.',
      'The Unicode version field is useful for checking whether an emoji will render correctly on older operating systems that have not updated their emoji font.',
      'Copy the codepoint in U+ notation directly from the inspector to reference it in CSS \\content properties or HTML entities.',
    ],
    faqs: [
      {
        q: 'What is a Unicode codepoint?',
        a: 'A codepoint is the unique number assigned to every character in the Unicode standard. It is written in the format U+XXXX, where XXXX is a hexadecimal number — for example, U+1F600 represents the 😀 grinning face emoji.',
      },
      {
        q: 'Why does one emoji sometimes show as multiple characters?',
        a: 'Many emoji are composite sequences — a base emoji combined with a skin tone modifier, gender sign, and Zero Width Joiner (ZWJ) characters. Emoji Inspector shows every individual codepoint in the sequence.',
      },
      {
        q: 'Can I inspect emoji from other languages and scripts?',
        a: 'Yes. The tool handles any Unicode text, so you can paste Arabic, Chinese, Devanagari, or any other script and see the codepoints and names for those characters too.',
      },
    ],
  },

  'emoji-kitchen': {
    heading: 'About Emoji Kitchen',
    description:
      "Emoji Kitchen uses Google's official Emoji Kitchen API to blend two emoji together into a single mashup sticker image. Google's design team has hand-crafted thousands of combination images mixing expressions, objects, and themes in delightful ways. Browse the results right in your browser and download any mashup as a PNG to use in messages, stickers, or creative projects.",
    howTo: [
      'Select the first emoji from the search panel or emoji grid.',
      'Select a second emoji to combine with the first.',
      'The Emoji Kitchen mashup image is fetched and displayed automatically.',
      "If the combination exists in Google's library, the blended sticker appears immediately.",
      'Click "Download PNG" to save the mashup image to your device.',
      'Try different combinations — some unexpected pairings produce surprisingly creative results.',
    ],
    tips: [
      "Face emoji combined with face emoji almost always produce a mashup; mixing a face with an object is hit-or-miss depending on whether Google's designers made that pair.",
      'If a combination shows no result, try swapping the order of the two emoji — some pairs only work in one direction.',
      'Downloaded stickers look great in messaging apps that support custom sticker packs, or as profile picture overlays.',
      'Explore combinations with seasonal or holiday emoji — pumpkin + ghost, snowflake + snowman — as these tend to have particularly elaborate mashups.',
    ],
    faqs: [
      {
        q: 'Does every combination of two emoji produce a result?',
        a: "No. Emoji Kitchen only returns an image if Google's team has created that specific combination. There are tens of thousands of supported pairs, but not every possible pairing has been designed.",
      },
      {
        q: 'Who created the Emoji Kitchen images?',
        a: "The mashup images are created by Google's emoji design team and are served via the Google Emoji Kitchen API, which powers the combination feature in Gboard.",
      },
      {
        q: 'Can I use the downloaded mashup images freely?',
        a: "The images are provided by Google and are subject to their terms of service. They are intended for personal communication use. Check Google's terms before using them in commercial or public-facing contexts.",
      },
    ],
  },

  personality: {
    heading: 'About Emoji Personality Quiz',
    description:
      'The Emoji Personality Quiz is a 12-question assessment grounded in personality science that maps your responses to five emoji that reflect key traits in your character. Each question presents real-world scenarios and preferences drawn from established psychological frameworks, and the results show which emoji best embody the dimensions of your personality — along with a plain-English explanation of what each emoji represents about you.',
    howTo: [
      'Press Start to begin the 12-question quiz.',
      'Each question presents a scenario or preference — read it carefully and pick the option that genuinely reflects how you think or behave.',
      'Answer honestly rather than choosing what sounds impressive; the results are most meaningful when they are accurate.',
      'Work through all 12 questions at whatever pace feels natural.',
      'After the final question, your five personality emoji are revealed along with descriptions of each trait.',
      'Share your emoji personality set with friends and compare results.',
    ],
    tips: [
      'Answer based on your natural tendencies rather than how you wish you were — the quiz reflects patterns, and self-aware answers produce the most resonant results.',
      'Do not over-analyse each question; your first instinct is usually the most authentic answer.',
      'Retake the quiz if your mood was unusually elevated or low the first time — personality traits are stable, but extreme states can skew single-session results.',
      'Use the trait descriptions as conversation starters rather than definitive labels — personality science offers models, not verdicts.',
    ],
    faqs: [
      {
        q: 'What personality framework does the quiz use?',
        a: 'The questions draw on well-established personality dimensions including openness, conscientiousness, extraversion, agreeableness, and emotional stability — commonly known as the Big Five model.',
      },
      {
        q: 'Why five emoji and not one?',
        a: 'Personality is multidimensional. Representing you with five emoji reflects the fact that no single trait captures a whole person — each emoji highlights a different facet of your character.',
      },
      {
        q: 'Is the quiz scientifically validated?',
        a: 'The quiz is inspired by validated personality science and designed to be meaningful and accurate, but it is a brief consumer tool rather than a clinical assessment. Treat the results as a fun and reflective portrait, not a diagnostic.',
      },
    ],
  },
};
