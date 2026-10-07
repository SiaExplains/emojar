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
      'Check color contrast ratios against WCAG 2.2 AA and AAA for text and UI components. Live preview and suggestions. Free.',
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
      'Use “Swap” or adjust lightness until the checks pass.',
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
];
