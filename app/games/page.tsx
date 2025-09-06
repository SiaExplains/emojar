const games = [
    {
        name: "XO Game",
        path: "/games/xo",
        description: "Play classic tic-tac-toe using fun emojis.",
        emoji: "❌⭕️",
    },
    {
        name: "Snake Game",
        path: "/games/snake",
        description: "Guide your emoji snake to eat and grow.",
        emoji: "🐍🍏",
    },
    {
        name: "Minesweeper",
        path: "/games/minesweeper",
        description: "Uncover emoji tiles and avoid hidden bombs.",
        emoji: "💣🟦",
    },
    {
        name: "Hangman",
        path: "/games/hangman",
        description: "Guess the emoji word before you run out of tries.",
        emoji: "🤔🔤",
    },
    {
        name: "Bubble Shooter",
        path: "/games/bubble-shooter",
        description: "Match and pop emoji bubbles for points.",
        emoji: "🫧🎯",
    },
];

const GamesPage = () => {
    return (
        <div className="min-h-screen py-10">
            <h1 className="text-3xl font-bold text-center mb-8">Emoji Games Gallery</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {games.map((game) => (
                    <a
                        key={game.path}
                        href={game.path}
                        className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 flex flex-col items-center text-center group"
                    >
                        <div className="text-5xl mb-4 group-hover:scale-110 transition">{game.emoji}</div>
                        <div className="font-semibold text-lg mb-2">{game.name}</div>
                        <div className="text-gray-500 text-sm">{game.description}</div>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default GamesPage;
