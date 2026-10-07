// Curated special characters for the symbol picker. Each line is
// "<symbol> <name>"; names follow the Unicode character names, shortened.

export type SymbolGroup = {
  id: string;
  name: string;
  symbols: { char: string; name: string }[];
};

const parse = (block: string) =>
  block
    .trim()
    .split('\n')
    .map((line) => {
      const t = line.trim();
      const space = t.indexOf(' ');
      return { char: t.slice(0, space), name: t.slice(space + 1) };
    });

const RAW: { id: string; name: string; block: string }[] = [
  {
    id: 'arrows',
    name: 'Arrows',
    block: `
      → Rightwards arrow
      ← Leftwards arrow
      ↑ Upwards arrow
      ↓ Downwards arrow
      ↔ Left right arrow
      ↕ Up down arrow
      ↖ North west arrow
      ↗ North east arrow
      ↘ South east arrow
      ↙ South west arrow
      ⇒ Rightwards double arrow
      ⇐ Leftwards double arrow
      ⇑ Upwards double arrow
      ⇓ Downwards double arrow
      ⇔ Left right double arrow
      ⇕ Up down double arrow
      ⟶ Long rightwards arrow
      ⟵ Long leftwards arrow
      ⟷ Long left right arrow
      ⟹ Long rightwards double arrow
      ↩ Leftwards arrow with hook
      ↪ Rightwards arrow with hook
      ↺ Anticlockwise open circle arrow
      ↻ Clockwise open circle arrow
      ⟳ Clockwise gapped circle arrow
      ⇄ Rightwards arrow over leftwards arrow
      ⇆ Leftwards arrow over rightwards arrow
      ⇅ Up arrow left of down arrow
      ⇉ Rightwards paired arrows
      ↠ Rightwards two-headed arrow
      ↣ Rightwards arrow with tail
      ↦ Rightwards arrow from bar
      ⇢ Rightwards dashed arrow
      ⇨ Rightwards white arrow
      ➔ Heavy wide-headed rightwards arrow
      ➜ Heavy round-tipped rightwards arrow
      ➝ Triangle-headed rightwards arrow
      ➞ Heavy triangle-headed rightwards arrow
      ➤ Black rightwards arrowhead
      ➥ Heavy black curved downwards and rightwards arrow
      ➦ Heavy black curved upwards and rightwards arrow
      ⬅ Leftwards black arrow
      ➡ Black rightwards arrow
      ⬆ Upwards black arrow
      ⬇ Downwards black arrow
      ⤴ Arrow pointing rightwards then curving upwards
      ⤵ Arrow pointing rightwards then curving downwards
      ↯ Downwards zigzag arrow
      ▲ Black up-pointing triangle
      ▼ Black down-pointing triangle
      ◀ Black left-pointing triangle
      ▶ Black right-pointing triangle
      ‹ Single left angle quotation mark
      › Single right angle quotation mark
      « Left double angle quotation mark
      » Right double angle quotation mark
    `,
  },
  {
    id: 'check-marks',
    name: 'Check marks & crosses',
    block: `
      ✓ Check mark
      ✔ Heavy check mark
      ☑ Ballot box with check
      ✅ White heavy check mark
      🗸 Light check mark
      ✗ Ballot x
      ✘ Heavy ballot x
      ✕ Multiplication x
      ✖ Heavy multiplication x
      ❌ Cross mark
      ❎ Negative squared cross mark
      ☒ Ballot box with x
      ☐ Ballot box
      ⊠ Squared times
      ⊗ Circled times
      ⨯ Vector or cross product
      ○ White circle
      ● Black circle
      ◉ Fisheye
      ◯ Large circle
      ⦿ Circled bullet
      ⭕ Heavy large circle
    `,
  },
  {
    id: 'stars',
    name: 'Stars & sparkles',
    block: `
      ★ Black star
      ☆ White star
      ✦ Black four-pointed star
      ✧ White four-pointed star
      ✩ Stress outlined white star
      ✪ Circled white star
      ✫ Open centre black star
      ✬ Black centre white star
      ✭ Outlined black star
      ✮ Heavy outlined black star
      ✯ Pinwheel star
      ✰ Shadowed white star
      ✱ Heavy asterisk
      ✲ Open centre asterisk
      ✳ Eight spoked asterisk
      ✴ Eight pointed black star
      ✵ Eight pointed pinwheel star
      ✶ Six pointed black star
      ✷ Eight pointed rectilinear black star
      ✸ Heavy eight pointed rectilinear black star
      ✹ Twelve pointed black star
      ❂ Circled open centre eight pointed star
      ⁂ Asterism
      ✺ Sixteen pointed asterisk
      ❉ Balloon-spoked asterisk
      ❋ Heavy eight teardrop-spoked propeller asterisk
      ❄ Snowflake
      ❅ Tight trifoliate snowflake
      ❆ Heavy chevron snowflake
      ✨ Sparkles
      ⭐ White medium star
      🌟 Glowing star
      ⋆ Star operator
      ٭ Arabic five pointed star
    `,
  },
  {
    id: 'hearts',
    name: 'Hearts',
    block: `
      ♥ Black heart suit
      ♡ White heart suit
      ❤ Heavy black heart
      ❥ Rotated heavy black heart bullet
      ❣ Heavy heart exclamation mark ornament
      ❦ Floral heart
      ❧ Rotated floral heart bullet
      ღ Georgian letter ghan (heart-like)
      ۵ Extended Arabic-Indic digit five (heart-like)
      💕 Two hearts
      💖 Sparkling heart
      💗 Growing heart
      💘 Heart with arrow
      💝 Heart with ribbon
      💞 Revolving hearts
      💔 Broken heart
      🤍 White heart
      🖤 Black heart
    `,
  },
  {
    id: 'currency',
    name: 'Currency',
    block: `
      $ Dollar sign
      ¢ Cent sign
      € Euro sign
      £ Pound sign
      ¥ Yen sign
      ₹ Indian rupee sign
      ₽ Ruble sign
      ₩ Won sign
      ₺ Turkish lira sign
      ₴ Hryvnia sign
      ₦ Naira sign
      ₱ Peso sign
      ₫ Dong sign
      ₪ New sheqel sign
      ₭ Kip sign
      ₮ Tugrik sign
      ₲ Guarani sign
      ₵ Cedi sign
      ₸ Tenge sign
      ₼ Manat sign
      ₾ Lari sign
      ₡ Colon sign
      ₿ Bitcoin sign
      ﷼ Rial sign
      ¤ Currency sign
      ฿ Thai baht
      ƒ Florin (f with hook)
      ₣ French franc sign
      ₤ Lira sign
      ₧ Peseta sign
    `,
  },
  {
    id: 'math',
    name: 'Math',
    block: `
      ± Plus-minus sign
      ∓ Minus-or-plus sign
      × Multiplication sign
      ÷ Division sign
      − Minus sign
      ≠ Not equal to
      ≈ Almost equal to
      ≡ Identical to
      ≅ Approximately equal to
      ∝ Proportional to
      ≤ Less-than or equal to
      ≥ Greater-than or equal to
      ≪ Much less-than
      ≫ Much greater-than
      ∞ Infinity
      √ Square root
      ∛ Cube root
      ∜ Fourth root
      ∑ N-ary summation
      ∏ N-ary product
      ∫ Integral
      ∬ Double integral
      ∮ Contour integral
      ∂ Partial differential
      ∆ Increment (delta)
      ∇ Nabla
      ∀ For all
      ∃ There exists
      ∄ There does not exist
      ∅ Empty set
      ∈ Element of
      ∉ Not an element of
      ∋ Contains as member
      ⊂ Subset of
      ⊃ Superset of
      ⊆ Subset of or equal to
      ⊇ Superset of or equal to
      ∩ Intersection
      ∪ Union
      ∧ Logical and
      ∨ Logical or
      ¬ Not sign
      ⊕ Circled plus
      ⊥ Up tack (perpendicular)
      ∥ Parallel to
      ∠ Angle
      ∴ Therefore
      ∵ Because
      ° Degree sign
      ′ Prime (minutes, feet)
      ″ Double prime (seconds, inches)
      ‰ Per mille sign
      ‱ Per ten thousand sign
      ℕ Double-struck capital N (natural numbers)
      ℤ Double-struck capital Z (integers)
      ℚ Double-struck capital Q (rationals)
      ℝ Double-struck capital R (real numbers)
      ℂ Double-struck capital C (complex numbers)
      ℮ Estimated symbol
    `,
  },
  {
    id: 'fractions',
    name: 'Fractions',
    block: `
      ½ Vulgar fraction one half
      ⅓ Vulgar fraction one third
      ⅔ Vulgar fraction two thirds
      ¼ Vulgar fraction one quarter
      ¾ Vulgar fraction three quarters
      ⅕ Vulgar fraction one fifth
      ⅖ Vulgar fraction two fifths
      ⅗ Vulgar fraction three fifths
      ⅘ Vulgar fraction four fifths
      ⅙ Vulgar fraction one sixth
      ⅚ Vulgar fraction five sixths
      ⅐ Vulgar fraction one seventh
      ⅛ Vulgar fraction one eighth
      ⅜ Vulgar fraction three eighths
      ⅝ Vulgar fraction five eighths
      ⅞ Vulgar fraction seven eighths
      ⅑ Vulgar fraction one ninth
      ⅒ Vulgar fraction one tenth
      ↉ Vulgar fraction zero thirds
      ⁄ Fraction slash
    `,
  },
  {
    id: 'super-sub',
    name: 'Superscript & subscript',
    block: `
      ⁰ Superscript zero
      ¹ Superscript one
      ² Superscript two (squared)
      ³ Superscript three (cubed)
      ⁴ Superscript four
      ⁵ Superscript five
      ⁶ Superscript six
      ⁷ Superscript seven
      ⁸ Superscript eight
      ⁹ Superscript nine
      ⁺ Superscript plus sign
      ⁻ Superscript minus
      ⁼ Superscript equals sign
      ⁽ Superscript left parenthesis
      ⁾ Superscript right parenthesis
      ⁿ Superscript latin small letter n
      ⁱ Superscript latin small letter i
      ₀ Subscript zero
      ₁ Subscript one
      ₂ Subscript two
      ₃ Subscript three
      ₄ Subscript four
      ₅ Subscript five
      ₆ Subscript six
      ₇ Subscript seven
      ₈ Subscript eight
      ₉ Subscript nine
      ₊ Subscript plus sign
      ₋ Subscript minus
      ₌ Subscript equals sign
      ₍ Subscript left parenthesis
      ₎ Subscript right parenthesis
      ₐ Subscript small letter a
      ₑ Subscript small letter e
      ₒ Subscript small letter o
      ₓ Subscript small letter x
    `,
  },
  {
    id: 'punctuation',
    name: 'Punctuation & typography',
    block: `
      – En dash
      — Em dash
      ‑ Non-breaking hyphen
      … Horizontal ellipsis
      · Middle dot
      • Bullet
      ‣ Triangular bullet
      ◦ White bullet
      ⁃ Hyphen bullet
      ※ Reference mark
      ‘ Left single quotation mark
      ’ Right single quotation mark (apostrophe)
      “ Left double quotation mark
      ” Right double quotation mark
      „ Double low-9 quotation mark
      ‚ Single low-9 quotation mark
      ¡ Inverted exclamation mark
      ¿ Inverted question mark
      ‼ Double exclamation mark
      ⁇ Double question mark
      ⁈ Question exclamation mark
      ⁉ Exclamation question mark
      ‽ Interrobang
      § Section sign
      ¶ Pilcrow (paragraph) sign
      † Dagger
      ‡ Double dagger
      ¦ Broken bar
      ‖ Double vertical line
      ⁓ Swung dash
      〃 Ditto mark
      № Numero sign
      ℅ Care of
      ª Feminine ordinal indicator
      º Masculine ordinal indicator
      ⸮ Reversed question mark
      ⁊ Tironian sign et
      & Ampersand
      ﹠ Small ampersand
    `,
  },
  {
    id: 'legal',
    name: 'Legal & business',
    block: `
      © Copyright sign
      ® Registered sign
      ™ Trade mark sign
      ℠ Service mark
      ℗ Sound recording copyright
      🄯 Copyleft symbol
      ℡ Telephone sign
      ℻ Facsimile sign
      ✉ Envelope
      ☎ Black telephone
      ✆ Telephone location sign
      ⌘ Place of interest sign (Command key)
      ⌥ Option key
      ⇧ Upwards white arrow (Shift key)
      ⌃ Up arrowhead (Control key)
      ⎋ Broken circle with northwest arrow (Escape)
      ⏎ Return symbol
      ⌫ Erase to the left (Backspace)
      ⌦ Erase to the right (Delete)
      ⇥ Rightwards arrow to bar (Tab)
      ⏏ Eject symbol
      ⏻ Power symbol
      ⓘ Circled latin small letter i (info)
      ⚠ Warning sign
      ⛔ No entry
      ♻ Black universal recycling symbol
      ♿ Wheelchair symbol
      ⚡ High voltage sign
    `,
  },
  {
    id: 'greek',
    name: 'Greek letters',
    block: `
      Α Greek capital alpha
      α Greek small alpha
      Β Greek capital beta
      β Greek small beta
      Γ Greek capital gamma
      γ Greek small gamma
      Δ Greek capital delta
      δ Greek small delta
      Ε Greek capital epsilon
      ε Greek small epsilon
      Ζ Greek capital zeta
      ζ Greek small zeta
      Η Greek capital eta
      η Greek small eta
      Θ Greek capital theta
      θ Greek small theta
      Ι Greek capital iota
      ι Greek small iota
      Κ Greek capital kappa
      κ Greek small kappa
      Λ Greek capital lambda
      λ Greek small lambda
      Μ Greek capital mu
      μ Greek small mu
      Ν Greek capital nu
      ν Greek small nu
      Ξ Greek capital xi
      ξ Greek small xi
      Ο Greek capital omicron
      ο Greek small omicron
      Π Greek capital pi
      π Greek small pi
      Ρ Greek capital rho
      ρ Greek small rho
      Σ Greek capital sigma
      σ Greek small sigma
      ς Greek small final sigma
      Τ Greek capital tau
      τ Greek small tau
      Υ Greek capital upsilon
      υ Greek small upsilon
      Φ Greek capital phi
      φ Greek small phi
      Χ Greek capital chi
      χ Greek small chi
      Ψ Greek capital psi
      ψ Greek small psi
      Ω Greek capital omega
      ω Greek small omega
    `,
  },
  {
    id: 'accents',
    name: 'Accented letters',
    block: `
      á Latin small a with acute
      à Latin small a with grave
      â Latin small a with circumflex
      ä Latin small a with diaeresis
      ã Latin small a with tilde
      å Latin small a with ring above
      ā Latin small a with macron
      æ Latin small ae
      ç Latin small c with cedilla
      č Latin small c with caron
      ć Latin small c with acute
      é Latin small e with acute
      è Latin small e with grave
      ê Latin small e with circumflex
      ë Latin small e with diaeresis
      ē Latin small e with macron
      ě Latin small e with caron
      ę Latin small e with ogonek
      ğ Latin small g with breve
      í Latin small i with acute
      ì Latin small i with grave
      î Latin small i with circumflex
      ï Latin small i with diaeresis
      ı Latin small dotless i
      ł Latin small l with stroke
      ñ Latin small n with tilde
      ń Latin small n with acute
      ó Latin small o with acute
      ò Latin small o with grave
      ô Latin small o with circumflex
      ö Latin small o with diaeresis
      õ Latin small o with tilde
      ø Latin small o with stroke
      ő Latin small o with double acute
      œ Latin small ligature oe
      ř Latin small r with caron
      ß Latin small sharp s (eszett)
      ś Latin small s with acute
      š Latin small s with caron
      ş Latin small s with cedilla
      ú Latin small u with acute
      ù Latin small u with grave
      û Latin small u with circumflex
      ü Latin small u with diaeresis
      ů Latin small u with ring above
      ű Latin small u with double acute
      ý Latin small y with acute
      ÿ Latin small y with diaeresis
      ž Latin small z with caron
      ż Latin small z with dot above
      ź Latin small z with acute
      ð Latin small eth
      þ Latin small thorn
      Á Latin capital A with acute
      Ä Latin capital A with diaeresis
      Å Latin capital A with ring above
      Æ Latin capital AE
      Ç Latin capital C with cedilla
      É Latin capital E with acute
      È Latin capital E with grave
      Ñ Latin capital N with tilde
      Ö Latin capital O with diaeresis
      Ø Latin capital O with stroke
      Ü Latin capital U with diaeresis
      ẞ Latin capital sharp s
    `,
  },
  {
    id: 'shapes',
    name: 'Shapes & lines',
    block: `
      ■ Black square
      □ White square
      ▪ Black small square
      ▫ White small square
      ▬ Black rectangle
      ▭ White rectangle
      ◆ Black diamond
      ◇ White diamond
      ◈ White diamond containing black small diamond
      ❖ Black diamond minus white x
      ⬟ Black pentagon
      ⬢ Black hexagon
      ⬡ White hexagon
      △ White up-pointing triangle
      ▽ White down-pointing triangle
      ◁ White left-pointing triangle
      ▷ White right-pointing triangle
      ◢ Black lower right triangle
      ◣ Black lower left triangle
      ◤ Black upper left triangle
      ◥ Black upper right triangle
      ◐ Circle with left half black
      ◑ Circle with right half black
      ◒ Circle with lower half black
      ◓ Circle with upper half black
      ◔ Circle with upper right quadrant black
      ◌ Dotted circle
      █ Full block
      ▓ Dark shade
      ▒ Medium shade
      ░ Light shade
      ▀ Upper half block
      ▄ Lower half block
      ▌ Left half block
      ▐ Right half block
      ─ Box drawings light horizontal
      │ Box drawings light vertical
      ┌ Box drawings light down and right
      ┐ Box drawings light down and left
      └ Box drawings light up and right
      ┘ Box drawings light up and left
      ├ Box drawings light vertical and right
      ┤ Box drawings light vertical and left
      ┬ Box drawings light down and horizontal
      ┴ Box drawings light up and horizontal
      ┼ Box drawings light vertical and horizontal
      ═ Box drawings double horizontal
      ║ Box drawings double vertical
      ╔ Box drawings double down and right
      ╗ Box drawings double down and left
      ╚ Box drawings double up and right
      ╝ Box drawings double up and left
      ╭ Box drawings light arc down and right
      ╮ Box drawings light arc down and left
      ╰ Box drawings light arc up and right
      ╯ Box drawings light arc up and left
    `,
  },
  {
    id: 'misc',
    name: 'Weather, music & more',
    block: `
      ☀ Black sun with rays
      ☁ Cloud
      ☂ Umbrella
      ☔ Umbrella with rain drops
      ☃ Snowman
      ☄ Comet
      ☼ White sun with rays
      ☾ Last quarter moon
      ☽ First quarter moon
      ♪ Eighth note
      ♫ Beamed eighth notes
      ♩ Quarter note
      ♬ Beamed sixteenth notes
      ♭ Music flat sign
      ♮ Music natural sign
      ♯ Music sharp sign
      𝄞 Musical symbol G clef
      ☮ Peace symbol
      ☯ Yin yang
      ☪ Star and crescent
      ✝ Latin cross
      ✡ Star of David
      ☸ Wheel of dharma
      ♈ Aries
      ♉ Taurus
      ♊ Gemini
      ♋ Cancer
      ♌ Leo
      ♍ Virgo
      ♎ Libra
      ♏ Scorpius
      ♐ Sagittarius
      ♑ Capricorn
      ♒ Aquarius
      ♓ Pisces
      ♠ Black spade suit
      ♣ Black club suit
      ♦ Black diamond suit
      ♤ White spade suit
      ♧ White club suit
      ♢ White diamond suit
      ♔ White chess king
      ♕ White chess queen
      ♖ White chess rook
      ♗ White chess bishop
      ♘ White chess knight
      ♙ White chess pawn
      ♚ Black chess king
      ♛ Black chess queen
      ⚀ Die face-1
      ⚁ Die face-2
      ⚂ Die face-3
      ⚃ Die face-4
      ⚄ Die face-5
      ⚅ Die face-6
      ☕ Hot beverage
      ⌛ Hourglass
      ⏰ Alarm clock
      ⌚ Watch
      ☠ Skull and crossbones
      ⚓ Anchor
      ⚙ Gear
      ⚖ Scales
      ⚔ Crossed swords
      ✂ Black scissors
      ✏ Pencil
      ✒ Black nib
      ☛ Black right pointing index
      ☚ Black left pointing index
      ✌ Victory hand
      ☺ White smiling face
      ☹ White frowning face
      ♂ Male sign
      ♀ Female sign
      ⚧ Male with stroke and male and female sign
      ⚥ Male and female sign
    `,
  },
];

