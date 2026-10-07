'use client';
import { useState } from 'react';
import SmallEmojiCard from './SmallEmojiCard';
import { Emoji } from '@/components/EmojiHub';

type AlphabetSortedProps = {
  char: string;
  emojis: Emoji[];
};

const AlphabetSorted = ({ char, emojis }: AlphabetSortedProps) => {
  const [copied, setCopied] = useState<string | null>(null);
  return (
    <div className="flex flex-col  mb-10 w-full gap-2.5 p-5">
      <div>
        <h2
          className="text-2xl font-bold tracking-tight text-gray-900 mb-4 ml-2"
          id={char.toLocaleLowerCase()}
        >
          Emojis start with '{char}'
        </h2>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-1">
          {emojis.map((emoji, index) => (
            <SmallEmojiCard
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
