import data from '@/data/emojis.json';
import Link from 'next/link';

const AlphabetShapedPage = () => {
  const letters = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i),
  );
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Alphabet shaped emojis</h1>
      {letters.map((letter, index) => (
        <Link
          key={`alphabet-section-${letter}-index-${index}`}
          href={`#${letter.toLowerCase()}`}
          className="py-2 px-4 underline text-[#3505b9]"
        >
          {letter}
        </Link>
      ))}
    </div>
  );
};

export default AlphabetShapedPage;
