'use client';
import { useState } from 'react';
import EmojiCard from './EmojiCard';
import { Emoji } from '@/app/page';

type AlphabetSortedProps = {
  char: string;
  emojis: Emoji[];
};

const AlphabetSorted = ({ char, emojis }: AlphabetSortedProps) => {
  const [copied, setCopied] = useState<string | null>(null);
  return (
    <div className="flex flex-col items-center justify-center mb-10 w-full gap-2.5 p-5">
      <div>
        <h2
          className="text-2xl font-bold tracking-tight text-gray-900 mb-4 ml-2"
          id={char.toLocaleLowerCase()}
        >
          Emoji starts with: {char}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {emojis.map((emoji, index) => (
            <EmojiCard
              key={`${emoji.slug}-${index}`}
              emoji={emoji}
              onCopied={setCopied}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlphabetSorted;