export const SYMBOL_GROUPS: SymbolGroup[] = RAW.map((g) => ({
  id: g.id,
  name: g.name,
  symbols: parse(g.block),
}));

export const codePointLabel = (char: string) =>
  Array.from(char)
    .map(
      (c) =>
        `U+${c.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')}`,
    )
    .join(' ');

export const htmlEntity = (char: string) =>
  Array.from(char)
    .map((c) => `&#x${c.codePointAt(0)!.toString(16).toUpperCase()};`)
    .join('');

export const cssEscape = (char: string) =>
  Array.from(char)
    .map((c) => `\\${c.codePointAt(0)!.toString(16).toUpperCase()}`)
    .join('');

export function searchSymbols(query: string, groupId = 'all') {
  const q = query.trim().toLowerCase();
  const groups =
    groupId === 'all'
      ? SYMBOL_GROUPS
      : SYMBOL_GROUPS.filter((g) => g.id === groupId);
  return groups
    .map((g) => ({
      ...g,
      symbols: q
        ? g.symbols.filter(
            (s) =>
              s.char === query.trim() ||
              s.name.toLowerCase().includes(q) ||
              codePointLabel(s.char).toLowerCase().includes(q),
          )
        : g.symbols,
    }))
    .filter((g) => g.symbols.length);
}
