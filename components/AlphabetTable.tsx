'use client';

import Link from 'next/link';

const letters = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i),
);

// Regional indicator symbols are Unicode pairs 🇦 = U+1F1E6
const regionalIndicator = (char: string) => {
  const code = char.charCodeAt(0) - 65 + 0x1f1e6;
  return String.fromCodePoint(code);
};

// Emoji alphabet approximations
const emojiMap: Record<string, string> = {
  A: '🅰️🔼🗼',
  B: '🅱️👍',
  C: '©️🌔🌜🥐🗜️↪️🧲',
  D: '👂🐬🧲↩️▶️',
  E: '📧💅',
  F: '🎏',
  G: '🌀⛽💽',
  H: '🈂️🙌♓🛏',
  I: 'ℹ️🕯️🌡️📍ℹ',
  J: '🗾🌶️🤳🦶🏒🎷',
  K: '🦿🦵🎋',
  L: '💪🦾🛴👢',
  M: '〽️Ⓜ️',
  N: '🎶📈',
  O: '🅾️🍪🌀⭕',
  P: '🅿️⛳',
  Q: '🍳👁️‍🗨️📯',
  R: '🌈®️💃',
  S: '💲⚡💰',
  T: '✝️🏋️🏋️‍♂️🏋️‍♀️☂️⬆️🌴',
  U: '⛎👅🐋',
  V: '♈✅☑️✔️🖖🔽',
  W: '🔱〰️',
  X: '❎✖️❌🤞⚒️🛠️',
  Y: '🍸✌️🌱🦞',
  Z: '⚡💤',
};

export default function AlphabetTable() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 text-sm text-center rounded-lg shadow-sm">
        <thead className="bg-gray-100 text-gray-700 uppercase">
          <tr>
            <th className="px-4 py-2 border">Letter</th>
            <th className="px-4 py-2 border">Regional Indicator</th>
            <th className="px-4 py-2 border">Emoji Alphabet</th>
          </tr>
        </thead>
        <tbody>
          {letters.map((letter) => (
            <tr
              key={letter}
              className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
            >
              <td className="px-4 py-2 border font-semibold underline text-blue-600">
                <Link
                  href={`/collection/alphabet#${letter.toLocaleLowerCase()}`}
                >
                  {letter}
                </Link>
              </td>
              <td className="px-4 py-2 border text-lg">
                {regionalIndicator(letter)}
              </td>
              <td className="px-4 py-2 border text-lg">{emojiMap[letter]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
