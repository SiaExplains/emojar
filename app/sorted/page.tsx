import Link from 'next/link';

const SortedPage = () => {
  const letters = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i),
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sorted Emojis</h1>
        <div className="flex flex-wrap gap-2 mb-4">
            <ul>
                <li>
                    <Link
                        href="/sorted/emoji-alphabet-shaped"
                        className="py-2 px-4 underline text-[#3505b9]"
                    >
                        Alphabet Shaped Emojis
                    </Link>
                </li>
                <li>
                    <Link
                        href="/sorted/alphabet"
                        className="py-2 px-4 underline text-[#3505b9]"
                    >
                        Sorted Emoji by Alphabet
                    </Link>
                </li>
                <li>
                    <Link
                        href="/sorted/detail"
                        className="py-2 px-4 underline text-[#3505b9]"
                    >
                        Emoji with Detail
                    </Link>
                </li>
            </ul>
        </div>
    </div>
  );
};

export default SortedPage;
