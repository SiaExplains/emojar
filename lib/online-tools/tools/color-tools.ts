import type { ToolDefinition } from '../types';

type Fmt = 'hex' | 'rgb' | 'hsl';
const LABEL: Record<Fmt, string> = { hex: 'HEX', rgb: 'RGB', hsl: 'HSL' };
const EXPLAIN: Record<Fmt, string> = {
  hex: 'HEX codes write a color as #RRGGBB — two hexadecimal digits each for red, green and blue (00–FF).',
  rgb: 'RGB writes a color as three numbers from 0 to 255 for red, green and blue light, e.g. rgb(59, 130, 246).',
  hsl: 'HSL describes a color by hue (0–360°), saturation (0–100%) and lightness (0–100%), which makes it easy to create lighter or darker variants.',
};

function pair(
  from: Fmt,
  to: Fmt,
  sample: string,
  related: string[],
): ToolDefinition {
  const F = LABEL[from];
  const T = LABEL[to];
  return {
    slug: `${from}-to-${to}`,
    category: 'color-tools',
    name: `${F} to ${T}`,
    icon: '🎨',
    shortDescription: `Convert ${F} color codes to ${T}.`,
    description: `Convert ${F} colors to ${T} instantly. Type a ${F} value such as ${sample} or use the color picker, and copy the ${T} result — along with HEX, RGB, HSL, HSV and CMYK equivalents.`,
    title: `${F} to ${T} Converter – Convert ${F} Colors to ${T} Online`,
    metaDescription: `Convert ${F} to ${T} color codes online with a live preview. Copy CSS-ready ${T}, plus HEX, RGB, HSL, HSV and CMYK values.`,
    keywords: [
      `${from} to ${to}`,
      `${F} to ${T} converter`,
      `convert ${from} to ${to}`,
      'color converter',
    ],
    relatedTools: related,
    component: 'color-convert',
    config: { from, to },
    howTo: [
      `Enter a ${F} color (for example ${sample}) or pick one with the color picker.`,
      `Read the ${T} value — it updates as you type.`,
      'Click Copy next to any format.',
    ],
    about: [
      EXPLAIN[from],
      EXPLAIN[to],
      'All three are different ways of writing the same sRGB color, so converting between them never changes how the color looks.',
    ],
    faqs: [
      {
        q: `Can I enter ${F} without the usual syntax?`,
        a:
          from === 'hex'
            ? 'Yes — the # is optional, and 3-digit shorthand like #fa0 is expanded automatically.'
            : `Yes — plain numbers separated by commas or spaces work, e.g. ${from === 'rgb' ? '59, 130, 246' : '217, 91%, 60%'}.`,
      },
      {
        q: 'Is alpha (transparency) supported?',
        a: 'Yes. 8-digit HEX (#RRGGBBAA), rgba() and hsla() values keep their alpha channel.',
      },
    ],
  };
}

