import Link from "next/link";
import "./page.css";
import AlphabetSorted from "@/components/AlphabetSorted";
import data from "@/data/emojis.json";

const AlphabetPage = () => {
  const letters = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  return (
    <div className="alphabet-page">
      <h1 className="title">Alphabetic sorted emojis</h1>
      <div className="alphabet-links">
        {letters.map((letter, index) => (
          <Link
            key={`alphabet-section-${letter}-index-${index}`}
            href={`#${letter.toLowerCase()}`}
            className="align-link"
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
