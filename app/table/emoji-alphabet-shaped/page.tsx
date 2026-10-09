import AlphabetTable from '@/components/AlphabetTable';

const AlphabetShapedPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Alphabet Table</h1>
      <p>
        Explore the alphabet represented with emojis in a fun and interactive
        table. Each letter is paired with a unique emoji to help you learn and
        enjoy the alphabet visually.
      </p>
      <br />
      <AlphabetTable />
    </div>
  );
};

export default AlphabetShapedPage;
