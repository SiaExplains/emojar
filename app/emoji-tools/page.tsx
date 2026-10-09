import Link from 'next/link';

const tools = [
  {
    name: 'Emoji to PNG',
    path: '/emoji-to-png',
    description: 'Download any emoji as a PNG image at up to 1024×1024px.',
    emoji: '🖼️',
    color: 'from-violet-100 to-violet-200',
  },
  {
    name: 'Personality Quiz',
    path: '/personality',
    description: '12 questions → discover your 5 emoji personality matches.',
    emoji: '🪞',
    color: 'from-pink-100 to-rose-200',
  },
  {
    name: 'Favicon Generator',
    path: '/emoji-favicon',
    description: 'Turn any emoji into a favicon.ico or icon PNG in seconds.',
    emoji: '🏠',
    color: 'from-amber-100 to-yellow-200',
  },
  {
    name: 'Color Palette',
    path: '/emoji-color-palette',
    description: 'Extract the dominant colors from any emoji.',
    emoji: '🎨',
    color: 'from-emerald-100 to-teal-200',
  },
  {
    name: 'Watermark Tool',
    path: '/emoji-watermark',
    description: 'Add an emoji watermark to any image you upload.',
    emoji: '🖼️',
    color: 'from-sky-100 to-cyan-200',
  },
  {
    name: 'Social Card',
    path: '/emoji-card',
    description: 'Create a shareable 1080×1080 social media card with emoji.',
    emoji: '🃏',
    color: 'from-brand-100 to-blue-200',
  },
  {
    name: 'Unicode Inspector',
    path: '/emoji-inspector',
    description:
      "Paste any text and inspect every character's Unicode details.",
    emoji: '🔍',
    color: 'from-lime-100 to-green-200',
  },
  {
    name: 'Emoji Kitchen',
    path: '/emoji-kitchen',
    description: 'Combine two emojis using Google Emoji Kitchen.',
    emoji: '🍳',
    color: 'from-orange-100 to-amber-200',
  },
];

const EmojiToolsPage = () => {
  return (
    <section className="space-y-10 py-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">
          🛠️ Emoji Tools
        </h1>
        <p className="text-gray-500 max-w-2xl">
          {tools.length} free emoji utilities — from converting emojis to PNG
          images and generating favicons, to extracting color palettes, creating
          social cards, and inspecting Unicode. No sign-up required.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tools.map((tool) => (
          <Link
            key={tool.path}
            href={tool.path}
            className="group flex flex-col rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 no-underline bg-white"
          >
            <div
              className={`bg-gradient-to-br ${tool.color} flex items-center justify-center py-6 text-4xl`}
            >
              {tool.emoji}
            </div>
            <div className="px-3 py-3 flex flex-col gap-0.5">
              <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                {tool.name}
              </p>
              <p className="text-xs text-gray-400 leading-snug line-clamp-2">
                {tool.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default EmojiToolsPage;
