import Link from "next/link";
import AlphabetSorted from "@/components/AlphabetSorted";
import data from "@/data/emojis.json";

const AlphabetPage = () => {
  const letters = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Alphabetic sorted emojis</h1>
      <div className="flex flex-wrap gap-2 mb-4">
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
      {letters.map((letter, index) => (
        <AlphabetSorted
          key={`alphabet-section-${letter}-index-${index}`}
          char={letter}
          emojis={data.filter((e) =>
            e.name.toLocaleLowerCase().startsWith(letter.toLocaleLowerCase())
          )}
        />
      ))}
    </div>
  );
};

export default AlphabetPage;