export const COLOR_TOOLS: ToolDefinition[] = [
  {
    slug: 'color-picker',
    category: 'color-tools',
    name: 'Color Picker',
    icon: '🎯',
    shortDescription: 'Pick colors and get HEX, RGB and HSL codes.',
    description:
      'Pick a color with the color wheel, the screen eyedropper (in supported browsers) or from an uploaded image, and copy its HEX, RGB, HSL, HSV and CMYK codes.',
    title: 'Color Picker – Get HEX, RGB & HSL Codes Online',
    metaDescription:
      'Online color picker with eyedropper and pick-from-image. Get HEX, RGB, HSL, HSV and CMYK codes instantly. Free and private.',
    keywords: [
      'color picker',
      'hex color picker',
      'eyedropper online',
      'pick color from image',
      'color code',
    ],
    relatedTools: [
      'color-converter',
      'color-palette-generator',
      'contrast-checker',
      'hex-to-rgb',
      'gradient-generator',
    ],
    component: 'color-picker',
    handlesFiles: true,
    howTo: [
      'Use the color input, or click “Pick from screen” (Chrome/Edge), or upload an image and click on it.',
      'See the color in every format.',
      'Copy the code you need.',
    ],
    about: [
      'The screen eyedropper uses the browser’s EyeDropper API, available in Chromium-based browsers. Picking from an image works in every browser and never uploads the image.',
    ],
    faqs: [
      {
        q: 'Why is “Pick from screen” missing?',
        a: 'Your browser does not support the EyeDropper API yet (Firefox and Safari). Use the image picker instead.',
      },
    ],
  },
  pair('hex', 'rgb', '#3b82f6', [
    'rgb-to-hex',
    'hex-to-hsl',
    'color-converter',
    'color-picker',
    'contrast-checker',
  ]),
  pair('rgb', 'hex', 'rgb(59, 130, 246)', [
    'hex-to-rgb',
    'rgb-to-hsl',
    'color-converter',
    'color-picker',
  ]),
  pair('hex', 'hsl', '#3b82f6', [
    'hsl-to-rgb',
    'hex-to-rgb',
    'color-palette-generator',
    'color-converter',
  ]),
  pair('rgb', 'hsl', 'rgb(59, 130, 246)', [
    'hsl-to-rgb',
    'rgb-to-hex',
    'color-converter',
  ]),
  pair('hsl', 'rgb', 'hsl(217, 91%, 60%)', [
    'rgb-to-hsl',
    'hex-to-hsl',
    'color-converter',
  ]),
  {
    slug: 'color-palette-generator',
    category: 'color-tools',
    name: 'Color Palette Generator',
    icon: '🌈',
    shortDescription: 'Generate harmonious color palettes.',
    description:
      'Generate color palettes from a base color using color theory — complementary, analogous, triadic, tetradic, monochromatic and tints & shades — and export them as CSS variables.',
    title: 'Color Palette Generator – Create Color Schemes Online',
    metaDescription:
      'Generate color palettes online: complementary, analogous, triadic, monochromatic and shades. Export CSS variables. Free.',
    keywords: [
      'color palette generator',
      'color scheme generator',
      'complementary colors',
      'color harmony',
    ],
    relatedTools: [
      'random-color-generator',
      'color-picker',
      'gradient-generator',
      'contrast-checker',
      'color-converter',
    ],
    component: 'color-palette',
    howTo: [
      'Pick a base color or press “Random”.',
      'Choose a harmony rule.',
      'Click any swatch to copy it, or copy all as CSS variables.',
    ],
    about: [
      'Harmony rules rotate the hue around the color wheel: complementary uses the opposite hue (180°), analogous uses neighbours (±30°), triadic uses three hues 120° apart.',
    ],
    faqs: [
      {
        q: 'Which scheme is best for a website?',
        a: 'A monochromatic or analogous palette for the main UI plus one complementary accent color for buttons and highlights is a reliable start.',
      },
    ],
  },
  {
    slug: 'gradient-generator',
    category: 'color-tools',
    name: 'CSS Gradient Generator',
    icon: '🌅',
    shortDescription: 'Create linear and radial CSS gradients.',
    description:
      'Design linear and radial CSS gradients with multiple color stops and angle control, preview them live and copy the CSS.',
    title: 'CSS Gradient Generator – Linear & Radial Gradients Online',
    metaDescription:
      'Create CSS linear and radial gradients online with live preview, multiple color stops and angle control. Copy the CSS instantly.',
    keywords: [
      'css gradient generator',
      'gradient generator',
      'linear gradient',
      'radial gradient',
      'background gradient',
    ],
    relatedTools: [
      'color-palette-generator',
      'color-picker',
      'css-formatter',
      'contrast-checker',
    ],
    component: 'gradient-generator',
    howTo: [
      'Choose linear or radial.',
      'Adjust the angle and the colors and positions of each stop; add up to 6 stops.',
      'Copy the generated CSS.',
    ],
    about: [
      'CSS gradients are generated by the browser, so they scale to any size without images and add no download weight.',
    ],
    faqs: [
      {
        q: 'Do gradients work in all browsers?',
        a: 'Yes — linear-gradient() and radial-gradient() are supported in every modern browser without prefixes.',
      },
    ],
  },
  {
    slug: 'contrast-checker',
    category: 'color-tools',
    name: 'Contrast Checker',
    icon: '♿',
    shortDescription: 'Check WCAG color contrast for accessibility.',
    description:
      'Check the contrast ratio between a text color and a background color and see whether it passes WCAG 2.2 AA and AAA for normal and large text.',
    title: 'Color Contrast Checker – WCAG AA & AAA Online',
    metaDescription:
      'Check color contrast ratios against WCAG 2.2 AA and AAA for text and UI components. Live preview and pass/fail results. Free.',
    keywords: [
      'contrast checker',
      'wcag contrast',
      'color contrast ratio',
      'accessibility contrast',
      'a11y colors',
    ],
    relatedTools: [
      'color-picker',
      'color-palette-generator',
      'hex-to-rgb',
      'color-converter',
    ],
    component: 'contrast-checker',
    howTo: [
      'Enter or pick the text and background colors.',
      'Read the contrast ratio and the pass/fail results.',
      'Use “Swap colors” or pick a darker or lighter shade until the checks pass.',
    ],
    about: [
      'WCAG requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text (18pt, or 14pt bold) at level AA; AAA requires 7:1 and 4.5:1. User-interface components and icons need 3:1.',
      'The ratio ranges from 1:1 (identical colors) to 21:1 (black on white).',
    ],
    faqs: [
      {
        q: 'Does the checker handle transparent colors?',
        a: 'Use solid colors. For semi-transparent text, check the color it actually appears as on the background.',
      },
    ],
  },
  {
    slug: 'color-converter',
    category: 'color-tools',
    name: 'Color Converter',
    icon: '🔄',
    shortDescription: 'Convert any color between HEX, RGB, HSL, HSV and CMYK.',
    description:
      'Paste any color — HEX, RGB, HSL or a CSS color name — and get it in every format: HEX, RGB, HSL, HSV and CMYK.',
    title: 'Color Converter – HEX, RGB, HSL, HSV & CMYK Online',
    metaDescription:
      'Convert colors between HEX, RGB, HSL, HSV and CMYK online. Accepts CSS color names. Copy any format instantly.',
    keywords: [
      'color converter',
      'color code converter',
      'hex rgb hsl',
      'cmyk converter',
    ],
    relatedTools: [
      'hex-to-rgb',
      'rgb-to-hex',
      'hex-to-hsl',
      'color-picker',
      'contrast-checker',
    ],
    component: 'color-convert',
    config: { from: 'any', to: 'all' },
    howTo: [
      'Type any color value or name, or use the picker.',
      'All formats update immediately.',
      'Copy the format you need.',
    ],
    about: [
      'CMYK values are a simple mathematical conversion for reference; printers use color profiles, so check with your print shop for exact results.',
    ],
    faqs: [
      {
        q: 'Which color names are supported?',
        a: 'Common CSS names such as red, navy, teal, coral and rebeccapurple.',
      },
    ],
  },
  {
    slug: 'color-name-explorer',
    category: 'color-tools',
    alsoIn: ['reference-tools'],
    name: 'Color Name Explorer',
    icon: '🏷️',
    shortDescription:
      'Find the name of any colour and browse 1,000+ named colours.',
    description:
      'Find the closest named colour to any HEX, RGB or HSL value — or pick one — and see it in HEX, RGB, HSL and HSB with the colour distance and similar names. Browse and search all 148 CSS colour keywords and the 949 names from the xkcd colour survey, sorted by hue, brightness, saturation or name.',
    title: 'Color Name Finder – What Is the Name of This Color?',
    metaDescription:
      'Find the name of any colour: enter HEX, RGB or HSL to get the closest CSS or common colour name, its distance and similar colours. Browse 1,097 named colours.',
    keywords: [
      'color name finder',
      'name that color',
      'hex to color name',
      'css color names',
      'color names list',
      'what color is this',
    ],
    relatedTools: [
      'color-converter',
      'color-picker',
      'random-color-generator',
      'color-palette-generator',
      'contrast-checker',
    ],
    component: 'color-names',
    howTo: [
      'Type a colour as HEX, RGB, HSL or a name — or use the picker.',
      'Read the closest named colour, its distance and the HEX, RGB, HSL and HSB values.',
      'Check the similar colours, or search and sort the full list below.',
      'Click any swatch to copy its HEX code and inspect it.',
    ],
    about: [
      'Matching uses CIEDE2000 (ΔE), the colour-difference formula designed to follow human vision rather than raw RGB numbers. A ΔE below 1 is indistinguishable, under 3 is very close, under 6 close, and above 12 the colours are only loosely similar — so the page tells you how good the “closest” name really is.',
      'The 148 CSS keywords (like rebeccapurple and cornflowerblue) can be used directly in stylesheets. The other names come from the xkcd colour survey, in which hundreds of thousands of people named random colours; its 949 most-agreed names (CC0) describe colours the way people actually talk about them, like “dusty rose” or “sage”.',
    ],
    faqs: [
      {
        q: 'How many CSS colour names are there?',
        a: '148, including aliases such as gray/grey and aqua/cyan. The newest is rebeccapurple (#663399), added in CSS Color Level 4.',
      },
      {
        q: 'Why doesn’t my colour have an exact name?',
        a: 'There are 16.7 million RGB colours and only about a thousand names, so most colours fall between names. The ΔE value shows how close the nearest one is.',
      },
    ],
  },
  {
    slug: 'gradient-mesh-generator',
    category: 'color-tools',
    alsoIn: ['image-tools'],
    name: 'Mesh Gradient Generator',
    icon: '🌈',
    shortDescription: 'Make soft multi-colour mesh gradients for CSS & PNG.',
    description:
      'Create soft, multi-point mesh gradients: drag 3 to 8 colour points, set each one’s opacity and radius and pick a background. Copy the result as pure CSS (layered radial gradients that work in every browser), as an SVG with a smoothing blur, or download a PNG at wallpaper or social sizes.',
    title: 'Mesh Gradient Generator – CSS, SVG & PNG Backgrounds',
    metaDescription:
      'Create mesh gradients online: drag colour points, tune opacity and softness, then copy CSS radial gradients or SVG, or download a PNG at 1920×1080 and more. Free.',
    keywords: [
      'mesh gradient generator',
      'gradient mesh',
      'css mesh gradient',
      'blurry gradient background',
      'aurora gradient',
      'multi color gradient',
      'gradient wallpaper',
    ],
    relatedTools: [
      'gradient-generator',
      'color-palette-generator',
      'color-picker',
      'random-color-generator',
      'svg-to-png',
    ],
    component: 'gradient-mesh',
    howTo: [
      'Start from a preset or press Randomize.',
      'Drag the numbered points on the preview, or select a point and type its position, change its colour, opacity and radius.',
      'Add up to 8 points, remove extras, change the background colour and optionally add film grain.',
      'Copy the CSS or SVG, or choose a size and download a PNG.',
    ],
    about: [
      'A mesh gradient blends several colours from points spread across an area rather than along one line. CSS has no native mesh gradient, but stacking several radial-gradient() layers — each a colour fading to transparent from its own position — over a background colour gives the same soft, “aurora” look, and it works in every modern browser without any image file.',
      'The SVG output draws the same gradients and adds a Gaussian blur so the colours melt together more smoothly; the PNG is rendered from that SVG at the size you pick. Use CSS for responsive page backgrounds and the SVG or PNG for wallpapers, slides and social images.',
    ],
    faqs: [
      {
        q: 'Why do the CSS and SVG previews look slightly different?',
        a: 'The SVG and PNG add a blur filter for smoother blending, which plain CSS gradients can’t do without filters. The CSS preview shows exactly what the copied CSS produces.',
      },
      {
        q: 'Will the CSS work in all browsers?',
        a: 'Yes. Layered radial-gradient() backgrounds with positions are supported by all current browsers, including Safari and mobile browsers.',
      },
      {
        q: 'How do I make the gradient softer?',
        a: 'Increase each point’s radius so the colours overlap more, lower the opacity of strong colours, or use the SVG/PNG output, which adds a blur.',
      },
    ],
  },
  {
    slug: 'color-blindness-simulator',
    category: 'color-tools',
    alsoIn: ['image-tools'],
    name: 'Color Blindness Simulator',
    icon: '👁️',
    shortDescription: 'Preview images & palettes as colour-blind people see.',
    description:
      'See how charts, interfaces and photos may look with protanopia, deuteranopia, tritanopia, achromatopsia and the milder anomalous forms. Compare original and simulated views side by side, use the built-in demo or your own image, and check a palette for colour pairs that become hard to tell apart.',
    title: 'Color Blindness Simulator – Check Images & Palettes',
    metaDescription:
      'Simulate protanopia, deuteranopia, tritanopia and achromatopsia on images, charts and palettes. Side-by-side view, confusable colour pairs, private and in-browser.',
    keywords: [
      'color blindness simulator',
      'colorblind simulator',
      'deuteranopia simulator',
      'protanopia',
      'tritanopia',
      'color blind palette checker',
      'accessible colors',
    ],
    relatedTools: [
      'contrast-checker',
      'color-palette-generator',
      'color-picker',
      'color-converter',
      'gradient-mesh-generator',
    ],
    component: 'color-blindness',
    handlesFiles: true,
    limitation:
      'An approximation based on a published model, not a medical test. Real colour vision varies between people.',
    howTo: [
      'Pick a vision type. For the -anomaly types, set the severity.',
      'Switch between Original, Simulated and Side by side, or turn the simulation off and on to compare.',
      'Choose your own image (it is processed on your device, never uploaded), or use the demo dashboard.',
      'Enter your brand or chart colours in the palette checker to find pairs that become hard to tell apart, and download the simulated image as PNG.',
    ],
    about: [
      'Around 1 in 12 men and 1 in 200 women have some form of colour vision deficiency. In the red–green types (protan and deutan), one kind of cone is missing or shifted, so reds, greens, browns and oranges can look alike; in the rare tritan type, blues and greens and yellows and pinks are confused. Achromatopsia means seeing almost no colour at all.',
      'This simulator applies the matrices published by Machado, Oliveira and Fernandes (2009) in linear RGB, which is the physically correct space for the model; anomalous forms blend between normal vision and the full deficiency by the severity you choose. The palette checker compares colours with the CIEDE2000 difference formula and flags pairs whose difference drops below about 10 after simulation.',
    ],
    faqs: [
      {
        q: 'Is this a colour blindness test?',
        a: 'No. It shows an approximation of how colours may appear to people with colour vision deficiencies. To find out about your own vision, see an optometrist or use a clinical test such as Ishihara plates under proper conditions.',
      },
      {
        q: 'Which type should I design for?',
        a: 'Deuteranomaly and protanomaly (the red–green types) are by far the most common, so check those first. Don’t rely on colour alone: add labels, patterns, icons or text so information survives any colour vision.',
      },
      {
        q: 'Are my images uploaded?',
        a: 'No. Images are decoded and processed on a canvas in your browser and never leave your device. Very large images are scaled down to keep things fast.',
      },
      {
        q: 'What do the ΔE numbers mean?',
        a: 'ΔE is a perceptual colour difference (CIEDE2000). Around 2 is barely noticeable; below about 10, two colours used side by side in a chart can easily be mistaken for each other.',
      },
    ],
  },
];
